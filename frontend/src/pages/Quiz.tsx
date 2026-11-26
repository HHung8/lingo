import { useEffect, useState } from "react";
import Head from "../components/Head";
import { api } from "../api/client";
import type { Question } from "../types";
import { useLang } from "../useLang";
import { useAccount } from "../auth/AccountContext";

export default function Quiz() {
  const m = useLang();
  const { account, saveQuiz } = useAccount();
  const [qs, setQs] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const [score, setScore] = useState(0);

  useEffect(() => { api.getQuiz(m.code).then(setQs); }, [m.code]);
  if (qs.length === 0) return <p className="text-sm text-[var(--mut)]">Đang tải câu hỏi...</p>;

  const restart = () => { setI(0); setPick(-1); setScore(0); };

  if (i >= qs.length) {
    return (
      <>
        <Head title="Kết quả" sub={m.quizSub} />
        <div className="max-w-2xl rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <p className="text-4xl font-bold leading-tight text-[var(--acc)]">{score} / {qs.length}</p>
          <p className="mt-2 mb-5 text-sm text-[var(--mut)]">
            {score >= 5 ? "Rất tốt! Bạn có thể sang bài tiếp theo." : "Hãy ôn lại các mẫu câu chào hỏi rồi thử lại."}
          </p>
          {!account && <p className="mb-4 text-sm text-[var(--mut)]">Đăng nhập để lưu kết quả học tập.</p>}
          <button
            className="min-h-12 cursor-pointer rounded-xl border border-[var(--acc)] bg-[var(--acc)] px-6 font-bold text-[var(--onacc)] transition-opacity motion-reduce:transition-none hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
            onClick={restart}
          >
            Làm lại
          </button>
        </div>
      </>
    );
  }

  const q = qs[i];
  const done = pick >= 0;
  const choose = (n: number) => { setPick(n); if (n === q.c) setScore(score + 1); };

  return (
    <>
      <Head title={m.quizTitle} sub={`Câu ${i + 1} trên ${qs.length}`} />
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm text-[var(--mut)]">
          <span>Tiến độ</span>
          <span>{Math.round((i / qs.length) * 100)}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-[var(--line)]"
          role="progressbar"
          aria-label="Tiến độ bài kiểm tra"
          aria-valuemin={0}
          aria-valuemax={qs.length}
          aria-valuenow={i}
        >
          <div
            className="h-full rounded-full bg-[var(--acc)] transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${Math.round((i / qs.length) * 100)}%` }}
          />
        </div>
      </div>
      <p className="text-sm text-[var(--mut)]">{m.quizPrompt}</p>
      <p className={`my-2 mb-5 font-[var(--disp)] font-extrabold leading-tight ${q.q.length > 10 ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"}`}>
        {q.q}
      </p>
      <div className="grid gap-3">
        {q.a.map((t, n) => {
          const answerState = done
            ? n === q.c
              ? "border-2 border-[var(--ok)] bg-[var(--okbg)]"
              : n === pick
                ? "border-2 border-[var(--bad)] bg-[var(--badbg)]"
                : "border-[var(--line)] bg-[var(--card)]"
            : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--acc)] hover:bg-[var(--bg)]";
          return (
            <button
              key={t}
              className={`min-h-14 w-full cursor-pointer rounded-xl border px-4 py-3 text-left font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] disabled:cursor-default ${answerState}`}
              disabled={done}
              onClick={() => choose(n)}
            >
              {t}
            </button>
          );
        })}
      </div>
      {done && (
        <>
          <div
            className={`mt-4 rounded-xl p-4 ${pick === q.c ? "bg-[var(--okbg)]" : "bg-[var(--badbg)]"}`}
            role="status"
          >
            <b className={pick === q.c ? "text-[var(--ok)]" : "text-[var(--bad)]"}>
              {pick === q.c ? "Chính xác!" : "Chưa đúng."}
            </b>
            <p className="mt-1">{q.e}</p>
          </div>
          <div className="mt-4">
            <button
              className="min-h-12 cursor-pointer rounded-xl border border-[var(--acc)] bg-[var(--acc)] px-6 font-bold text-[var(--onacc)] transition-opacity motion-reduce:transition-none hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              onClick={() => {
                if (i === qs.length - 1) saveQuiz(m.code, score);
                setI(i + 1);
                setPick(-1);
              }}
            >
              {i === qs.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}
            </button>
          </div>
        </>
      )}
    </>
  );
}
