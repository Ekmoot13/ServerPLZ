"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import * as THREE from "three";

interface Props {
  hlsUrl: string;
  title?: string;
}

export default function VideoPlayer360({ hlsUrl, title }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState(true);

  // Stan kamery
  const lon = useRef(0);
  const lat = useRef(0);
  const isDown = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Ukryty element video — HLS ładuje do niego strumień
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.playsInline = true;
    video.muted = true;
    video.loop = false;
    video.style.display = "none";
    document.body.appendChild(video);
    videoRef.current = video;

    // HLS setup
    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 5,
        liveBackBufferLength: 0,   // brak bufora wstecznego — tylko na żywo
        maxBufferLength: 8,
      });
      hlsRef.current = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
        setLoading(false);
        setTimeout(() => setHint(false), 4000);
      });
      // Jeśli widz zbyt daleko od live edge — wróć automatycznie
      hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
        if (data.details.live && video.buffered.length > 0) {
          const liveEdge = video.buffered.end(video.buffered.length - 1);
          if (liveEdge - video.currentTime > 10) {
            video.currentTime = liveEdge - 1;
          }
        }
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setError("Nie można załadować transmisji.");
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        // Safari — skocz na koniec bufora (live edge)
        if (video.seekable.length > 0) {
          video.currentTime = video.seekable.end(video.seekable.length - 1);
        }
        video.play().catch(() => {});
        setLoading(false);
      });
    } else {
      setError("Przeglądarka nie obsługuje HLS.");
      return;
    }

    // Three.js
    const w = container.clientWidth;
    const h = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

    // Sfera — renderowana od środka (skala -1 na X odwraca normalne)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Obsługa myszy
    const onMouseDown = (e: MouseEvent) => {
      isDown.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown.current) return;
      lon.current -= (e.clientX - lastPos.current.x) * 0.3;
      lat.current += (e.clientY - lastPos.current.y) * 0.3;
      lat.current = Math.max(-85, Math.min(85, lat.current));
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDown.current = false; };

    // Obsługa dotyku (telefon / tablet)
    const onTouchStart = (e: TouchEvent) => {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      lon.current -= (e.touches[0].clientX - lastTouch.current.x) * 0.4;
      lat.current += (e.touches[0].clientY - lastTouch.current.y) * 0.4;
      lat.current = Math.max(-85, Math.min(85, lat.current));
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    // Scroll = zoom
    const onWheel = (e: WheelEvent) => {
      camera.fov = Math.max(30, Math.min(100, camera.fov + e.deltaY * 0.05));
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });

    // Resize
    const onResize = () => {
      const w2 = container.clientWidth;
      const h2 = container.clientHeight;
      renderer.setSize(w2, h2);
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Pętla renderowania
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const phi = THREE.MathUtils.degToRad(90 - lat.current);
      const theta = THREE.MathUtils.degToRad(lon.current);
      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      hlsRef.current?.destroy();
      renderer.dispose();
      video.remove();
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hlsUrl]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: "16/9" }}>
      <div ref={mountRef} className="w-full h-full" style={{ cursor: "grab" }} />

      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Ładowanie transmisji 360°...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center px-6">
            <div className="text-4xl mb-3">📡</div>
            <p className="text-red-400 font-medium">{error}</p>
            <button onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Odśwież
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            NA ŻYWO
          </span>
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">360°</span>
        </div>
      )}

      {hint && !loading && !error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-2 rounded-full z-10 pointer-events-none">
          Przeciągnij aby rozejrzeć się dookoła · Scroll = zoom
        </div>
      )}
    </div>
  );
}
