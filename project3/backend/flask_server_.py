from flask import Flask, jsonify
from flask_cors import CORS ,cross_origin # CORS 추가
import cv2
from webcam import webcamStream
app = Flask(__name__)
CORS(app)  # 모든 엔드포인트에 대한 CORS 활성화
# # 더미 데이터
data = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"},
    {"id": 3, "name": "Item 3"}
]
@app.route('/api/webcam-stream', methods=['GET'])
@cross_origin()
def get_data():
    print("나와라 오밧 ")
    webcamStream()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
