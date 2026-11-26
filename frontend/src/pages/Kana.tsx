import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Head from "../components/Head";
import { useLang } from "../useLang";

type KanaEntry = { hiragana: string; katakana: string; romaji: string };
type KanaRow = { label: string; entries: (KanaEntry | null)[]; stackedLabel?: boolean };

const kana = (hiragana: string, katakana: string, romaji: string): KanaEntry => ({
  hiragana,
  katakana,
  romaji,
});

const BASIC_ROWS: KanaRow[] = [
  { label: "Nguyên âm", stackedLabel: true, entries: [kana("あ", "ア", "a"), kana("い", "イ", "i"), kana("う", "ウ", "u"), kana("え", "エ", "e"), kana("お", "オ", "o")] },
  { label: "K", entries: [kana("か", "カ", "ka"), kana("き", "キ", "ki"), kana("く", "ク", "ku"), kana("け", "ケ", "ke"), kana("こ", "コ", "ko")] },
  { label: "S", entries: [kana("さ", "サ", "sa"), kana("し", "シ", "shi"), kana("す", "ス", "su"), kana("せ", "セ", "se"), kana("そ", "ソ", "so")] },
  { label: "T", entries: [kana("た", "タ", "ta"), kana("ち", "チ", "chi"), kana("つ", "ツ", "tsu"), kana("て", "テ", "te"), kana("と", "ト", "to")] },
  { label: "N", entries: [kana("な", "ナ", "na"), kana("に", "ニ", "ni"), kana("ぬ", "ヌ", "nu"), kana("ね", "ネ", "ne"), kana("の", "ノ", "no")] },
  { label: "H", entries: [kana("は", "ハ", "ha"), kana("ひ", "ヒ", "hi"), kana("ふ", "フ", "fu"), kana("へ", "ヘ", "he"), kana("ほ", "ホ", "ho")] },
  { label: "M", entries: [kana("ま", "マ", "ma"), kana("み", "ミ", "mi"), kana("む", "ム", "mu"), kana("め", "メ", "me"), kana("も", "モ", "mo")] },
  { label: "Y", entries: [kana("や", "ヤ", "ya"), null, kana("ゆ", "ユ", "yu"), null, kana("よ", "ヨ", "yo")] },
  { label: "R", entries: [kana("ら", "ラ", "ra"), kana("り", "リ", "ri"), kana("る", "ル", "ru"), kana("れ", "レ", "re"), kana("ろ", "ロ", "ro")] },
  { label: "W", entries: [kana("わ", "ワ", "wa"), null, null, null, kana("を", "ヲ", "wo")] },
  { label: "N", entries: [kana("ん", "ン", "n"), null, null, null, null] },
];

const VOICED_ROWS: KanaRow[] = [
  { label: "G", entries: [kana("が", "ガ", "ga"), kana("ぎ", "ギ", "gi"), kana("ぐ", "グ", "gu"), kana("げ", "ゲ", "ge"), kana("ご", "ゴ", "go")] },
  { label: "Z", entries: [kana("ざ", "ザ", "za"), kana("じ", "ジ", "ji"), kana("ず", "ズ", "zu"), kana("ぜ", "ゼ", "ze"), kana("ぞ", "ゾ", "zo")] },
  { label: "D", entries: [kana("だ", "ダ", "da"), kana("ぢ", "ヂ", "ji"), kana("づ", "ヅ", "zu"), kana("で", "デ", "de"), kana("ど", "ド", "do")] },
  { label: "B", entries: [kana("ば", "バ", "ba"), kana("び", "ビ", "bi"), kana("ぶ", "ブ", "bu"), kana("べ", "ベ", "be"), kana("ぼ", "ボ", "bo")] },
  { label: "P", entries: [kana("ぱ", "パ", "pa"), kana("ぴ", "ピ", "pi"), kana("ぷ", "プ", "pu"), kana("ぺ", "ペ", "pe"), kana("ぽ", "ポ", "po")] },
];

