from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class Label(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id = db.Column(db.String(100), nullable=False) # 試合ごとの識別子
    player = db.Column(db.String(1), nullable=False) # A or B
    side = db.Column(db.String(10), nullable=False) # right or left
    command = db.Column(db.String(100), nullable=False) # コマンド名
    time = db.Column(db.Float, nullable=False) # 動画内の時間（秒）
    created_at = db.Column(db.DateTime, default=datetime.utcnow) # 登録日時
    