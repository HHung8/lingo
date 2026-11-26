import { useEffect, useState } from "react";
import Head from "../components/Head";
import { api } from "../api/client";
import type { Card } from "../types";
import { useLang } from "../useLang";
import { useAccount } from "../auth/AccountContext";

export default function Cards() {
  const m = useLang();
  const { account, saveCards } = useAccount();
  const [deck, setDeck] = useState<Card[]>([]);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [known, setKnown] = useState(0);
  const [again, setAgain] = useState(0);

  useEffect(() => { api.getDeck(m.code).then(setDeck); }, [m.code]);
  if (deck.length === 0) return <p className="text-sm text-[var(--mut)]">Đang tải bộ thẻ...</p>;

  const answer = (ok: boolean) => {
    const nextKnown = known + (ok ? 1 : 0);
    const nextAgain = again + (ok ? 0 : 1);
    if (i === deck.length - 1) saveCards(m.code, deck.length, nextKnown);
    setKnown(nextKnown);
    setAgain(nextAgain);
    setI(i + 1);
    setFlip(false);
  };
  const restart = () => { setI(0); setKnown(0); setAgain(0); setFlip(false); };

  if (i >= deck.length) {
    return (
      <>
        <Head title="Xong rồi!" sub={`Bạn đã ôn hết bộ ${m.cardsTab} hôm nay.`} />
        <div className="max-w-2xl rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <p className="text-4xl font-bold leading-tight text-[var(--acc)]">{known} / {deck.length}</p>
          <p className="mt-2 mb-5 text-sm text-[var(--mut)]">chữ đã nhớ. {again} chữ cần ôn lại.</p>
          {!account && <p className="mb-4 text-sm text-[var(--mut)]">Đăng nhập để lưu kết quả học tập.</p>}
          <button
            className="min-h-12 cursor-pointer rounded-xl border border-[var(--acc)] bg-[var(--acc)] px-6 font-bold text-[var(--onacc)] transition-opacity motion-reduce:transition-none hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
            onClick={restart}
          >
            Ôn lại từ đầu
          </button>
        </div>
      </>
    );
  }

  const d = deck[i];
  return (
    <>
      <Head title={m.deckTitle} sub={`Thẻ ${i + 1} trên ${deck.length}`} />
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[var(--line)]" role="progressbar" aria-label="Tiến độ ôn thẻ" aria-valuemin={0} aria-valuemax={deck.length} aria-valuenow={i}>
        <div className="h-full rounded-full bg-[var(--acc)] transition-[width] motion-reduce:transition-none" style={{ width: `${Math.round((i / deck.length) * 100)}%` }} />
      </div>
      <button
        className="flex min-h-[380px] w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-7 text-center shadow-sm transition-colors motion-reduce:transition-none hover:border-[var(--acc)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
        onClick={() => setFlip(!flip)}
        aria-label="Lật thẻ"
      >
        {flip ? (
          <>
            <p className="text-2xl font-bold">{d.meaning}</p>
            <p className="text-sm text-[var(--mut)]">{d.reading}</p>
            <p className="mt-3.5 font-[var(--disp)] text-[22px]">{d.ex}</p>
            <p className="text-sm text-[var(--mut)]">{d.tr}</p>
          </>
        ) : (
          <>
            <p className={`font-[var(--disp)] font-extrabold leading-none ${
              m.code === "en" ? "text-4xl sm:text-[3.5rem]" : "text-[7.5rem] sm:text-[9.375rem]"
            }`}>
              {d.front}
            </p>
            <p className="text-sm text-[var(--mut)]">{m.cardHint}</p>
          </>
        )}
      </button>
      <div className="mt-4 flex gap-3.5">
        <button
          className="min-h-12 flex-1 cursor-pointer rounded-xl border border-[var(--line)] bg-[var(--card)] px-5 font-bold transition-colors motion-reduce:transition-none hover:border-[var(--acc)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
          onClick={() => answer(false)}
        >
          Chưa nhớ
        </button>
        <button
          className="min-h-12 flex-1 cursor-pointer rounded-xl border border-[var(--acc)] bg-[var(--acc)] px-5 font-bold text-[var(--onacc)] transition-opacity motion-reduce:transition-none hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
          onClick={() => answer(true)}
        >
          Đã nhớ
        </button>
      </div>
    </>
  );
}
