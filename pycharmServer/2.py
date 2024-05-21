from flask import Flask, jsonify, render_template,request
import tensorflow as tf
from tensorflow import keras
import cv2
import face_recognition
import pickle
import requests
app = Flask(__name__)

# CORS 설정 - 실제 환경에서는 정확한 도메인을 설정해야 합니다.
from flask_cors import CORS
CORS(app)
m_list = [ 'PM10', 'PM2.5']
loaded_models = {}

#####################################deep 부분
with open("trained_knn_model.clf", 'rb') as f:
    knn_clf = pickle.load(f)

# ESP32 URL
URL = "http://192.168.0.122"

# Face recognition and OpenCV setup
cap = cv2.VideoCapture(URL + ":81/stream")

def set_face_detect(url: str, face_detect: int=1):
    try:
        requests.get(url + "/control?var=face_detect&val={}".format(1 if face_detect else 0))
    except:
        print("SET_FACE_DETECT: something went wrong")
    return face_detect
######################################

def pearson_correlation_coefficient(y_true, y_pred):
    mx = tf.reduce_mean(y_true)
    my = tf.reduce_mean(y_pred)
    xm, ym = y_true - mx, y_pred - my
    r_num = tf.reduce_sum(xm * ym)
    r_den = tf.sqrt(tf.reduce_sum(tf.square(xm)) * tf.reduce_sum(tf.square(ym)))
    r = r_num / (r_den + tf.keras.backend.epsilon())
    return tf.reduce_mean(r)


def create_model():
    model = tf.keras.Sequential([
        keras.layers.Dense(20, activation='sigmoid', input_shape=(4,)),
        keras.layers.Dropout(0.5),
        keras.layers.Dense(40, activation='sigmoid'),
        keras.layers.Dense(1)  # Output layer for regression task
    ])
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    model.compile(optimizer=optimizer,
                  loss=tf.keras.losses.MSE,
                  metrics=[pearson_correlation_coefficient])

    return model

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    data = request.json
    result={}
    m_list = ['아황산가스', '일산화탄소', '오존', '이산화질소', 'PM10', 'PM2.5']
    m_code_list=["a","c",'o','n','10','2.5']#바꿔도 됨 react에서 요청하는 자료 형태로
    for m,code in zip(m_list,m_code_list):
        model = create_model()
        model_path = f'C:/prj3/{m}_model_weights.h5'
        model.load_weights(model_path)
        result[code] = model.predict([[756, 31.47267, 0, 0.021]])#이부분 data로
        print(result[code])

    return jsonify(result)
@app.route('/api/data2')
def get_data2():
    data = request.json
    user_id=data.id
    result={}
    set_face_detect(URL, 1)
    while True:
        if cap.isOpened():
            ret, frame = cap.read()
            if ret:
                # Find all face locations in the current frame
                face_locations = face_recognition.face_locations(frame)
                print(face_locations)
                # If no faces are found in the frame, continue to the next frame
                if len(face_locations) == 0:
                    continue

                # Find face encodings for the faces in the frame
                faces_encodings = face_recognition.face_encodings(frame, known_face_locations=face_locations)

                # Use the KNN model to find the best matches for the faces
                closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=1)
                are_matches = [closest_distances[0][i][0] <= 0.6 for i in range(len(face_locations))]

                # Draw rectangles and display names on the video frame
                for (top, right, bottom, left), are_match in zip(face_locations, are_matches):
                    if are_match:
                        name = knn_clf.predict([faces_encodings[are_matches.index(True)]])[0]
                    else:
                        name = "unknown"

                    # Draw a rectangle around the face
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                    # Display the name below the face
                    cv2.putText(frame, name, (left, bottom + 20), cv2.FONT_HERSHEY_DUPLEX, 0.5, (255, 255, 255), 1)

                # Display the resulting frame
                cv2.imshow('Video', frame)

                # Break the loop when 'q' key is pressed
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
    # Release the video capture object and close all OpenCV windows
    cv2.destroyAllWindows()
    cap.release()

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)