from flask import Flask, Response
import cv2
import threading
from flask_cors import CORS ,cross_origin # CORS 추가

app = Flask(__name__)
CORS(app)  # 모든 엔드포인트에 대한 CORS 활성화

# initialize a lock used to ensure thread-safe
# exchanges of the frames (useful for multiple browsers/tabs
# are viewing tthe stream)
lock = threading.Lock()


@app.route('/video')
@cross_origin()
def stream():
    print('camemraadfads')
    return Response(webcam(), mimetype="multipart/x-mixed-replace; boundary=frame")


def webcam():
    camera = cv2.VideoCapture(0)
    print('camera',camera)
    while True:
        success, frame = camera.read()
        if success:

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        else:
            camera.release()

if __name__ == "__main__":
    app.run(debug=True)
