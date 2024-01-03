import webgl from "gl";
import Jimp from "jimp";

function getBase64FromBitmap(bitmapData, width, height) {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      // assign the bitmap as data for the image
      image.bitmap.data = bitmapData;
      // generate base64
      image.getBase64("image/png", function (error, str) {
        // result
        resolve(str);
      });
    });
  });
}
export function genAvatarConvert(width, height) {
  function initShader(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    return program;
  }

  async function run(img) {
    const gl = webgl(width, height, { preserveDrawingBuffer: true });

    const vertexShaderSource = `
                            attribute vec4 a_Position;
                            attribute vec2 a_TexCoord;
                            varying highp vec2 vUv;
        
                            void main(){
                                gl_Position = a_Position;
                                vUv = a_TexCoord;
                            }
                        `;

    const fragShaderSource = `
                  precision highp float;

                  uniform sampler2D u_Sampler;
                  uniform float uBlocksize;
                  uniform float uStepW;
                  uniform float uStepH;
                  varying vec2 vUv;

                  void main() {
                    float blockW = uBlocksize * uStepW;
                    float blockH = uBlocksize * uStepW;
                    int posX = int(vUv.x / blockW);
                    int posY = int(vUv.y / blockH);
                    float fposX = float(posX);
                    float fposY = float(posY);
                    vec2 squareCoords = vec2(fposX * blockW, fposY * blockH);
                    vec4 color = texture2D(u_Sampler, squareCoords);
                    gl_FragColor = color;
                  }
                `;

    const program = initShader(gl, vertexShaderSource, fragShaderSource);

    const a_Position = gl.getAttribLocation(program, "a_Position");
    const a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
    const u_Sampler = gl.getUniformLocation(program, "u_Sampler");

    // gl.uniform1f(gl.getUniformLocation(program,'screenCurvature'), 0.15)
    // gl.uniform1f(gl.getUniformLocation(program,'screenShadowCoeff'), -500.0)
    // gl.uniform1f(gl.getUniformLocation(program,'frameShadowCoeff'), -5.0)
    // gl.uniform1f(gl.getUniformLocation(program,'qt_Opacity'), 0.0)
    // gl.uniform4f(gl.getUniformLocation(program,'frameColor'), -1.0, 1.0, 1.0, 1.0)
    // gl.uniform2f(gl.getUniformLocation(program,'margin'), 0.0, 0.0)

    gl.uniform1f(gl.getUniformLocation(program, "uBlocksize"), 7.4);
    gl.uniform1f(gl.getUniformLocation(program, "uStepW"), 1 / width);
    gl.uniform1f(gl.getUniformLocation(program, "uStepH"), 1 / height);

    const data = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const textureData = new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_TexCoord);

    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.enable(gl.BLEND);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.uniform1i(u_Sampler, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    const bitmapData = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);

    return await getBase64FromBitmap(bitmapData, width, height);
  }

  async function convert(src) {
    return await run(src);
  }

  return convert;
}
