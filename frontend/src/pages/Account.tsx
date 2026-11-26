import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Head from "../components/Head";
import { useAccount } from "../auth/AccountContext";
import { useLang } from "../useLang";

export default function AccountPage() {
  const m = useLang();
  const navigate = useNavigate();
  const { account, register, login, logout } = useAccount();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setBusy(true);
    try {
      if (isRegister) await register(email, password);
      else await login(email, password);
      setPassword("");
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Không thể xử lý yêu cầu.");
    } finally {
      setBusy(false);
    }
  };

  if (account) {
    const ja = account.progress.ja;
    const en = account.progress.en;
    const progress = [ja, en].filter(Boolean);
    const quizzes = progress.reduce((sum, item) => sum + (item?.quizzes ?? 0), 0);
    const best = Math.max(ja?.bestQuizScore ?? 0, en?.bestQuizScore ?? 0);
    const reviewed = progress.reduce((sum, item) => sum + (item?.cardsReviewed ?? 0), 0);
    const known = progress.reduce((sum, item) => sum + (item?.cardsKnown ?? 0), 0);
    return (
      <>
        <Head title="Tài khoản của bạn" sub={`Đã đăng nhập với ${account.email}`} />
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
          <h2 className="text-xl font-bold">Tiến độ học đã lưu</h2>
          <p className="mt-1 text-sm text-[var(--mut)]">Tiến độ được lưu trên trình duyệt này.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-1 rounded-xl border border-[var(--line)] p-4">
              <b className="text-2xl text-[var(--acc)]">{quizzes}</b>
              <span className="text-xs text-[var(--mut)]">Bài kiểm tra đã làm</span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-[var(--line)] p-4">
              <b className="text-2xl text-[var(--acc)]">{best}</b>
              <span className="text-xs text-[var(--mut)]">Điểm cao nhất</span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-[var(--line)] p-4">
              <b className="text-2xl text-[var(--acc)]">{reviewed}</b>
              <span className="text-xs text-[var(--mut)]">Thẻ đã ôn</span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-[var(--line)] p-4">
              <b className="text-2xl text-[var(--acc)]">{known}</b>
              <span className="text-xs text-[var(--mut)]">Thẻ đã nhớ</span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3.5">
            <button
              className="min-h-12 flex-1 cursor-pointer rounded-xl border border-[var(--acc)] bg-[var(--acc)] px-5 font-bold text-[var(--onacc)] transition-opacity motion-reduce:transition-none hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              onClick={() => navigate(`/${m.code}`)}
            >
              Tiếp tục học
            </button>
            <button
              className="min-h-12 flex-1 cursor-pointer rounded-xl border border-[var(--line)] bg-[var(--card)] px-5 font-bold transition-colors motion-reduce:transition-none hover:border-[var(--acc)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              onClick={logout}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head
        title={isRegister ? "Tạo tài khoản" : "Đăng nhập"}
        sub={isRegister
          ? "Tạo tài khoản để lưu thông tin tài khoản trên máy chủ."
          : "Đăng nhập bằng tài khoản đã đăng ký."}
      />
      <form
        className="flex max-w-[480px] flex-col gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6"
        onSubmit={submit}
      >
        <label className="mt-2 font-bold" htmlFor="account-email">Email</label>
        <input
          id="account-email"
          className="min-h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-[var(--ink)] focus:border-[var(--acc)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="mt-2 font-bold" htmlFor="account-password">Mật khẩu</label>
        <input
          id="account-password"
          className="min-h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-[var(--ink)] focus:border-[var(--acc)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)]"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          minLength={isRegister ? 8 : undefined}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {isRegister && <p className="text-sm text-[var(--mut)]">Mật khẩu cần ít nhất 8 ký tự.</p>}
        {formError && <p className="rounded-xl bg-[var(--badbg)] px-3 py-2.5 text-[var(--bad)]" role="alert">{formError}</p>}
        <button
          className="mt-2 min-h-12 cursor-pointer rounded-xl border border-[var(--acc)] bg-[var(--acc)] px-5 font-bold text-[var(--onacc)] transition-opacity motion-reduce:transition-none hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] disabled:cursor-default disabled:opacity-50"
          type="submit"
          disabled={busy}
        >
          {busy ? "Đang xử lý..." : isRegister ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        <button
          className="cursor-pointer border-0 bg-transparent p-2.5 font-bold text-[var(--acc)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
          type="button"
          onClick={() => { setIsRegister(!isRegister); setFormError(""); }}
        >
          {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Tạo tài khoản"}
        </button>
        <p className="mt-3 text-sm text-[var(--mut)]">
          Tiến độ học vẫn được lưu trên thiết bị này. Không dùng mật khẩu quan trọng của bạn.
        </p>
      </form>
    </>
  );
}
