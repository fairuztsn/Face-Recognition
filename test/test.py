import face_recognition
import cv2
import numpy as np
import os
import json

video_capture = cv2.VideoCapture(0)
address = "http://10.128.195.91:8080/video"
address = "http://10.160.111.149:8080/video"
video_capture.open(address)

print("Camera is opened : ", video_capture.isOpened())

with open("yamori.json") as JSON:
    image_face_encoding = json.load(JSON)

print("processing image_face_encoding, completed")
print("appending to known_face_encodings . . . ")
known_face_encodings = []

for key, value in image_face_encoding.items():
    known_face_encodings.append(np.array(value))

SISWAs = os.listdir("images/")
known_face_names = SISWAs = [os.path.splitext(string)[0] for string in SISWAs]

print("appending to known_face_encodings completed")

face_locations = []
face_encodings = []
face_names = []
process_this_frame = True

print("executing While Loop . . .")
while True:
    ret, frame = video_capture.read()

    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    rgb_small_frame = small_frame[:, :, ::-1]

    if process_this_frame:
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index]

            face_names.append(name)

    if len(face_names) != 0:
        print(f"Detected face: {face_names}")
    process_this_frame = not process_this_frame


    # Display the results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Scale back up face locations since the frame we detected in was scaled to 1/4 size
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Display the resulting image
    cv2.imshow('Video', frame)

    # Hit 'q' on the keyboard to quit!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()