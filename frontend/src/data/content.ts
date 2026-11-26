import type { Card, Lang, LangMeta, Question, Unit } from "../types";

export const LANG_LIST: LangMeta[] = [
  {
    code: "ja", native: "日本語", level: "JLPT N5", logo: "日", tabs: ["学", "道", "字", "問"], cardsTab: "Kanji",
    title: "日本語を勉強しよう", promo: "炎", streak: 12, goalDone: 15, goalTotal: 20,
    lessonTitle: "Bài 3: Chào hỏi và giới thiệu bản thân", lessonProgress: 40,
    deckTitle: "Kanji N5", cardHint: "Chạm để xem nghĩa", quizTitle: "Bài 3: Kiểm tra", quizPrompt: "Chọn nghĩa đúng của", quizSub: "Bài kiểm tra Chào hỏi",
  },
  {
    code: "en", native: "English", level: "CEFR A2", logo: "A", tabs: ["H", "P", "W", "Q"], cardsTab: "Từ vựng",
    title: "Let’s learn English", promo: "Aa", streak: 5, goalDone: 8, goalTotal: 15,
    lessonTitle: "Bài 3: Giới thiệu bản thân", lessonProgress: 55,
    deckTitle: "Từ vựng A2", cardHint: "Chạm để xem nghĩa", quizTitle: "Bài 3: Kiểm tra", quizPrompt: "Chọn nghĩa đúng của", quizSub: "Bài kiểm tra Giới thiệu bản thân",
  },
];

interface Content { units: Unit[]; deck: Card[]; quiz: Question[] }

