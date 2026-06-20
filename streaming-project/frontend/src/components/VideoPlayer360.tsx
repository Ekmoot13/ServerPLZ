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
  const hlsRef = useRef<Hls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState(true);

  // Tylko poziomy obrót — lat zawsze 0 (horyzont)
  const lon = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Ukryty element video
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.playsInline = true;
    video.muted = true;
    video.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;";
    document.body.appendChild(video);

    // HLS setup
    const setupHls = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          liveSyncDurationCount: 2,
          liveMaxLatencyDurationCount: 4,
          liveBackBufferLength: 0,
          maxBufferLength: 5,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
          setLoading(false);
          setTimeout(() => setHint(false), 4000);
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setError("Nie można załadować transmisji.");
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        video.addEventListener("loadedmetadata", () => {
          if (video.seekable.length > 0) {
            video.currentTime = video.seekable.end(video.seekable.length - 1);
          }
          video.play().catch(() => {});
          setLoading(false);
        });
      } else {
        setError("Przeglądarka nie obsługuje HLS.");
      }
    };

    setupHls();

    // Three.js — sfera 360°
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 450;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    // FoV 90° — naturalny widok panoramiczny
    const camera = new THREE.PerspectiveCamera(90, w / h, 0.1, 1000);

    // Sfera renderowana od środka
    const geometry = new THREE.SphereGeometry(500, 64, 32);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Obsługa myszy — tylko poziomo
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastX.current = e.clientX;
      renderer.domElement.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      lon.current -= (e.clientX - lastX.current) * 0.25;
      lastX.current = e.clientX;
    };
    const onMouseUp = () => {
      isDragging.current = false;
      renderer.domElement.style.cursor = "grab";
    };

    // Obsługa dotyku — tylko poziomo
    const onTouchStart = (e: TouchEvent) => {
      lastX.current = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      lon.current -= (e.touches[0].clientX - lastX.current) * 0.35;
      lastX.current = e.touches[0].clientX;
    };

    // Scroll = zoom
    const onWheel = (e: WheelEvent) => {
      camera.fov = Math.max(40, Math.min(110, camera.fov + e.deltaY * 0.04));
      camera.updateProjectionMatrix();
    };

    // Resize
    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);

    // Pętla renderowania — kamera zawsze na horyzoncie (lat=0)
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        texture.needsUpdate = true;
      }
      const theta = THREE.MathUtils.degToRad(lon.current);
      // lat=0 → phi=90° → patrzymy poziomo na horyzont
      camera.lookAt(
        500 * Math.sin(Math.PI / 2) * Math.cos(theta),
        0,
        500 * Math.sin(Math.PI / 2) * Math.sin(theta)
      );
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      hlsRef.current?.destroy();
      renderer.dispose();
      texture.dispose();
      material.dispose();
      geometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      video.remove();
    };
  }, [hlsUrl]);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-black"
      style={{ aspectRatio: "16/9" }}
    >
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ cursor: "grab" }}
      />

      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 pointer-events-none">
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
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Odśwież
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            NA ŻYWO
          </span>
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">360°</span>
        </div>
      )}

      {hint && !loading && !error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-2 rounded-full z-10 pointer-events-none whitespace-nowrap">
          ← Przeciągnij aby rozejrzeć się dookoła →
        </div>
      )}
    </div>
  );
}
