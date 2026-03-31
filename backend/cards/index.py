import json
import os
import psycopg2  # noqa: F401 — installed via requirements.txt psycopg2-binary

SCHEMA = "t_p45610326_onlyfans_media_hub"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    """CRUD для карточек девушек: GET — список, POST — добавить, DELETE — удалить"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            cur.execute(f"""
                SELECT c.id, c.name, c.preview, c.video_url, c.link, c.tags, c.likes,
                    COALESCE(json_agg(
                        json_build_object('id', cm.id, 'username', cm.username, 'text', cm.text, 'time', to_char(cm.created_at, 'DD.MM.YYYY HH24:MI'))
                        ORDER BY cm.created_at
                    ) FILTER (WHERE cm.id IS NOT NULL), '[]'::json) AS comments
                FROM {SCHEMA}.cards c
                LEFT JOIN {SCHEMA}.comments cm ON cm.card_id = c.id
                GROUP BY c.id
                ORDER BY c.created_at DESC
            """)
            rows = cur.fetchall()
            cards = []
            for r in rows:
                comments = r[7]
                if isinstance(comments, str):
                    comments = json.loads(comments)
                cards.append({
                    "id": r[0], "name": r[1], "preview": r[2],
                    "videoUrl": r[3], "link": r[4], "tags": list(r[5]),
                    "likes": r[6], "comments": comments or [],
                })
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"cards": cards})}

        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            action = body.get("action")

            if action == "add":
                name = body["name"]
                preview = body.get("preview", "")
                video_url = body.get("videoUrl")
                link = body.get("link", "#")
                tags = body.get("tags", [])
                cur.execute(
                    f"INSERT INTO {SCHEMA}.cards (name, preview, video_url, link, tags) VALUES (%s,%s,%s,%s,%s) RETURNING id",
                    (name, preview, video_url, link, tags)
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                return {"statusCode": 200, "headers": cors, "body": json.dumps({"id": new_id})}

            if action == "like":
                card_id = int(body["card_id"])
                delta = 1 if body.get("liked") else -1
                cur.execute(f"UPDATE {SCHEMA}.cards SET likes = GREATEST(0, likes + %s) WHERE id = %s RETURNING likes", (delta, card_id))
                new_likes = cur.fetchone()[0]
                conn.commit()
                return {"statusCode": 200, "headers": cors, "body": json.dumps({"likes": new_likes})}

            if action == "comment":
                card_id = int(body["card_id"])
                username = body.get("username", "Гость")[:50]
                text = body.get("text", "")[:500]
                cur.execute(
                    f"INSERT INTO {SCHEMA}.comments (card_id, username, text) VALUES (%s,%s,%s) RETURNING id, to_char(created_at,'DD.MM.YYYY HH24:MI')",
                    (card_id, username, text)
                )
                row = cur.fetchone()
                conn.commit()
                return {"statusCode": 200, "headers": cors, "body": json.dumps({"id": row[0], "time": row[1]})}

        if method == "DELETE":
            card_id = int(params.get("id", 0))
            cur.execute(f"UPDATE {SCHEMA}.cards SET likes = likes WHERE id = %s", (card_id,))
            cur.execute(f"DELETE FROM {SCHEMA}.comments WHERE card_id = %s", (card_id,))
            cur.execute(f"DELETE FROM {SCHEMA}.cards WHERE id = %s", (card_id,))
            conn.commit()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    finally:
        cur.close()
        conn.close()

    return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "bad request"})}