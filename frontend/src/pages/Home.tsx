import { Link } from "react-router-dom";
import Head from "../components/Head";
import { CONTENT } from "../data/content";
import { useLang } from "../useLang";
import { useAccount } from "../auth/AccountContext";

const cardClass = "rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5";
const buttonClass = "inline-flex min-h-12 items-center justify-center rounded-xl border px-5 font-bold no-underline transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]";

export default function Home() {
  const m = useLang();
  const { account } = useAccount();
  const pct = Math.round((m.goalDone / m.goalTotal) * 100);
  return (
    <>
      <Head title={m.title} sub={account
        ? `Xin chào ${account.email}. Tiến độ của bạn được lưu trên thiết bị này.`
        : `Hôm nay bạn đã học ${m.goalDone} trên ${m.goalTotal} phút.`} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`${cardClass} flex items-center gap-6`}>
          <span className="font-[var(--disp)] text-7xl font-extrabold leading-none sm:text-8xl" aria-hidden="true">{m.promo}</span>
          <div>
            <p className="text-3xl font-bold leading-tight text-[var(--acc)]">{m.streak} ngày</p>
            <p className="text-sm text-[var(--mut)]">Chuỗi ngày học liên tiếp. Giữ nhịp thêm {m.goalTotal - m.goalDone} phút nữa để đạt mục tiêu hôm nay.</p>
          </div>
        </div>
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <b>Mục tiêu hôm nay</b>
            <span className="text-sm text-[var(--mut)]">{m.goalDone} / {m.goalTotal} phút</span>
          </div>
          <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div className="h-full rounded-full bg-[var(--acc)] transition-[width] motion-reduce:transition-none" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <div className={`${cardClass} mt-4`}>
        <p className="text-sm text-[var(--mut)]">Đang học · {m.level}</p>
        <h2 className="mt-1 mb-3.5 text-xl font-bold">{m.lessonTitle}</h2>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
          <div className="h-full rounded-full bg-[var(--acc)] transition-[width] motion-reduce:transition-none" style={{ width: `${m.lessonProgress}%` }} />
        </div>
        <div className="mt-4">
          <Link to={`/${m.code}/quiz`} className={`${buttonClass} border-[var(--acc)] bg-[var(--acc)] text-[var(--onacc)] hover:opacity-90`}>
            Làm bài kiểm tra
          </Link>
        </div>
      </div>
      <div className={`${cardClass} mt-4 flex items-center justify-between gap-4`}>
        <div>
          <b>{CONTENT[m.code].deck.length} thẻ {m.cardsTab} cần ôn</b>
          <p className="text-sm text-[var(--mut)]">Ôn theo lặp lại ngắt quãng để nhớ lâu hơn.</p>
        </div>
        <Link to={`/${m.code}/cards`} className={`${buttonClass} shrink-0 border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--acc)]`}>
          Ôn ngay
        </Link>
      </div>
      {!account && <div className={`${cardClass} mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center`}>
        <div>
          <b>Lưu lại tiến độ học của bạn</b>
          <p className="text-sm text-[var(--mut)]">Tạo tài khoản để ghi nhớ kết quả quiz và thẻ đã ôn.</p>
        </div>
        <Link to={`/${m.code}/account`} className={`${buttonClass} w-full border-[var(--acc)] bg-[var(--acc)] text-[var(--onacc)] hover:opacity-90 sm:w-auto`}>
          Đăng nhập / Tạo tài khoản
        </Link>
      </div>}
    </>
  );
}
