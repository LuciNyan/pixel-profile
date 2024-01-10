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

function clamp(x, min, max) {
  return Math.min(max, Math.max(min, x));
}

function runFragShader(sourcePixels, width, height, fragShader) {
  const targetBuffer = Buffer.alloc(width * height * 4);

  function biLinearInterpolate(v1, v2, v3, v4, sx, sy) {
    const tmp1 = v1 * (1 - sx) + v2 * sx;
    const tmp2 = v3 * (1 - sx) + v4 * sx;
    return tmp1 * (1 - sy) + tmp2 * sy;
  }

  function biLinearFilter(coords) {
    const x = coords[0] * width;
    const y = coords[1] * height;
    const x0 = clamp(Math.floor(x), 0, width - 1);
    const x1 = clamp(x0 + 1, 0, width - 1);
    const y0 = clamp(Math.floor(y), 0, height - 1);
    const y1 = clamp(y0 + 1, 0, height - 1);

    const sx = x - x0;
    const sy = y - y0;

    const p00 = (y0 * width + x0) * 4;
    const p01 = (y1 * width + x0) * 4;
    const p10 = (y0 * width + x1) * 4;
    const p11 = (y1 * width + x1) * 4;

    const r = biLinearInterpolate(
      sourcePixels[p00],
      sourcePixels[p10],
      sourcePixels[p01],
      sourcePixels[p11],
      sx,
      sy,
    );
    const g = biLinearInterpolate(
      sourcePixels[p00 + 1],
      sourcePixels[p10 + 1],
      sourcePixels[p01 + 1],
      sourcePixels[p11 + 1],
      sx,
      sy,
    );
    const b = biLinearInterpolate(
      sourcePixels[p00 + 2],
      sourcePixels[p10 + 2],
      sourcePixels[p01 + 2],
      sourcePixels[p11 + 2],
      sx,
      sy,
    );
    const a = biLinearInterpolate(
      sourcePixels[p00 + 3],
      sourcePixels[p10 + 3],
      sourcePixels[p01 + 3],
      sourcePixels[p11 + 3],
      sx,
      sy,
    );

    return [r, g, b, a];
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const vUv = vec2.fromValues(x / width, y / height);
      const rgba = fragShader(vUv, biLinearFilter);
      const index = coords2Index(x, y, width);
      targetBuffer[index] = rgba[0];
      targetBuffer[index + 1] = rgba[1];
      targetBuffer[index + 2] = rgba[2];
      targetBuffer[index + 3] = rgba[3];
    }
  }

  return targetBuffer;
}

export function pixelate(sourceBuffer, width, height, blockSize) {
  return runFragShader(sourceBuffer, width, height, (vUv, texture2D) => {
    const blockW = blockSize / width;
    const blockH = blockSize / height;
    const x = Math.floor(vUv[0] / blockW);
    const y = Math.floor(vUv[1] / blockH);

    return texture2D([x * blockW + blockW / 2, y * blockH + blockH / 2]);
  });
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
