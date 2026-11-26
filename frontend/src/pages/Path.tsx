import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Head from "../components/Head";
import { api } from "../api/client";
import type { Unit } from "../types";
import { useLang } from "../useLang";

const TAG = { done: "Hoàn thành", now: "Đang học", lock: "Chưa mở" };

export default function Path() {
  const m = useLang();
  const [units, setUnits] = useState<Unit[]>([]);
  useEffect(() => { api.getUnits(m.code).then(setUnits); }, [m.code]);

  return (
    <>
      <Head title={`Lộ trình ${m.level}`} sub="Học lần lượt từng chặng. Chặng sau mở khóa khi bạn hoàn thành chặng trước." />
      <div className="grid gap-4">
        {units.map((u, i) => {
          const kanaScript = m.code === "ja" && i < 2
            ? i === 0 ? "hiragana" : "katakana"
            : null;
          const content: ReactNode = (
            <>
              <span
                className={`w-11 shrink-0 text-center font-[var(--disp)] text-3xl font-extrabold ${
                  u.st === "done" ? "text-[var(--ok)]" : "text-[var(--ink)]"
                }`}
                aria-hidden="true"
              >
                {u.j}
              </span>
              <div className="min-w-0 flex-1">
                <b>{u.t}</b>
                <p className="text-sm text-[var(--mut)]">{u.s}</p>
                {u.p ? (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--line)]">
                    <div className="h-full rounded-full bg-[var(--acc)]" style={{ width: `${u.p}%` }} />
                  </div>
                ) : null}
              </div>
              <span className="shrink-0 rounded-full bg-[var(--line)] px-2.5 py-1 text-xs font-bold">{TAG[u.st]}</span>
            </>
          );
          const className = `flex items-center gap-4 rounded-2xl border bg-[var(--card)] p-4 sm:px-5 ${
            u.st === "now"
              ? "border-2 border-[var(--acc)]"
              : u.st === "lock"
                ? "border-[var(--line)] opacity-70"
                : "border-[var(--line)]"
          }`;

          return kanaScript ? (
            <Link
              key={u.t}
              to={`/${m.code}/kana/${kanaScript}`}
              className={`${className} text-inherit no-underline transition-colors hover:border-[var(--acc)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]`}
            >
              {content}
            </Link>
          ) : (
            <div key={u.t} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </>
  );
}
