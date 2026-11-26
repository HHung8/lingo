package com.lingo.repo;

import com.lingo.dto.Dto;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class ProgressRepository {
    private record Srs(int repetitions, double ease, int intervalDays) {}

    private final JdbcClient db;

    public ProgressRepository(JdbcClient db) {
        this.db = db;
    }

    public void enroll(long userId, String lang) {
        db.sql("""
                INSERT INTO user_languages(user_id, language_id)
                SELECT :u, id FROM languages WHERE code = :l
                ON CONFLICT DO NOTHING
                """).param("u", userId).param("l", lang).update();
    }

    public long saveAttempt(long userId, long lessonId, int score, int total) {
        return db.sql("INSERT INTO quiz_attempts(user_id, lesson_id, score, total) VALUES (:u, :ls, :s, :t) RETURNING id")
                .param("u", userId).param("ls", lessonId).param("s", score).param("t", total)
                .query(Long.class).single();
    }

    /** SM-2 rút gọn: nhớ thì giãn khoảng ôn, quên thì quay về đầu. */
    public void reviewCard(long userId, long cardId, boolean known) {
        Srs cur = db.sql("SELECT repetitions, ease, interval_days FROM user_card_progress WHERE user_id = :u AND card_id = :c")
                .param("u", userId).param("c", cardId)
                .query((rs, n) -> new Srs(rs.getInt("repetitions"), rs.getDouble("ease"), rs.getInt("interval_days")))
                .optional().orElse(new Srs(0, 2.5, 0));

        int rep, interval;
        double ease;
        if (known) {
            rep = cur.repetitions() + 1;
            interval = rep == 1 ? 1 : rep == 2 ? 3 : (int) Math.round(Math.max(1, cur.intervalDays()) * cur.ease());
            ease = Math.min(2.8, cur.ease() + 0.05);
        } else {
            rep = 0;
            interval = 0;
            ease = Math.max(1.3, cur.ease() - 0.2);
        }

        db.sql("""
                INSERT INTO user_card_progress(user_id, card_id, repetitions, ease, interval_days, due_at, last_reviewed_at)
                VALUES (:u, :c, :rep, :ease, :iv, now() + (:iv * interval '1 day'), now())
                ON CONFLICT (user_id, card_id) DO UPDATE SET
                  repetitions = EXCLUDED.repetitions, ease = EXCLUDED.ease, interval_days = EXCLUDED.interval_days,
                  due_at = EXCLUDED.due_at, last_reviewed_at = EXCLUDED.last_reviewed_at
                """)
                .param("u", userId).param("c", cardId).param("rep", rep).param("ease", ease).param("iv", interval)
                .update();
    }

    public void logStudy(long userId, String lang, int minutes) {
        db.sql("INSERT INTO study_logs(user_id, language_id, minutes) SELECT :u, id, :m FROM languages WHERE code = :l")
                .param("u", userId).param("m", minutes).param("l", lang).update();
    }

    public Dto.Summary summary(long userId, String lang) {
        List<LocalDate> days = db.sql("""
                SELECT DISTINCT sl.studied_on AS d
                FROM study_logs sl JOIN languages l ON l.id = sl.language_id
                WHERE sl.user_id = :u AND l.code = :l
                ORDER BY d DESC LIMIT 400
                """)
                .param("u", userId).param("l", lang)
                .query((rs, n) -> rs.getObject("d", LocalDate.class)).list();

        LocalDate today = LocalDate.now();
        int streak = 0;
        if (!days.isEmpty() && !days.get(0).isBefore(today.minusDays(1))) {
            LocalDate expected = days.get(0);
            for (LocalDate d : days) {
                if (!d.equals(expected)) break;
                streak++;
                expected = expected.minusDays(1);
            }
        }

        Long minutes = db.sql("""
                SELECT COALESCE(SUM(sl.minutes), 0)
                FROM study_logs sl JOIN languages l ON l.id = sl.language_id
                WHERE sl.user_id = :u AND l.code = :l AND sl.studied_on = current_date
                """)
                .param("u", userId).param("l", lang).query(Long.class).single();

        Optional<Integer> goal = db.sql("""
                SELECT ul.daily_goal_minutes
                FROM user_languages ul JOIN languages l ON l.id = ul.language_id
                WHERE ul.user_id = :u AND l.code = :l
                """)
                .param("u", userId).param("l", lang).query(Integer.class).optional();

        return new Dto.Summary(streak, minutes.intValue(), goal.orElse(20));
    }
}
