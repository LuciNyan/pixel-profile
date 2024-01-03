import webgl from "gl";
import Jimp from "jimp";

function getPngBufferFromBitmap(bitmapData, width, height) {
  return new Promise((resolve) => {
    new Jimp(width, height, function (err, image) {
      // assign the bitmap as data for the image
      image.bitmap.data = bitmapData;
      // generate base64
      image.getBuffer("image/png", function (error, buffer) {
        // result
        resolve(buffer);
      });
    });
  });
}
export function genResultConvert(width, height) {
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
                        precision mediump float;
    
                        uniform sampler2D u_Sampler;
                        uniform lowp float screenCurvature;
                        uniform lowp float screenShadowCoeff;
                        uniform lowp float frameShadowCoeff;
                        uniform highp float qt_Opacity;
                        uniform lowp vec4 frameColor;
                        uniform mediump vec2 margin;
    
                        varying highp vec2 vUv;
    
                        vec2 distortCoordinates(vec2 coords){
                            vec2 cc = (coords - vec2(0.5));
                            float dist = dot(cc, cc) * screenCurvature;
                            return (coords + cc * (1.0 + dist) * dist);
                        }
    
                        float max2(vec2 v) {
                            return max(v.x, v.y);
                        }
    
                        float prod2(vec2 v) {
                            return v.x * v.y;
                        }
    
                        float sum2(vec2 v) {
                            return v.x + v.y;
                        }
    
                        vec2 positiveLog(vec2 x) {
                            return clamp(log(x), vec2(0.0), vec2(100.0));
                        }
    
                        void main() {
                          vec2 staticCoords = vUv;
                          vec2 coords = distortCoordinates(staticCoords) * (vec2(1.0) + margin * 2.0) - margin;
  
                          vec2 vignetteCoords = staticCoords * (1.0 - staticCoords.yx);
                          float vignette = pow(prod2(vignetteCoords) * 15.0, 0.25);
  
                          vec4 samplerColor = texture2D(u_Sampler, coords);
  
                          vec3 color = samplerColor.rgb * vec3(vignette);
                          float alpha = 0.0;
  
                          float frameShadow = max2(positiveLog(-coords * frameShadowCoeff + vec2(1.0)) + positiveLog(coords * frameShadowCoeff - (vec2(frameShadowCoeff) - vec2(1.0))));
                          frameShadow = max(sqrt(frameShadow * 0.5), 0.0);
                          color *= frameShadow;
                          alpha = sum2(1.0 - step(vec2(0.0), coords) + step(vec2(1.0), coords));
                          alpha = clamp(alpha, 0.0, 1.0);
                          alpha *= mix(1.0, 0.9, frameShadow);

                          float screenShadow = 1.0 - prod2(positiveLog(coords * screenShadowCoeff + vec2(1.0)) * positiveLog(-coords * screenShadowCoeff + vec2(screenShadowCoeff + 1.0)));
                          alpha = max(0.8 * screenShadow, alpha);

                          // gl_FragColor = vec4(color * alpha, alpha);
                          gl_FragColor = vec4(color, 1.0);
                        }
                    `;

    const program = initShader(gl, vertexShaderSource, fragShaderSource);

    const a_Position = gl.getAttribLocation(program, "a_Position");
    const a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
    const u_Sampler = gl.getUniformLocation(program, "u_Sampler");

    gl.uniform1f(gl.getUniformLocation(program, "screenCurvature"), 0.1);
    gl.uniform1f(gl.getUniformLocation(program, "screenShadowCoeff"), -0.0);
    gl.uniform1f(gl.getUniformLocation(program, "frameShadowCoeff"), -4.0);
    gl.uniform1f(gl.getUniformLocation(program, "qt_Opacity"), 0.0);
    gl.uniform4f(
      gl.getUniformLocation(program, "frameColor"),
      0.0,
      0.0,
      1.0,
      1.0,
    );
    gl.uniform2f(gl.getUniformLocation(program, "margin"), 0.0, 0.0);

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

    return await getPngBufferFromBitmap(bitmapData, width, height);
  }

  async function convert(src) {
    return await run(src);
  }

  return convert;
}
