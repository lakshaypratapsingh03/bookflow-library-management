export const FACE_MATCH_THRESHOLD = 0.6;
export const FACE_DESCRIPTOR_LENGTH = 128;

export const euclideanDistance = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
        return Number.POSITIVE_INFINITY;
    }

    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        const diff = a[i] - b[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
};

export const isValidDescriptor = (descriptor) =>
    Array.isArray(descriptor) &&
    descriptor.length === FACE_DESCRIPTOR_LENGTH &&
    descriptor.every((value) => typeof value === "number" && Number.isFinite(value));

export const isFaceMatch = (
    stored,
    candidate,
    threshold = FACE_MATCH_THRESHOLD
) => {
    if (!isValidDescriptor(stored) || !isValidDescriptor(candidate)) {
        return false;
    }
    return euclideanDistance(stored, candidate) <= threshold;
};
