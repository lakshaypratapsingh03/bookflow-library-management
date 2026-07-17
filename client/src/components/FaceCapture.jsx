import { useCallback, useEffect, useRef, useState } from "react";
import { getFaceDescriptorFromVideo, loadFaceModels } from "../utils/faceApi.js";

const stopStream = (stream) => {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
};

const cameraErrorMessage = (err) => {
  const name = err?.name || "";
  const message = err?.message || "";

  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Camera permission denied. Allow camera access for this site and try again.";
  }

  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "No camera was found. Connect a webcam and try again.";
  }

  if (
    name === "NotReadableError" ||
    name === "TrackStartError" ||
    /could not start video source/i.test(message)
  ) {
    return "Could not start the camera. Close other apps using it, then retry. If you are on WSL, open http://localhost:5173 in Windows Chrome/Edge so the Windows webcam can be used.";
  }

  if (name === "OverconstrainedError") {
    return "Camera settings are not supported. Retrying with basic settings may help.";
  }

  if (!window.isSecureContext && window.location.hostname !== "localhost") {
    return "Camera access requires HTTPS or localhost.";
  }

  return message || "Unable to access camera.";
};

const getCameraStream = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera API is not supported in this browser.");
  }

  const attempts = [
    { video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false },
    { video: { facingMode: "user" }, audio: false },
    { video: true, audio: false },
  ];

  let lastError = null;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Unable to access camera.");
};

const FaceCapture = ({
  onCapture,
  captureLabel = "Capture Face",
  disabled = false,
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const startCamera = useCallback(async () => {
    setError(null);
    setCameraReady(false);
    setStarting(true);

    stopStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    try {
      await loadFaceModels();
      setModelsReady(true);

      const stream = await getCameraStream();
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (err) {
      setError(cameraErrorMessage(err));
      setCameraReady(false);
    } finally {
      setStarting(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled) return;
      await startCamera();
    })();

    return () => {
      cancelled = true;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, [retryKey, startCamera]);

  const handleCapture = async () => {
    setError(null);
    setCapturing(true);
    try {
      const descriptor = await getFaceDescriptorFromVideo(videoRef.current);
      await onCapture(descriptor);
    } catch (err) {
      setError(err?.message || "Face capture failed.");
    } finally {
      setCapturing(false);
    }
  };

  const isBusy = disabled || capturing || starting || !cameraReady || !modelsReady;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-[4/3]">
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        {!cameraReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-[#F5E6C8] text-sm bg-black/60">
            {starting ? "Starting camera..." : "Loading..."}
          </div>
        )}
      </div>

      {error && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button
            type="button"
            onClick={() => setRetryKey((key) => key + 1)}
            className="w-fit px-3 py-1.5 rounded-md text-sm font-semibold bg-gray-600 text-[#EAC9AA] hover:bg-gray-800"
          >
            Retry Camera
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleCapture}
        disabled={isBusy}
        className="w-full py-2 rounded-md font-semibold bg-[#156662] text-[#EAC9AA] border-2 border-[#DDB287] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {capturing
          ? "Capturing..."
          : starting
            ? "Starting camera..."
            : !modelsReady
              ? "Loading models..."
              : captureLabel}
      </button>
    </div>
  );
};

export default FaceCapture;
