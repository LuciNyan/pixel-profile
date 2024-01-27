import {render} from './renderer.js';

export function pixelate(sourceBuffer, width, height, blockSize): Buffer {
  return render(sourceBuffer, width, height, (uv, texture2D) => {
    const blockW = blockSize / width;
    const blockH = blockSize / height;
    const x = Math.floor(uv[0] / blockW);
    const y = Math.floor(uv[1] / blockH);

    return texture2D([x * blockW + blockW / 2, y * blockH + blockH / 2]);
  });
}

const margin = [0, 0];
const screenCurvature = 0.1;

export function curve(sourcePixels, width, height): Buffer {
  return render(sourcePixels, width, height, (uv, texture2D) => {
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1];
    }

    function prod2(v) {
      return v[0] * v[1];
    }

    function subtract(vec1, vec2) {
      return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
    }

    function distortCoordinates(coords): [number, number] {
      const cc = subtract(coords, [0.5, 0.5]);
      const dist = dot(cc, cc) * screenCurvature;
      const temp = (1 + dist) * dist;
      cc[0] = cc[0] * temp;
      cc[1] = cc[1] * temp;

      return [coords[0] + cc[0], coords[1] + cc[1]];
    }

    const coords = distortCoordinates(uv);
    coords[0] = coords[0] * (margin[0] * 2 + 1) - margin[0];
    coords[1] = coords[1] * (margin[1] * 2 + 1) - margin[1];

    const vignetteCoords = [uv[0] * (1 - uv[1]), uv[1] * (1 - uv[0])];
    const vignette = Math.pow(prod2(vignetteCoords) * 15, 0.25);

    const samplerColor = texture2D(coords);

    return [
      samplerColor[0] * vignette,
      samplerColor[1] * vignette,
      samplerColor[2] * vignette,
      255
    ];
  });
}
