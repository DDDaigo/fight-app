from flask import Flask, render_template, request, jsonify
from models import db, Label
from datetime import datetime
import uuid



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_labels', methods=["POST"])
def save_labels():
    data = request.json
    print("受け取ったデータ", data) # 確認用

    labels = data.get('labels', [])
    match_id = data.get('match_id')

    for label in labels:
        print("ほぞん対象ラベル:", label) # 確認用ここで1件ずつだす
        new_label = Label(
            match_id=match_id,
            player=label['player'],
            side=label['side'],
            command=label['command'],
            time=label['time']
        )
        db.session.add(new_label)
    db.session.commit()
    print("DBへの保存完了")
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)