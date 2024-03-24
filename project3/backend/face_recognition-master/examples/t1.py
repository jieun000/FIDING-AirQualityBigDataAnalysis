import cv2
import face_recognition
import pickle
import requests

# Load the trained KNN model
with open("trained_knn_model.clf", 'rb') as f:
    knn_clf = pickle.load(f)

# ESP32 URL
URL = "http://192.168.0.121"

# Face recognition and OpenCV setup
cap = cv2.VideoCapture(URL + ":81/stream")

def set_face_detect(url: str, face_detect: int=1):
    try:
        requests.get(url + "/control?var=face_detect&val={}".format(1 if face_detect else 0))
    except:
        print("SET_FACE_DETECT: something went wrong")
    return face_detect

if __name__ == '__main__':
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