const COMBINATION_ROWS: KanaRow[] = [
  { label: "K", entries: [kana("きゃ", "キャ", "kya"), kana("きゅ", "キュ", "kyu"), kana("きょ", "キョ", "kyo")] },
  { label: "SH", entries: [kana("しゃ", "シャ", "sha"), kana("しゅ", "シュ", "shu"), kana("しょ", "ショ", "sho")] },
  { label: "CH", entries: [kana("ちゃ", "チャ", "cha"), kana("ちゅ", "チュ", "chu"), kana("ちょ", "チョ", "cho")] },
  { label: "N", entries: [kana("にゃ", "ニャ", "nya"), kana("にゅ", "ニュ", "nyu"), kana("にょ", "ニョ", "nyo")] },
  { label: "H", entries: [kana("ひゃ", "ヒャ", "hya"), kana("ひゅ", "ヒュ", "hyu"), kana("ひょ", "ヒョ", "hyo")] },
  { label: "M", entries: [kana("みゃ", "ミャ", "mya"), kana("みゅ", "ミュ", "myu"), kana("みょ", "ミョ", "myo")] },
  { label: "R", entries: [kana("りゃ", "リャ", "rya"), kana("りゅ", "リュ", "ryu"), kana("りょ", "リョ", "ryo")] },
  { label: "G", entries: [kana("ぎゃ", "ギャ", "gya"), kana("ぎゅ", "ギュ", "gyu"), kana("ぎょ", "ギョ", "gyo")] },
  { label: "J", entries: [kana("じゃ", "ジャ", "ja"), kana("じゅ", "ジュ", "ju"), kana("じょ", "ジョ", "jo")] },
  { label: "B", entries: [kana("びゃ", "ビャ", "bya"), kana("びゅ", "ビュ", "byu"), kana("びょ", "ビョ", "byo")] },
  { label: "P", entries: [kana("ぴゃ", "ピャ", "pya"), kana("ぴゅ", "ピュ", "pyu"), kana("ぴょ", "ピョ", "pyo")] },
];

const VOWELS = ["A", "I", "U", "E", "O"];

