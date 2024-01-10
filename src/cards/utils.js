import Jimp from "jimp";
import { vec2, vec3, vec4 } from "gl-matrix";
export async function getPixelsFromPngBuffer(dataBuffer) {
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

export function getBase64FromPixels(bitmapData, width, height) {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      image.bitmap.data = bitmapData;
      image.getBase64("image/png", function (error, str) {
        resolve(str);
      });
    });
  });
}

export function getPngBufferFromPixels(bitmapData, width, height) {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      image.bitmap.data = bitmapData;
      image.getBuffer("image/png", function (error, buffer) {
        resolve(buffer);
      });
    });
  });
}

function coords2Index(x, y, width) {
  return (y * width + x) * 4;
}

export function pixelate(sourceBuffer, width, height, blockSize) {
  const targetBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = coords2Index(x, y, width);
      const posX = Math.floor(x / blockSize);
      const posY = Math.floor(y / blockSize);

      const textureIndex = coords2Index(
        Math.min(Math.floor(posX * blockSize + blockSize / 2), width - 1),
        Math.min(Math.floor(posY * blockSize + blockSize / 2), height - 1),
        width,
      );
      targetBuffer[index] = sourceBuffer[textureIndex];
      targetBuffer[index + 1] = sourceBuffer[textureIndex + 1];
      targetBuffer[index + 2] = sourceBuffer[textureIndex + 2];
      targetBuffer[index + 3] = sourceBuffer[textureIndex + 3];
    }
  }

  return targetBuffer;
}

function clamp(x, min, max) {
  return Math.min(max, Math.max(min, x));
}

function runFragShader(sourcePixels, width, height, fragShader) {
  const targetBuffer = Buffer.alloc(width * height * 4);

  function texture2D(coords) {
    const x = coords[0] * width;
    const y = coords[1] * height;
    const minX = clamp(Math.floor(x), 0, width - 1);
    const minY = clamp(Math.floor(y), 0, height - 1);
    const maxX = clamp(minX + 1, 0, width - 1);
    const maxY = clamp(minY + 1, 0, height - 1);

    const i1 = coords2Index(minX, minY, width);
    const i2 = coords2Index(minX, maxY, width);
    const i3 = coords2Index(maxX, maxY, width);
    const i4 = coords2Index(maxX, minY, width);

    const r =
      (sourcePixels[i1] +
        sourcePixels[i2] +
        sourcePixels[i3] +
        sourcePixels[i4]) /
      4;
    const g =
      (sourcePixels[i1 + 1] +
        sourcePixels[i2 + 1] +
        sourcePixels[i3 + 1] +
        sourcePixels[i4 + 1]) /
      4;
    const b =
      (sourcePixels[i1 + 2] +
        sourcePixels[i2 + 2] +
        sourcePixels[i3 + 2] +
        sourcePixels[i4 + 2]) /
      4;
    const a =
      (sourcePixels[i1 + 3] +
        sourcePixels[i2 + 3] +
        sourcePixels[i3 + 3] +
        sourcePixels[i4 + 3]) /
      4;

    // if (sourcePixels[i1] !== r) {
    //   console.log('---')
    //   console.log('r', sourcePixels[i1], r)
    //   console.log('g', sourcePixels[i1 + 1], g)
    //   console.log('b', sourcePixels[i1 + 2], b)
    //   console.log('a', sourcePixels[i1 + 3], a)
    //   console.log('---')
    // }

    return vec4.fromValues(r, g, b, a);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const vUv = vec2.fromValues(x / width, y / height);
      const rgba = fragShader(vUv, texture2D);
      const index = coords2Index(x, y, width);
      targetBuffer[index] = rgba[0];
      targetBuffer[index + 1] = rgba[1];
      targetBuffer[index + 2] = rgba[2];
      targetBuffer[index + 3] = rgba[3];
    }
  }

  return targetBuffer;
}

const margin = vec2.fromValues(0, 0);
const screenCurvature = 0.1;

export function curveImage(sourcePixels, width, height) {
  return runFragShader(sourcePixels, width, height, (vUv, texture2D) => {
    function distortCoordinates(coords) {
      const cc = vec2.subtract(
        vec2.create(),
        coords,
        vec2.fromValues(0.5, 0.5),
      );
      const dist = vec2.dot(cc, cc) * screenCurvature;
      const temp = (1 + dist) * dist;
      cc[0] = cc[0] * temp;
      cc[1] = cc[1] * temp;

      return vec2.fromValues(coords[0] + cc[0], coords[1] + cc[1]);
    }

    function prod2(v) {
      return v[0] * v[1];
    }

    const coords = distortCoordinates(vUv);
    coords[0] = coords[0] * (margin[0] * 2 + 1) - margin[0];
    coords[1] = coords[1] * (margin[1] * 2 + 1) - margin[1];

    const vignetteCoords = vec2.fromValues(
      vUv[0] * (1 - vUv[1]),
      vUv[1] * (1 - vUv[0]),
    );
    const vignette = Math.pow(prod2(vignetteCoords) * 15, 0.25);

    const samplerColor = texture2D(coords);

    const color = vec3.fromValues(
      samplerColor[0] * vignette,
      samplerColor[1] * vignette,
      samplerColor[2] * vignette,
    );

    return vec4.fromValues(color[0], color[1], color[2], 255);
  });
}
