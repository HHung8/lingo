import { CONTENT } from "../data/content";
import type { Card, Lang, Question, Unit } from "../types";

// Chưa có VITE_API_URL thì dùng dữ liệu mẫu. Khi có backend, chỉ cần đặt biến này.
const BASE = import.meta.env.VITE_API_URL as string | undefined;

async function get<T>(path: string, fallback: T): Promise<T> {
  if (!BASE) return fallback;
  try {
    const res = await fetch(BASE + path);
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const api = {
  getUnits: (l: Lang) => get<Unit[]>(`/api/${l}/units`, CONTENT[l].units),
  getDeck: (l: Lang) => get<Card[]>(`/api/${l}/cards`, CONTENT[l].deck),
  getQuiz: (l: Lang) => get<Question[]>(`/api/${l}/quiz?unit=3`, CONTENT[l].quiz),
};
