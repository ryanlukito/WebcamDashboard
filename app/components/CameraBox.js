"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { InferenceEngine, CVImage } from "inferencejs";

function CameraBox() {
  const inferEngine = useMemo(() => new InferenceEngine(), []);
  const [modelWorkerId, setModelWorkerId] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState(new Set());
  const [knownFaces, setKnownFaces] = useState([]); // Array to store detected faces
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const colorMap = useMemo(() => ({
    "21-30 thn -Neutral-": "rgb(255, 99, 132)",
    "21-30 thn -Happy-": "rgb(255, 0, 0)",
    "31-40 thn -Neutral-": "rgb(54, 162, 235)",
    "41-50 thn -Neutral-": "rgb(75, 192, 192)",
  }), []);

  useEffect(() => {
    if (!modelLoading) {
      setModelLoading(true);
      inferEngine
        .startWorker("peeplyticsai", 1, "rf_xKRg3WO00WPpMotXe2olMgrucC82")
        .then((id) => setModelWorkerId(id))
        .catch((error) => {
          console.error("Error initializing model worker:", error);
          setModelLoading(false);
        });
    }
  }, [inferEngine, modelLoading]);

  useEffect(() => {
    if (modelWorkerId) {
      startWebcam();
    }
  }, [modelWorkerId]);

  const startWebcam = () => {
    const constraints = {
      audio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "environment",
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current.play();
      videoRef.current.onplay = () => {
        const ctx = canvasRef.current.getContext("2d");

        const height = videoRef.current.videoHeight;
        const width = videoRef.current.videoWidth;

        videoRef.current.width = width;
        videoRef.current.height = height;

        canvasRef.current.width = width;
        canvasRef.current.height = height;

        ctx.scale(1, 1);

        detectFrame();
      };
    });
  };

  const isSameFace = (newFace) => {
    // Thresholds for distance and size similarity
    const positionThreshold = 50;
    const sizeThreshold = 0.2;

    return knownFaces.some((face) => {
      const distX = Math.abs(face.bbox.x - newFace.bbox.x);
      const distY = Math.abs(face.bbox.y - newFace.bbox.y);
      const sizeDiff = Math.abs(face.bbox.width - newFace.bbox.width) / face.bbox.width;

      return distX < positionThreshold && distY < positionThreshold && sizeDiff < sizeThreshold;
    });
  };

  const detectFrame = () => {
    if (!modelWorkerId) {
      setTimeout(detectFrame, 100 / 3);
      return;
    }

    const img = new CVImage(videoRef.current);
    inferEngine.infer(modelWorkerId, img).then((predictions) => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      predictions.forEach((prediction) => {
        const detectedClass = prediction.class.trim();

        // Check if this face has been seen before
        if (!isSameFace(prediction)) {
          setDetectedObjects((prev) => new Set(prev).add(detectedClass));
          setKnownFaces((prev) => [
            ...prev,
            { class: detectedClass, bbox: prediction.bbox },
          ]);
        }

        // Use color map for consistent color per class
        const color = colorMap[detectedClass] || "rgb(255, 159, 64)";

        // Draw bounding box and label
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;

        const x = prediction.bbox.x - prediction.bbox.width / 2;
        const y = prediction.bbox.y - prediction.bbox.height / 2;
        const width = prediction.bbox.width;
        const height = prediction.bbox.height;

        ctx.strokeRect(x, y, width, height);

        // Draw label background
        const text = `${detectedClass} ${Math.round(prediction.confidence * 100) / 100}`;
        ctx.font = "15px monospace";
        const textWidth = ctx.measureText(text).width;
        ctx.fillStyle = color;
        ctx.fillRect(x - 2, y - 30, textWidth + 4, 30);

        // Draw label text
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y - 10);
      });

      setTimeout(detectFrame, 100 / 3);
    });
  };

  return (
    <div style={{ padding: "1rem", backgroundColor: "#1c1f2e", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <div style={{ width: "640px", height: "480px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
        <h1 className="font-bold text-white text-left" style={{ marginLeft: "8px" }}>1. Camera 1</h1>
        <video
          id="video"
          ref={videoRef}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <canvas
          id="canvas"
          ref={canvasRef}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      </div>
      <div style={{ width: "160px", height: "160px", backgroundColor: "white", borderRadius: "8px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>Counter</h1>
        <p style={{ fontSize: "24px", textAlign: "center" }}>{detectedObjects.size}</p>
      </div>
    </div>
  );
}

export default CameraBox;
