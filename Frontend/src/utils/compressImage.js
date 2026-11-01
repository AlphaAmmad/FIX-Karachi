import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  if (!file) return file;
  return imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
}
