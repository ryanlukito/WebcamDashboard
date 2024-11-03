"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

function CameraBox() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceCount, setFaceCount] = useState(0); // Counter for faces detected in current frame

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${window.location.origin}/models`;
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
        alert("Webcam access was denied. Please allow camera access and refresh the page.");
      });
  };

  useEffect(() => {
    const handleVideoPlay = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender();

          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Update the faceCount to the number of faces detected in the current frame
          setFaceCount(detections.length);

          if (detections.length > 0) {
            resizedDetections.forEach(detection => {
              const { age, gender, genderProbability } = detection;
              const expressions = detection.expressions.asSortedArray();
              const highestExpression = expressions[0].expression;

              const box = detection.detection.box;
              const text = `Age: ${Math.round(age)}, Gender: ${gender} (${Math.round(genderProbability * 100)}%), Expression: ${highestExpression}`;

              // Draw bounding box
              context.strokeStyle = "red";
              context.lineWidth = 2;
              context.strokeRect(box.x, box.y, box.width, box.height);

              // Draw text label above the box
              context.font = "16px Arial";
              context.fillStyle = "red";
              context.fillText(text, box.x, box.y - 10);
            });
          }
        } catch (error) {
          console.error("Error during face detection:", error);
        }
      }, 100);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('play', handleVideoPlay);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('play', handleVideoPlay);
      }
    };
  }, []); // No dependencies needed here

  return (
    <div className="p-4 bg-[#1c1f2e] flex flex-col items-left gap-4 relative">
      <div className="w-[640px] h-[480px] relative rounded-lg overflow-hidden">
        <h1 className="font-bold text-white text-left mb-4 ml-2">Camera 1</h1>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover ml-2"
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
      {/* Counter Box */}
      <div className="flex flex-col items-center justify-left w-24 h-24 ml-2 bg-white rounded-lg shadow-lg text-center">
        <p className="font-bold m-0">Counter</p>
        <p className="text-2xl m-0">{faceCount}</p>
      </div>
    </div>
  );
}

export default CameraBox;
