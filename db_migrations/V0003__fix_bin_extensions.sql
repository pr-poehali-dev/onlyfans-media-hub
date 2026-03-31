UPDATE t_p45610326_onlyfans_media_hub.cards
SET preview = REPLACE(preview, '.bin', '.jpg')
WHERE preview LIKE '%.bin'
