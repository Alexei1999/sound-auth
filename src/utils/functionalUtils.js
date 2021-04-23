export const initMediaStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return null;
  } catch (e) {
    throw e;
  }
};
