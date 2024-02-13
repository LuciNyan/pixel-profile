import Jimp from 'jimp';

export async function getPixelsFromPngBuffer(dataBuffer): Promise<Buffer> {
  const image = await Jimp.read(dataBuffer);

  const width = image.getWidth();
  const height = image.getHeight();
  const pixelBuffer = Buffer.alloc(width * height * 4);

  image.scan(0, 0, width, height, (x, y, idx) => {
    pixelBuffer[idx] = image.bitmap.data[idx];
    pixelBuffer[idx + 1] = image.bitmap.data[idx + 1];
    pixelBuffer[idx + 2] = image.bitmap.data[idx + 2];
    pixelBuffer[idx + 3] = image.bitmap.data[idx + 3];
  });

  return pixelBuffer;
}

export function getBase64FromPixels(bitmapData, width, height): Promise<string> {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      image.bitmap.data = bitmapData;
      image.getBase64('image/png', function (error, str) {
        resolve(str);
      });
    });
  });
}

export function getPngBufferFromPixels(bitmapData, width, height): Promise<Buffer> {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      image.bitmap.data = bitmapData;
      image.getBuffer('image/png', function (error, buffer) {
        resolve(buffer);
      });
    });
  });
}
