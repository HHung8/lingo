import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "../types";

const ACCOUNTS_KEY = "lingo.accounts.v1";
const SESSION_KEY = "lingo.session.v1";
const AUTH_SESSION_KEY = "lingo.auth.session.v1";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || (import.meta.env.DEV ? "http://localhost:8080" : "")
).replace(/\/+$/, "");
const IS_LOOPBACK_API_URL = /^https?:\/\/(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?(?:\/|$)/i
  .test(API_BASE_URL);

interface LanguageProgress {
  quizzes: number;
  bestQuizScore: number;
  cardsReviewed: number;
  cardsKnown: number;
}

interface StoredAccount {
  id: string;
  email: string;
  salt: string;
  passwordHash: string;
  progress: Partial<Record<Lang, LanguageProgress>>;
}

interface AuthSession {
  token: string;
  email: string;
  displayName: string;
}

export interface Account {
  id: string;
  email: string;
  progress: Partial<Record<Lang, LanguageProgress>>;
}

interface AccountContextValue {
  account: Account | null;
  error: string;
  clearError: () => void;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveQuiz: (lang: Lang, score: number) => void;
  saveCards: (lang: Lang, reviewed: number, known: number) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

function readAccounts(): StoredAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  const accounts: unknown = JSON.parse(raw);
  if (!Array.isArray(accounts)) throw new Error("Dữ liệu tài khoản không hợp lệ trong trình duyệt.");
  return accounts as StoredAccount[];
}

function toAccount(user: StoredAccount): Account {
  return { id: user.id, email: user.email, progress: user.progress ?? {} };
}

async function apiRequest<T>(path: string, body: object): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API chưa được cấu hình. Hãy đặt biến VITE_API_URL trong Environment Variables của Vercel rồi deploy lại.");
  }
  if (!import.meta.env.DEV && IS_LOOPBACK_API_URL) {
    throw new Error("VITE_API_URL đang trỏ tới localhost. Hãy đặt URL công khai của backend Render (không phải host database) trong Vercel rồi deploy lại.");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(`Không thể kết nối máy chủ API tại ${API_BASE_URL}. Hãy kiểm tra địa chỉ API và trạng thái máy chủ.`);
  }

  const data = await response.json().catch(() => null) as (T & { message?: string; error?: string }) | null;
  if (!response.ok) {
    throw new Error(data?.message || data?.error || (
      response.status === 409
        ? "Email này đã được đăng ký."
        : "Email hoặc mật khẩu không hợp lệ."
    ));
  }
  if (!data) throw new Error("Máy chủ trả về dữ liệu không hợp lệ.");
  return data;
}

function saveLocalAccount(email: string): Account {
  const accounts = readAccounts();
  const existing = accounts.find((item) => item.email === email);
  const user: StoredAccount = existing ?? {
    id: email,
    email,
    salt: "",
    passwordHash: "",
    progress: {},
  };
  if (!existing) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, user]));
  }
  return toAccount(user);
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const authRaw = localStorage.getItem(AUTH_SESSION_KEY);
      if (authRaw) {
        const auth = JSON.parse(authRaw) as AuthSession;
        if (auth.email && auth.token) {
          setAccount(saveLocalAccount(auth.email));
          return;
        }
      }
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) return;
      const user = readAccounts().find((item) => item.id === sessionId);
      if (!user) {
        localStorage.removeItem(SESSION_KEY);
        return;
      }
      setAccount(toAccount(user));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể đọc dữ liệu tài khoản.");
    }
  }, []);

  const register = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const displayName = normalizedEmail.split("@")[0] || "Người học";
    const result = await apiRequest<{ token: string; email: string; displayName: string }>(
      "/api/auth/register",
      { email: normalizedEmail, password, displayName },
    );
    const user = saveLocalAccount(result.email);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
      token: result.token,
      email: result.email,
      displayName: result.displayName,
    } satisfies AuthSession));
    localStorage.setItem(SESSION_KEY, user.id);
    setAccount(user);
    setError("");
  };

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await apiRequest<{ token: string; email: string; displayName: string }>(
      "/api/auth/login",
      { email: normalizedEmail, password },
    );
    const user = saveLocalAccount(result.email);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
      token: result.token,
      email: result.email,
      displayName: result.displayName,
    } satisfies AuthSession));
    localStorage.setItem(SESSION_KEY, user.id);
    setAccount(user);
    setError("");
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    setAccount(null);
    setError("");
  };

  const updateProgress = (
    lang: Lang,
    update: (progress: LanguageProgress) => LanguageProgress,
  ) => {
    if (!account) return;
    try {
      const accounts = readAccounts();
      const index = accounts.findIndex((user) => user.id === account.id);
      if (index < 0) throw new Error("Không tìm thấy tài khoản hiện tại. Vui lòng đăng nhập lại.");
      const existing = accounts[index];
      const progress = update(existing.progress?.[lang] ?? {
        quizzes: 0,
        bestQuizScore: 0,
        cardsReviewed: 0,
        cardsKnown: 0,
      });
      const updated = { ...existing, progress: { ...existing.progress, [lang]: progress } };
      accounts[index] = updated;
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      setAccount(toAccount(updated));
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu tiến độ học.");
    }
  };

  const saveQuiz = (lang: Lang, score: number) => updateProgress(lang, (progress) => ({
    ...progress,
    quizzes: progress.quizzes + 1,
    bestQuizScore: Math.max(progress.bestQuizScore, score),
  }));

  const saveCards = (lang: Lang, reviewed: number, known: number) => updateProgress(lang, (progress) => ({
    ...progress,
    cardsReviewed: progress.cardsReviewed + reviewed,
    cardsKnown: progress.cardsKnown + known,
  }));

  return (
    <AccountContext.Provider value={{
      account,
      error,
      clearError: () => setError(""),
      register,
      login,
      logout,
      saveQuiz,
      saveCards,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within AccountProvider");
  return context;
}
