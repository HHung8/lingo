export type Lang = "ja" | "en";

/** Một thẻ từ: chữ Kanji (tiếng Nhật) hoặc từ vựng (tiếng Anh). */
export interface Card { front: string; meaning: string; reading: string; ex: string; tr: string }
export interface Unit { j: string; t: string; s: string; st: "done" | "now" | "lock"; p?: number }
export interface Question { q: string; a: string[]; c: number; e: string }

export interface LangMeta {
  code: Lang;
  native: string;      // tên hiển thị trên nút chọn ngôn ngữ
  level: string;
  logo: string;
  tabs: [string, string, string, string]; // ký hiệu cho 4 tab
  cardsTab: string;
  title: string;       // tiêu đề trang Học
  promo: string;       // ký hiệu cạnh chuỗi ngày
  streak: number;
  goalDone: number;
  goalTotal: number;
  lessonTitle: string;
  lessonProgress: number;
  deckTitle: string;
  cardHint: string;
  quizTitle: string;
  quizPrompt: string;
  quizSub: string;
}
