from flask import Flask, request, jsonify, url_for
from flask_cors import CORS, cross_origin
import os
from werkzeug.utils import secure_filename
import uuid
from flask.helpers import send_from_directory


app = Flask(__name__)
CORS(app)

# 업로드된 파일이 저장될 디렉토리를 설정합니다.
UPLOAD_FOLDER = 'c:/user_face_tests/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-image', methods=['POST'])
@cross_origin()
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"})

    if file and allowed_file(file.filename):
        unique_filename = str(uuid.uuid4()) + '-' + secure_filename(file.filename)
        file_path = os.path.join('c:/user_face_tests/', unique_filename)
        file.save(file_path)

        # 이미지의 URL 생성
        image_url = url_for('uploaded_file', filename=unique_filename, _external=True)

        return jsonify({
            "success": True,
            "message": "사진 저장 성공(파이참)",
            "filename": unique_filename,
            "imageUrl": image_url
        })
    else:
        return jsonify({"error": "File type not allowed"})

# 이미지에 대한 URL을 제공하는 엔드포인트 추가
@app.route('/c:/user_face_tests/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
