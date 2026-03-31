import base64
import json
import os
import uuid

import boto3

ACCESS_KEY = os.environ["AWS_ACCESS_KEY_ID"]

MIME_TO_EXT = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/heic": ".heic",
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
    "video/x-msvideo": ".avi",
    "video/webm": ".webm",
    "video/mpeg": ".mpeg",
}


def handler(event: dict, context) -> dict:
    """Загрузка фото или видео на S3, возвращает CDN-ссылку"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    body = json.loads(event.get("body") or "{}")
    file_data = body.get("file")
    file_type = body.get("type", "image/jpeg").lower()

    if not file_data:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "no file"})}

    # Декодируем base64
    if "," in file_data:
        file_data = file_data.split(",", 1)[1]
    raw = base64.b64decode(file_data)

    ext = MIME_TO_EXT.get(file_type, ".jpg")
    key = f"onlygirl/{uuid.uuid4().hex}{ext}"

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=raw, ContentType=file_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{ACCESS_KEY}/files/{key}"
    return {"statusCode": 200, "headers": cors, "body": json.dumps({"url": cdn_url})}