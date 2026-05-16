-- ЕВА Finance — Supabase schema
-- Запусти этот SQL в Supabase Dashboard → SQL Editor

-- Таблица транзакций
CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT PRIMARY KEY,
  type        TEXT        NOT NULL CHECK (type IN ('income', 'expense')),
  amount      NUMERIC     NOT NULL,
  cat         TEXT,
  emoji       TEXT,
  desc        TEXT,
  date        TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица целей
CREATE TABLE IF NOT EXISTS goals (
  id          TEXT PRIMARY KEY,
  name        TEXT    NOT NULL,
  emoji       TEXT,
  target      NUMERIC NOT NULL,
  saved       NUMERIC NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Разрешаем всё (личное приложение, без авторизации)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all goals"        ON goals        FOR ALL USING (true) WITH CHECK (true);
