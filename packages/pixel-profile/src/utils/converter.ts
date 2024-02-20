import Jimp from 'jimp';

export async function getPixelsFromPngBuffer(pngBuffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(pngBuffer);

  const width = image.getWidth();
  const height = image.getHeight();
  const pixelsBuffer = Buffer.alloc(width * height * 4);

  image.scan(0, 0, width, height, (x, y, idx) => {
    pixelsBuffer[idx] = image.bitmap.data[idx];
    pixelsBuffer[idx + 1] = image.bitmap.data[idx + 1];
    pixelsBuffer[idx + 2] = image.bitmap.data[idx + 2];
    pixelsBuffer[idx + 3] = image.bitmap.data[idx + 3];
  });

  return pixelsBuffer;
}

export function getBase64FromPixels(pixelsBuffer: Buffer, width: number, height: number): Promise<string> {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      image.bitmap.data = pixelsBuffer;
      image.getBase64('image/png', function (error, str) {
        resolve(str);
      });
    });
  });
}

export function getPngBufferFromPixels(pixelsBuffer: Buffer, width: number, height: number): Promise<Buffer> {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      image.bitmap.data = pixelsBuffer;
      image.getBuffer('image/png', function (error, buffer) {
        resolve(buffer);
      });
    });
  });
}
