CREATE TABLE IF NOT EXISTS t_p45610326_onlyfans_media_hub.comments (
  id SERIAL PRIMARY KEY,
  card_id INTEGER NOT NULL,
  username TEXT NOT NULL DEFAULT 'Гость',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_card FOREIGN KEY (card_id) REFERENCES t_p45610326_onlyfans_media_hub.cards(id)
)