function KanaGrid({
  rows,
  script,
  selected,
  onSelect,
  columns = 5,
}: {
  rows: KanaRow[];
  script: "hiragana" | "katakana";
  selected: KanaEntry | null;
  onSelect: (entry: KanaEntry) => void;
  columns?: 3 | 5;
}) {
  return (
    <div className="grid gap-2.5">
      {columns === 5 && (
        <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2" aria-hidden="true">
          <span />
          <div className="grid grid-cols-5 gap-2 text-center text-xs text-[var(--mut)]">
            {VOWELS.map((vowel) => <span key={vowel}>{vowel}</span>)}
          </div>
        </div>
      )}
      {rows.map((row, rowIndex) => (
        <div
          key={`${row.label}-${rowIndex}`}
          className={`grid items-stretch gap-2 ${
            row.stackedLabel
              ? "grid-cols-1 sm:grid-cols-[4.5rem_minmax(0,1fr)]"
              : "grid-cols-[2rem_minmax(0,1fr)]"
          }`}
        >
          <div className={`flex items-center text-xs font-bold text-[var(--mut)] ${
            row.stackedLabel
              ? "sm:justify-center sm:rounded-lg sm:bg-[var(--line)]"
              : "justify-center rounded-lg bg-[var(--line)]"
          }`}>
            {row.label}
          </div>
          <div className={`grid gap-2 ${columns === 3 ? "grid-cols-3" : "grid-cols-5"}`}>
            {row.entries.map((entry, index) => entry ? (
              <button
                key={entry.hiragana}
                type="button"
                onClick={() => onSelect(entry)}
                aria-label={`${entry[script]}, ${entry.romaji}`}
                aria-pressed={selected?.hiragana === entry.hiragana}
                className={`flex min-h-[4.5rem] cursor-pointer flex-col items-center justify-center rounded-xl border bg-[var(--card)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] ${
                  selected?.hiragana === entry.hiragana
                    ? "border-2 border-[var(--acc)]"
                    : "border-[var(--line)] hover:border-[var(--acc)]"
                }`}
              >
                <span className="font-[var(--disp)] text-2xl font-bold sm:text-3xl">{entry[script]}</span>
                <span className="text-xs text-[var(--mut)]">{entry.romaji}</span>
              </button>
            ) : (
              <span key={`${row.label}-${index}`} aria-hidden="true" className="min-h-[4.5rem]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Kana() {
  const meta = useLang();
  const { script } = useParams();
  const [selected, setSelected] = useState<KanaEntry | null>(null);
  const [speechMessage, setSpeechMessage] = useState("");

  if (meta.code !== "ja") return <Navigate to="/ja/path" replace />;
  if (script !== "hiragana" && script !== "katakana") return <Navigate to="/ja/path" replace />;

  const selectKana = (entry: KanaEntry) => {
    setSelected(entry);
    setSpeechMessage("");
  };

  const speakSelected = () => {
    if (!selected) return;
    if (!("speechSynthesis" in window)) {
      setSpeechMessage("Trình duyệt này không hỗ trợ phát âm tự động.");
      return;
    }

    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(selected[script]);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;

    const japaneseVoice = synthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("ja"));
    if (japaneseVoice) utterance.voice = japaneseVoice;
    else setSpeechMessage("Chưa tìm thấy voice tiếng Nhật trên thiết bị. Hãy cài thêm giọng Japanese nếu âm đọc không chính xác.");
    utterance.onstart = () => {
      if (japaneseVoice) setSpeechMessage("");
    };
    utterance.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted") {
        setSpeechMessage("Không phát được âm thanh. Hãy kiểm tra thiết bị có voice tiếng Nhật.");
      }
    };

    synthesis.cancel();
    synthesis.speak(utterance);
  };

  return (
    <>
      <Head
        title={script === "hiragana" ? "Bảng chữ Hiragana" : "Bảng chữ Katakana"}
        sub="Chọn một chữ để xem cách đọc. Học theo từng hàng từ trái sang phải."
      />
      <section className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5">
        <h2 className="mb-4 text-lg font-bold">46 chữ cơ bản</h2>
        <KanaGrid rows={BASIC_ROWS} script={script} selected={selected} onSelect={selectKana} />
      </section>

      <section className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5">
        <h2 className="mb-1 text-lg font-bold">Âm đục và âm bán đục</h2>
        <p className="mb-4 text-sm text-[var(--mut)]">Dấu ゛làm âm chuyển sang hàng G, Z, D, B; dấu ゜tạo hàng P.</p>
        <KanaGrid rows={VOICED_ROWS} script={script} selected={selected} onSelect={selectKana} />
      </section>

      <section className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5">
        <h2 className="mb-1 text-lg font-bold">Âm ghép</h2>
        <p className="mb-4 text-sm text-[var(--mut)]">Ghép chữ hàng I với ゃ, ゅ, ょ nhỏ để tạo một âm tiết.</p>
        <KanaGrid rows={COMBINATION_ROWS} script={script} selected={selected} onSelect={selectKana} columns={3} />
      </section>

      <div className="mb-5 rounded-xl bg-[var(--bg)] p-4 text-sm text-[var(--mut)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div aria-live="polite">
            {selected ? (
              <>
                <span className="font-[var(--disp)] text-3xl font-bold text-[var(--ink)]">{selected[script]}</span>
                <span className="ml-3">Đọc là <b className="text-[var(--ink)]">{selected.romaji}</b></span>
              </>
            ) : "Chạm vào một ô chữ để xem cách đọc."}
          </div>
          {selected && (
            <button
              type="button"
              onClick={speakSelected}
              className="min-h-11 cursor-pointer rounded-xl border border-[var(--acc)] bg-[var(--acc)] px-4 font-bold text-[var(--onacc)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
            >
              Nghe phát âm
            </button>
          )}
        </div>
        {speechMessage && <p className="mt-2 text-[var(--bad)]" role="status">{speechMessage}</p>}
        <p className="mt-2">Lưu ý: を thường đọc gần như “o” trong câu; ぢ và づ hiện ít gặp trong tiếng Nhật hiện đại.</p>
      </div>

      <Link
        to="/ja/path"
        className="inline-flex min-h-11 items-center rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 font-bold text-[var(--ink)] no-underline hover:border-[var(--acc)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
      >
        ← Quay lại lộ trình
      </Link>
    </>
  );
}
