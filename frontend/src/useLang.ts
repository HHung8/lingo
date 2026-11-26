import { useParams } from "react-router-dom";
import { getMeta, LANG_LIST } from "./data/content";
import type { LangMeta } from "./types";

/** Lấy ngôn ngữ hiện tại từ URL (/ja, /en). Layout đã chặn mã ngôn ngữ sai. */
export function useLang(): LangMeta {
  const { lang } = useParams();
  return getMeta(lang ?? "") ?? LANG_LIST[0];
}
