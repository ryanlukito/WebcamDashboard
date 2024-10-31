# app.py
from flask import Flask, Response
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)

model = YOLO(r'D:\KAMPUS\UGM\Proyek Dosen\Magenta\code\YOLO\yolov8_new3.pt')

colors = {
    0: (0, 255, 0),    # Green for 'wearing-mask'
    1: (255, 0, 0),    # Blue for 'wearing-glasses'
    2: (0, 0, 255)     # Red for 'wearing-hat'
}

class_labels = {
    0: 'wearing-mask',
    1: 'wearing-glasses',
    2: 'wearing-hat'
}

def detect_objects(frame):
    # Run YOLO model on the frame
    results = model.predict(frame, imgsz=640)  # Adjust imgsz if needed

    # Loop over detections and overlay bounding boxes
    for detection in results[0].boxes:
        x1, y1, x2, y2 = map(int, detection.xyxy[0])  # Bounding box coordinates
        confidence = detection.conf[0]  # Confidence score
        class_id = int(detection.cls[0])  # Class ID of detected object

        # Only draw if class ID exists in labels and confidence > threshold
        if class_id in class_labels and confidence > 0.5:
            label = f"{class_labels[class_id]}: {confidence:.2f}"
            color = colors.get(class_id, (255, 255, 255))  # Default to white if no color defined
            
            # Draw bounding box and label
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    return frame

def generate_frames():
    camera = cv2.VideoCapture(0)

    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Flip the frame horizontally to mirror the camera
            frame = cv2.flip(frame, 1)

            # Apply detection on the mirrored frame
            frame = detect_objects(frame)

            # Encode the frame in JPEG format
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Yield the frame in HTTP response multipart format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    camera.release()

@app.route('/video_feed')
def video_feed():
    # Return the response generated along with the specific media type (mime type)
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
