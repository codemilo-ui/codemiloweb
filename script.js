// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("bg");
const gl = canvas.getContext("webgl");

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
window.addEventListener("resize", resize);
resize();

/* ---- Simple shader that creates moving fluid-like noise ---- */
const vertex = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_res;

  // Simple 2D noise
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(in vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res.xy;
    vec2 p = uv * 4.0;
    float t = u_time * 0.1;

    float n = noise(p + vec2(t, t));
    float n2 = noise(p * 0.5 - vec2(t*0.5, -t*0.5));
    float f = n + n2;

    vec3 col = mix(vec3(0.0, 0.1, 0.3), vec3(0.0, 0.9, 1.0), f);
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Compile shader
function compile(type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error(gl.getShaderInfoLog(s));
  return s;
}
const vs = compile(gl.VERTEX_SHADER, vertex);
const fs = compile(gl.FRAGMENT_SHADER, fragment);

const prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

// Quad
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1,-1,  1,-1,  -1,1,
  -1,1,   1,-1,   1,1
]), gl.STATIC_DRAW);
const loc = gl.getAttribLocation(prog, "a_position");
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

// Uniforms
const timeLoc = gl.getUniformLocation(prog, "u_time");
const resLoc  = gl.getUniformLocation(prog, "u_res");

function render(time) {
  gl.uniform1f(timeLoc, time * 0.001);
  gl.uniform2f(resLoc, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
