import { Link, Navigate, NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getMeta, LANG_LIST } from "../data/content";
import type { LangMeta } from "../types";
import { useAccount } from "../auth/AccountContext";

const navItemClass = (isActive: boolean) => `flex min-h-14 flex-1 flex-col items-center justify-center gap-0 rounded-lg px-1 text-xs font-medium text-[var(--mut)] transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] md:min-h-12 md:flex-none md:flex-row md:justify-start md:gap-3 md:rounded-xl md:px-3 md:text-base ${
  isActive
    ? "bg-[var(--card)] font-bold text-[var(--ink)] shadow-[inset_0_3px_0_var(--acc)] md:shadow-[inset_3px_0_0_var(--acc)]"
    : "hover:bg-[var(--card)] hover:text-[var(--ink)]"
}`;

function LangSwitch({ meta, section }: { meta: LangMeta; section: string }) {
  return (
    <div className="mb-5 flex gap-1 rounded-xl bg-[var(--line)] p-1" role="group" aria-label="Chọn ngôn ngữ">
      {LANG_LIST.map((l) => (
        <Link
          key={l.code}
          to={`/${l.code}${section}`}
          aria-current={l.code === meta.code ? "true" : undefined}
          className={`flex min-h-10 flex-1 items-center justify-center rounded-lg px-2 text-sm font-bold no-underline transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] ${
            l.code === meta.code
              ? "bg-[var(--card)] text-[var(--ink)]"
              : "text-[var(--mut)] hover:text-[var(--ink)]"
          }`}
        >
          {l.native}
        </Link>
      ))}
    </div>
  );
}

function Tabs({ meta }: { meta: LangMeta }) {
  const base = `/${meta.code}`;
  const items = [
    { to: base, t: "Học", end: true },
    { to: `${base}/path`, t: "Lộ trình", end: false },
    { to: `${base}/cards`, t: meta.cardsTab, end: false },
    { to: `${base}/quiz`, t: "Kiểm tra", end: false },
  ];
  return (
    <>
      {items.map((t, i) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => navItemClass(isActive)}
        >
          <span className="w-6 text-center font-[var(--disp)] text-xl" aria-hidden="true">{meta.tabs[i]}</span>
          {t.t}
        </NavLink>
      ))}
    </>
  );
}

export default function Layout() {
  const { lang } = useParams();
  const { pathname } = useLocation();
  const { account, error, clearError } = useAccount();
  const meta = getMeta(lang ?? "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!meta) return <Navigate to="/ja" replace />;
  const section = pathname.replace(`/${meta.code}`, "");
  const accountTab = (
    <NavLink
      to={`/${meta.code}/account`}
      className={({ isActive }) => navItemClass(isActive)}
    >
      <span className="w-6 text-center font-[var(--disp)] text-xl" aria-hidden="true">◎</span>
      {account ? "Tài khoản" : "Đăng nhập"}
    </NavLink>
  );

  return (
    <div data-lang={meta.code} className="min-h-screen bg-[var(--bg)] font-[var(--font-body)] text-[var(--ink)]">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="sticky top-0 hidden h-screen flex-col gap-1 border-r border-[var(--line)] px-5 py-7 md:flex" aria-label="Điều hướng chính">
          <div className="mb-6 flex items-center gap-2.5 text-lg font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--acc)] font-[var(--disp)] text-xl text-[var(--onacc)]" aria-hidden="true">{meta.logo}</span>
            Lingo
          </div>
          <LangSwitch meta={meta} section={section} />
          <Tabs meta={meta} />
          {accountTab}
        </nav>
        <main id="view" className="w-full max-w-[880px] px-4 pt-6 pb-28 sm:px-6 md:px-10 md:pt-9 md:pb-14">
          <div className="mb-5 md:hidden"><LangSwitch meta={meta} section={section} /></div>
          {error && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-[var(--badbg)] px-4 py-2.5 text-sm text-[var(--bad)]" role="alert">
              {error}
              <button
                className="cursor-pointer text-xl leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bad)]"
                onClick={clearError}
                aria-label="Đóng thông báo"
              >
                ×
              </button>
            </div>
          )}
          <Outlet key={meta.code} />
        </main>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-10 flex border-t border-[var(--line)] bg-[var(--card)] px-1 pt-1 pb-2 md:hidden"
        aria-label="Điều hướng"
      >
        <Tabs meta={meta} />
        {accountTab}
      </nav>
    </div>
  );
}
