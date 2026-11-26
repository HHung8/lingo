package com.lingo.repo;

import com.lingo.dto.Dto;
import java.util.ArrayList;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class ContentRepository {
    private final JdbcClient db;

    public ContentRepository(JdbcClient db) {
        this.db = db;
    }

    public boolean languageExists(String code) {
        Long n = db.sql("SELECT count(*) FROM languages WHERE code = :c").param("c", code).query(Long.class).single();
        return n > 0;
    }

    /** Trạng thái chặng: lấy theo tiến độ người dùng; chưa có thì chặng đầu là NOW, còn lại LOCK. */
    public List<Dto.Unit> units(String lang, Long userId) {
        return db.sql("""
                SELECT u.glyph AS j, u.title AS t, u.subtitle AS s,
                       COALESCE(p.status, CASE WHEN u.position = 1 THEN 'NOW' ELSE 'LOCK' END) AS st,
                       p.percent AS pct
                FROM units u
                JOIN languages l ON l.id = u.language_id
                LEFT JOIN user_unit_progress p ON p.unit_id = u.id AND p.user_id = :uid
                WHERE l.code = :lang
                ORDER BY u.position
                """)
                .param("lang", lang)
                .param("uid", userId == null ? -1L : userId)
                .query((rs, n) -> {
                    int pct = rs.getInt("pct");
                    Integer p = rs.wasNull() ? null : pct;
                    return new Dto.Unit(rs.getString("j"), rs.getString("t"), rs.getString("s"),
                            rs.getString("st").toLowerCase(), p);
                })
                .list();
    }

    public List<Dto.Card> cards(String lang) {
        return db.sql("""
                SELECT c.id, c.front, c.meaning, c.reading, c.example, c.translation
                FROM cards c JOIN languages l ON l.id = c.language_id
                WHERE l.code = :lang
                ORDER BY c.position
                """)
                .param("lang", lang)
                .query((rs, n) -> new Dto.Card(rs.getLong("id"), rs.getString("front"), rs.getString("meaning"),
                        rs.getString("reading"), rs.getString("example"), rs.getString("translation")))
                .list();
    }

    public List<Dto.Lesson> lessons(String lang) {
        return db.sql("""
                SELECT ls.id, ls.title, u.title AS unit
                FROM lessons ls JOIN units u ON u.id = ls.unit_id JOIN languages l ON l.id = u.language_id
                WHERE l.code = :lang
                ORDER BY u.position, ls.position
                """)
                .param("lang", lang)
                .query((rs, n) -> new Dto.Lesson(rs.getLong("id"), rs.getString("title"), rs.getString("unit")))
                .list();
    }

    private record QRow(long id, String prompt, String explanation) {}
    private record Opt(String text, boolean correct) {}

    /** Câu hỏi của một ngôn ngữ; nếu có lessonId thì chỉ lấy bài đó. */
    public List<Dto.Question> quiz(String lang, Long lessonId) {
        List<QRow> rows = db.sql("""
                SELECT q.id, q.prompt, q.explanation
                FROM questions q
                JOIN lessons ls ON ls.id = q.lesson_id
                JOIN units u ON u.id = ls.unit_id
                JOIN languages l ON l.id = u.language_id
                WHERE l.code = :lang AND (:lesson = -1 OR ls.id = :lesson)
                ORDER BY u.position, ls.position, q.position
                """)
                .param("lang", lang)
                .param("lesson", lessonId == null ? -1L : lessonId)
                .query((rs, n) -> new QRow(rs.getLong("id"), rs.getString("prompt"), rs.getString("explanation")))
                .list();

        List<Dto.Question> out = new ArrayList<>();
        for (QRow r : rows) {
            List<Opt> opts = db.sql("SELECT text, is_correct FROM question_options WHERE question_id = :q ORDER BY position")
                    .param("q", r.id())
                    .query((rs, n) -> new Opt(rs.getString("text"), rs.getBoolean("is_correct")))
                    .list();
            List<String> texts = new ArrayList<>();
            int correct = 0;
            for (int i = 0; i < opts.size(); i++) {
                texts.add(opts.get(i).text());
                if (opts.get(i).correct()) correct = i;
            }
            out.add(new Dto.Question(r.prompt(), texts, correct, r.explanation()));
        }
        return out;
    }
}
