from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import supervision as sv

app = Flask(__name__)
CORS(app)

model = YOLO(r'D:\Project\best.pt')

colors = {
    0: (0, 255, 0),    # Green for '21-30 thn (Angry)'
    1: (255, 0, 0),    # Blue for '21-30 thn (Happy)'
    2: (0, 0, 255)     # Red for '21-30 thn (Neutral)' and more...
}

class_labels = {
    0: '21-30 thn (Angry)',
    1: '21-30 thn (Happy)',
    2: '21-30 thn (Neutral)',
    3: '21-30 thn (Sad)',
    4: '31-40 thn (Angry)',
    5: '31-40 thn (Happy)',
    6: '31-40 thn (Neutral)',
    7: '31-40 thn (Sad)',
    8: '41-50 thn (Angry)',
    9: '41-50 thn (Happy)',
    10: '41-50 thn (Neutral)',
    11: '41-50 thn (Sad)',
    12: '50+ thn (Angry)',
    13: '50+ thn (Happy)',
    14: '50+ thn (Neutral)',
    15: '50+ thn (Sad)'
}

# Initialize tracking and counting variables
byte_tracker = sv.ByteTrack()
object_counter = 0
tracked_ids = set()

def detect_and_count(frame):
    global object_counter, tracked_ids

    # Run YOLO model on the frame
    results = model(frame, imgsz=640, verbose=False)[0]

    # Convert detections to Supervision format
    detections = sv.Detections.from_ultralytics(results)
    detections = byte_tracker.update_with_detections(detections)

    labels = [
        f"{class_labels[class_id]} {confidence:.2f}"  # Display only class name and confidence
        for confidence, class_id, tracker_id in zip(detections.confidence, detections.class_id, detections.tracker_id)
    ]

    for tracker_id in detections.tracker_id:
        if tracker_id not in tracked_ids:
            tracked_ids.add(tracker_id)
            object_counter += 1

    # Annotate the frame with bounding boxes and labels
    annotated_frame = frame.copy()
    bounding_box_annotator = sv.BoundingBoxAnnotator(thickness=2)
    label_annotator = sv.LabelAnnotator(text_thickness=2)
    
    annotated_frame = bounding_box_annotator.annotate(
        scene=annotated_frame,
        detections=detections
    )
    annotated_frame = label_annotator.annotate(
        scene=annotated_frame,
        detections=detections,
        labels=labels
    )

    # Display count on the frame
    cv2.putText(annotated_frame, f"Count: {object_counter}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    return annotated_frame

def generate_frames():
    camera = cv2.VideoCapture(0)

    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Flip the frame horizontally to mirror the camera
            frame = cv2.flip(frame, 1)

            # Detect and count objects
            frame = detect_and_count(frame)

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

@app.route('/counter')
def counter():
    # Return the current count as JSON
    return jsonify(count=object_counter)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
