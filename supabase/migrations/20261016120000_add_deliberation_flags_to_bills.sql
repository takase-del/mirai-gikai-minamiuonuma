-- 審議のされ方で議案を探せるようにする。
--
-- 「質疑があった」「討論があった」「全会一致ではなかった」は、これまで
-- bill_contents の本文に埋まっていて検索できなかった。市民が関心を持つのは
-- 議論が分かれた議案なので、一覧から辿れるように列として持たせる。

ALTER TABLE bills
  ADD COLUMN has_questions BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN has_debate BOOLEAN NOT NULL DEFAULT FALSE,
  -- 議決されていない議案（審議中・上程前）は判定できないので NULL を許す
  ADD COLUMN is_unanimous BOOLEAN;

COMMENT ON COLUMN bills.has_questions IS '本会議で質疑が行われたか（議事録由来）';
COMMENT ON COLUMN bills.has_debate IS '本会議で討論が行われたか。賛否が分かれた議案の目印になる（議事録由来）';
COMMENT ON COLUMN bills.is_unanimous IS '全会一致で議決されたか。賛成多数・賛成少数は false、未議決は NULL';

-- 一覧の絞り込みで使う。該当する議案は全体の一部なので部分インデックスにする
CREATE INDEX idx_bills_has_debate ON bills (has_debate) WHERE has_debate;
CREATE INDEX idx_bills_has_questions ON bills (has_questions) WHERE has_questions;
CREATE INDEX idx_bills_not_unanimous ON bills (is_unanimous) WHERE is_unanimous IS FALSE;
