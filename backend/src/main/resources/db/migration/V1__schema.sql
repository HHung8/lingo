CREATE TABLE languages (
  id           SMALLSERIAL PRIMARY KEY,
  code         VARCHAR(8)  NOT NULL UNIQUE,
  name         VARCHAR(60) NOT NULL,
  level_system VARCHAR(30) NOT NULL
);

CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  display_name  VARCHAR(80)  NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'LEARNER',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE user_languages (
  user_id            BIGINT   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_id        SMALLINT NOT NULL REFERENCES languages(id),
  current_level      VARCHAR(30),
  daily_goal_minutes INT      NOT NULL DEFAULT 20,
  started_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, language_id)
);

CREATE TABLE units (
  id          BIGSERIAL PRIMARY KEY,
  language_id SMALLINT     NOT NULL REFERENCES languages(id),
  position    INT          NOT NULL,
  glyph       VARCHAR(8)   NOT NULL,
  title       VARCHAR(120) NOT NULL,
  subtitle    VARCHAR(160) NOT NULL DEFAULT '',
  UNIQUE (language_id, position)
);

CREATE TABLE lessons (
  id       BIGSERIAL PRIMARY KEY,
  unit_id  BIGINT       NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  position INT          NOT NULL,
  title    VARCHAR(160) NOT NULL,
  UNIQUE (unit_id, position)
);

CREATE TABLE cards (
  id          BIGSERIAL PRIMARY KEY,
  language_id SMALLINT     NOT NULL REFERENCES languages(id),
  unit_id     BIGINT       REFERENCES units(id) ON DELETE SET NULL,
  position    INT          NOT NULL,
  front       VARCHAR(80)  NOT NULL,
  meaning     VARCHAR(160) NOT NULL,
  reading     VARCHAR(160) NOT NULL DEFAULT '',
  example     VARCHAR(300) NOT NULL DEFAULT '',
  translation VARCHAR(300) NOT NULL DEFAULT ''
);
CREATE INDEX idx_cards_language ON cards(language_id, position);

CREATE TABLE questions (
  id          BIGSERIAL PRIMARY KEY,
  lesson_id   BIGINT       NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  position    INT          NOT NULL,
  prompt      VARCHAR(300) NOT NULL,
  explanation VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TABLE question_options (
  id          BIGSERIAL PRIMARY KEY,
  question_id BIGINT       NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  position    INT          NOT NULL,
  text        VARCHAR(300) NOT NULL,
  is_correct  BOOLEAN      NOT NULL DEFAULT FALSE
);
-- Mỗi câu hỏi có đúng một đáp án đúng
CREATE UNIQUE INDEX uq_one_correct_option ON question_options(question_id) WHERE is_correct;

CREATE TABLE user_unit_progress (
  user_id    BIGINT   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_id    BIGINT   NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  status     VARCHAR(10) NOT NULL CHECK (status IN ('DONE', 'NOW', 'LOCK')),
  percent    SMALLINT NOT NULL DEFAULT 0 CHECK (percent BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, unit_id)
);

-- Lặp lại ngắt quãng (SRS) kiểu SM-2 rút gọn
CREATE TABLE user_card_progress (
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id          BIGINT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  repetitions      INT    NOT NULL DEFAULT 0,
  ease             NUMERIC(3,2) NOT NULL DEFAULT 2.50,
  interval_days    INT    NOT NULL DEFAULT 0,
  due_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, card_id)
);
CREATE INDEX idx_card_due ON user_card_progress(user_id, due_at);

CREATE TABLE quiz_attempts (
  id        BIGSERIAL PRIMARY KEY,
  user_id   BIGINT   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id BIGINT   NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  score     SMALLINT NOT NULL CHECK (score >= 0),
  total     SMALLINT NOT NULL CHECK (total > 0),
  taken_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (score <= total)
);
CREATE INDEX idx_attempts_user ON quiz_attempts(user_id, taken_at DESC);

CREATE TABLE study_logs (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_id SMALLINT NOT NULL REFERENCES languages(id),
  minutes     INT      NOT NULL CHECK (minutes > 0),
  studied_on  DATE     NOT NULL DEFAULT current_date
);
CREATE INDEX idx_study_user_day ON study_logs(user_id, language_id, studied_on);
