import * as faceapi from "@vladmandic/face-api";

let modelsLoaded = false;
let modelsLoading = null;
let backendReady = false;

const DETECTOR_OPTIONS = [
  new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 }),
  new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.25 }),
  new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.2 }),
];

const ensureTfBackend = async () => {
  if (backendReady) return;

  const tf = faceapi.tf;
  if (!tf) {
    throw new Error("TensorFlow.js is unavailable in this browser.");
  }

  // Prefer WebGL in browsers; fall back to WASM then CPU.
  const preferredBackends = ["webgl", "wasm", "cpu"];
  let selected = null;

  for (const backend of preferredBackends) {
    try {
      const ok = await tf.setBackend(backend);
      if (ok) {
        selected = backend;
        break;
      }
    } catch {
      // Try the next backend.
    }
  }

  await tf.ready();

  if (!tf.getBackend()) {
    throw new Error(
      selected
        ? `Failed to initialize TensorFlow backend (${selected}).`
        : "No TensorFlow backend could be initialized in this browser."
    );
  }

  backendReady = true;
};

const waitForVideoFrame = async (videoEl) => {
  if (videoEl.readyState >= 2 && videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
    return;
  }

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(
        new Error("Camera frame not ready yet. Wait a second, then try again.")
      );
    }, 5000);

    const cleanup = () => {
      clearTimeout(timeout);
      videoEl.removeEventListener("loadeddata", onReady);
      videoEl.removeEventListener("playing", onReady);
    };

    const onReady = () => {
      if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
        cleanup();
        resolve();
      }
    };

    videoEl.addEventListener("loadeddata", onReady);
    videoEl.addEventListener("playing", onReady);
    onReady();
  });
};

const snapshotFromVideo = (videoEl) => {
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Unable to read camera frame.");
  }
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  return canvas;
};

const pickBestDetection = (detections) => {
  if (!detections?.length) return null;
  return detections.reduce((best, current) => {
    const bestArea = best.detection.box.width * best.detection.box.height;
    const currentArea =
      current.detection.box.width * current.detection.box.height;
    return currentArea > bestArea ? current : best;
  });
};

const detectFaceDescriptor = async (input) => {
  for (const options of DETECTOR_OPTIONS) {
    const detections = await faceapi
      .detectAllFaces(input, options)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const best = pickBestDetection(detections);
    if (best?.descriptor) {
      return Array.from(best.descriptor);
    }
  }
  return null;
};

export const loadFaceModels = async () => {
  if (modelsLoaded) return;
  if (modelsLoading) {
    await modelsLoading;
    return;
  }

  modelsLoading = (async () => {
    await ensureTfBackend();
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);
    modelsLoaded = true;
  })()
    .catch((error) => {
      modelsLoaded = false;
      throw error;
    })
    .finally(() => {
      modelsLoading = null;
    });

  await modelsLoading;
};

export const getFaceDescriptorFromVideo = async (videoEl) => {
  if (!videoEl) {
    throw new Error("Camera is not ready.");
  }

  await loadFaceModels();
  await waitForVideoFrame(videoEl);

  // Prefer a still canvas frame — more reliable than live video in some browsers.
  const frame = snapshotFromVideo(videoEl);
  let descriptor = await detectFaceDescriptor(frame);

  if (!descriptor) {
    descriptor = await detectFaceDescriptor(videoEl);
  }

  if (!descriptor) {
    throw new Error(
      "No face detected. Move closer, face the camera with good light, and try again."
    );
  }

  return descriptor;
};