export const CONTENT: Record<Lang, Content> = {
  ja: {
    units: [
      { j: "あ", t: "Bảng chữ Hiragana", s: "46 / 46 chữ", st: "done" },
      { j: "ア", t: "Bảng chữ Katakana", s: "46 / 46 chữ", st: "done" },
      { j: "挨", t: "Chào hỏi, giới thiệu", s: "4 / 10 bài", st: "now", p: 40 },
      { j: "数", t: "Số đếm và thời gian", s: "Mở khóa sau khi xong Chào hỏi", st: "lock" },
      { j: "食", t: "Ăn uống và mua sắm", s: "Chưa mở khóa", st: "lock" },
      { j: "駅", t: "Đi lại và hỏi đường", s: "Chưa mở khóa", st: "lock" },
    ],
    deck: [
      { front: "日", meaning: "Ngày, mặt trời", reading: "On: ニチ, ジツ · Kun: ひ, か", ex: "今日は日曜日です。", tr: "Hôm nay là Chủ nhật." },
      { front: "月", meaning: "Tháng, mặt trăng", reading: "On: ゲツ, ガツ · Kun: つき", ex: "来月、日本へ行きます。", tr: "Tháng sau tôi đi Nhật." },
      { front: "水", meaning: "Nước", reading: "On: スイ · Kun: みず", ex: "水をください。", tr: "Cho tôi xin nước." },
      { front: "火", meaning: "Lửa", reading: "On: カ · Kun: ひ", ex: "火曜日に会いましょう。", tr: "Gặp nhau vào thứ Ba nhé." },
      { front: "山", meaning: "Núi", reading: "On: サン · Kun: やま", ex: "富士山は高いです。", tr: "Núi Phú Sĩ thì cao." },
      { front: "人", meaning: "Người", reading: "On: ジン, ニン · Kun: ひと", ex: "あの人は先生です。", tr: "Người kia là giáo viên." },
      { front: "学", meaning: "Học", reading: "On: ガク · Kun: まな-ぶ", ex: "大学で日本語を学びます。", tr: "Tôi học tiếng Nhật ở đại học." },
      { front: "食", meaning: "Ăn", reading: "On: ショク · Kun: た-べる", ex: "朝ご飯を食べます。", tr: "Tôi ăn sáng." },
    ],
    quiz: [
      { q: "ありがとう", a: ["Xin lỗi", "Cảm ơn", "Chào buổi sáng", "Tạm biệt"], c: 1, e: "ありがとう dùng để cảm ơn trong tình huống thân mật." },
      { q: "おはようございます", a: ["Chào buổi sáng", "Chúc ngủ ngon", "Rất vui được gặp", "Tôi về đây"], c: 0, e: "Dùng từ sáng sớm đến khoảng 10 giờ." },
      { q: "すみません", a: ["Tôi đồng ý", "Xin lỗi / Xin phép", "Chúc mừng", "Không sao đâu"], c: 1, e: "Dùng để xin lỗi, gọi người khác hoặc cảm ơn nhẹ." },
      { q: "はじめまして", a: ["Tạm biệt", "Hẹn gặp lại", "Rất vui được gặp lần đầu", "Chúc ngon miệng"], c: 2, e: "Câu mở đầu khi gặp ai đó lần đầu tiên." },
      { q: "いただきます", a: ["Nói trước khi ăn", "Nói sau khi ăn", "Nói khi ra khỏi nhà", "Nói khi đi ngủ"], c: 0, e: "Nói trước bữa ăn. Sau bữa ăn nói ごちそうさまでした。" },
      { q: "さようなら", a: ["Cảm ơn nhiều", "Chào buổi tối", "Tạm biệt", "Xin chào"], c: 2, e: "Lời tạm biệt trang trọng, thường dùng khi lâu mới gặp lại." },
    ],
  },
  en: {
    units: [
      { j: "Aa", t: "Bảng chữ cái và phát âm IPA", s: "Hoàn thành 12 / 12 bài", st: "done" },
      { j: "Hi", t: "Chào hỏi, giới thiệu", s: "5 / 9 bài", st: "now", p: 55 },
      { j: "12", t: "Số đếm và thời gian", s: "Mở khóa sau khi xong Chào hỏi", st: "lock" },
      { j: "$", t: "Mua sắm và ăn uống", s: "Chưa mở khóa", st: "lock" },
      { j: "Go", t: "Du lịch và hỏi đường", s: "Chưa mở khóa", st: "lock" },
    ],
    deck: [
      { front: "meet", meaning: "Gặp", reading: "/miːt/ · động từ", ex: "Nice to meet you.", tr: "Rất vui được gặp bạn." },
      { front: "friend", meaning: "Bạn bè", reading: "/frend/ · danh từ", ex: "She is my best friend.", tr: "Cô ấy là bạn thân nhất của tôi." },
      { front: "introduce", meaning: "Giới thiệu", reading: "/ˌɪntrəˈdjuːs/ · động từ", ex: "Let me introduce myself.", tr: "Để tôi tự giới thiệu." },
      { front: "country", meaning: "Đất nước", reading: "/ˈkʌntri/ · danh từ", ex: "Which country are you from?", tr: "Bạn đến từ nước nào?" },
      { front: "job", meaning: "Công việc", reading: "/dʒɒb/ · danh từ", ex: "I have a new job.", tr: "Tôi có một công việc mới." },
      { front: "live", meaning: "Sống, ở", reading: "/lɪv/ · động từ", ex: "I live in Hanoi.", tr: "Tôi sống ở Hà Nội." },
      { front: "hobby", meaning: "Sở thích", reading: "/ˈhɒbi/ · danh từ", ex: "My hobby is reading.", tr: "Sở thích của tôi là đọc sách." },
      { front: "welcome", meaning: "Chào mừng", reading: "/ˈwelkəm/ · động từ, tính từ", ex: "You are always welcome here.", tr: "Bạn luôn được chào đón ở đây." },
    ],
    quiz: [
      { q: "Nice to meet you", a: ["Hẹn gặp lại", "Rất vui được gặp bạn", "Bạn khỏe không?", "Tạm biệt"], c: 1, e: "Câu chào khi gặp ai đó lần đầu." },
      { q: "How are you?", a: ["Bạn tên gì?", "Bạn ở đâu?", "Bạn khỏe không?", "Bạn bao nhiêu tuổi?"], c: 2, e: "Câu hỏi thăm sức khỏe, trả lời thường là I’m fine, thanks." },
      { q: "Where are you from?", a: ["Bạn đến từ đâu?", "Bạn đi đâu?", "Bạn làm nghề gì?", "Bạn sống với ai?"], c: 0, e: "Trả lời: I’m from + tên nước hoặc thành phố." },
      { q: "What do you do?", a: ["Bạn đang làm gì lúc này?", "Bạn làm nghề gì?", "Bạn thích gì?", "Bạn học ở đâu?"], c: 1, e: "Hỏi về nghề nghiệp, không phải hỏi việc đang làm." },
      { q: "See you later", a: ["Cảm ơn nhiều", "Xin lỗi nhé", "Chào buổi tối", "Hẹn gặp lại sau"], c: 3, e: "Cách chào tạm biệt thân mật." },
      { q: "Pleased to meet you", a: ["Rất hân hạnh được gặp bạn", "Xin mời vào", "Chúc bạn may mắn", "Tôi không hiểu"], c: 0, e: "Trang trọng hơn một chút so với Nice to meet you." },
    ],
  },
};

export const getMeta = (code: string): LangMeta | undefined => LANG_LIST.find((l) => l.code === code);
