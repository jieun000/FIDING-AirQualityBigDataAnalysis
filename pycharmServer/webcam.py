import cv2
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def webcamStream():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return None

    window_name = "Live Webcam Feed"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    frames = []

    while True:
        ret, frame = cap.read()

        if not ret:
            print("Error: Failed to grab frame.")
            break

        frames.append(frame)

        cv2.imshow(window_name, frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    return frames

@app.route('/api/webcam-stream', methods=['GET'])
@cross_origin()
def get_data():
    print("Webcam stream started.")
    frames = webcamStream()

    # Process frames or perform any additional logic if needed
    print("Webcam stream ended.")
    return jsonify({"message": "Webcam stream ended."})

if __name__ == '__main__':
    app.run(debug=True)
