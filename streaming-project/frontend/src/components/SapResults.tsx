"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SapClass {
  name?: string;
  className?: string;
  results?: SapBoat[];
  rankings?: SapBoat[];
  boats?: SapBoat[];
}

interface SapBoat {
  rank?: number;
  position?: number;
  boatName?: string;
  name?: string;
  sailNumber?: string;
  helmName?: string;
  helm?: string;
  points?: number;
  totalPoints?: number;
  nett?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SapData = Record<string, any>;

export default function SapResults({ sapEventId }: { sapEventId: string }) {
  const [data, setData] = useState<SapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/proxy/sap?url=${encodeURIComponent(sapEventId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [sapEventId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        Ładowanie wyników z SAP Sailing...
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 text-sm py-2">Błąd ładowania wyników: {error}</p>;
  }

  if (!data) return null;

  const classes: SapClass[] =
    data.classes || data.raceClasses || data.categories || [];

  if (classes.length === 0) {
    return (
      <div className="mt-4">
        <a
          href={sapEventId}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          Otwórz pełne wyniki w SAP Sailing →
        </a>
        <pre className="mt-2 bg-slate-50 rounded-lg p-3 text-xs text-slate-700 overflow-auto max-h-64">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {classes.map((cls, i) => {
        const className = cls.name || cls.className || `Klasa ${i + 1}`;
        const boats: SapBoat[] = cls.results || cls.rankings || cls.boats || [];

        return (
          <div key={i}>
            <h4 className="font-semibold text-slate-700 mb-2 text-sm">{className}</h4>
            {boats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-left">
                      <th className="px-3 py-2 rounded-l font-medium">#</th>
                      <th className="px-3 py-2 font-medium">Jacht</th>
                      <th className="px-3 py-2 font-medium">Numer żagla</th>
                      <th className="px-3 py-2 font-medium">Sternik</th>
                      <th className="px-3 py-2 rounded-r font-medium text-right">Punkty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boats.map((boat, j) => (
                      <tr
                        key={j}
                        className={`border-t border-slate-100 ${j < 3 ? "font-medium" : ""}`}
                      >
                        <td className="px-3 py-2 text-slate-500">
                          {boat.rank ?? boat.position ?? j + 1}
                          {j === 0 && " 🥇"}
                          {j === 1 && " 🥈"}
                          {j === 2 && " 🥉"}
                        </td>
                        <td className="px-3 py-2 text-slate-900">
                          {boat.boatName || boat.name || "—"}
                        </td>
                        <td className="px-3 py-2 text-slate-500 font-mono text-xs">
                          {boat.sailNumber || "—"}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {boat.helmName || boat.helm || "—"}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-700">
                          {boat.points ?? boat.totalPoints ?? boat.nett ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Brak wyników dla tej klasy.</p>
            )}
          </div>
        );
      })}

      <a
        href={sapEventId}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs text-blue-500 hover:underline mt-2"
      >
        Pełne wyniki na SAP Sailing →
      </a>
    </div>
  );
}
