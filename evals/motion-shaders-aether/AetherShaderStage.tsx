import React, { useEffect, useRef, useState } from 'react';

const VERTEX_SHADER = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_velocity;
uniform float u_harmonic;
uniform float u_dither;
uniform float u_reduced;

vec3 oklch2rgb(float L, float C, float H_deg) {
  float h = radians(H_deg);
  float a = C * cos(h);
  float b = C * sin(h);
  float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  float s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  vec3 lin = vec3(
    +4.0767416621 * (l_*l_*l_) - 3.3077115913 * (m_*m_*m_) + 0.2309699292 * (s_*s_*s_),
    -1.2684380046 * (l_*l_*l_) + 2.6097574011 * (m_*m_*m_) - 0.3413193965 * (s_*s_*s_),
    -0.0041960863 * (l_*l_*l_) - 0.7034186147 * (m_*m_*m_) + 1.7076147010 * (s_*s_*s_)
  );
  return pow(clamp(lin, 0.0, 1.0), vec3(1.0 / 2.2));
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  vec2 ptr = (u_pointer - 0.5) * vec2(u_resolution.x / min(u_resolution.x, u_resolution.y), 1.0);
  float d1 = length(p) - 0.28 + 0.04 * sin(atan(p.y, p.x) * u_harmonic + u_time * 2.0);
  float d2 = length(p - ptr * 0.35) - 0.16;
  float d = smin(d1, d2, 0.22);
  float rings = smoothstep(0.015, 0.0, abs( fract(d * 14.0 - u_time * 0.4) - 0.5 ) - 0.42);
  vec3 bg = oklch2rgb(0.14, 0.008, 121.2);
  vec3 fg = oklch2rgb(0.84, 0.21, 121.2);
  fragColor = vec4(mix(bg, fg, rings), 1.0);
}`;

export function AetherShaderStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [harmonic, setHarmonic] = useState(6.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    let rafId = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(() => {});
    io.observe(canvas);

    const render = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(gl.getUniformLocation(prog, 'u_resolution'), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(prog, 'u_time'), reduced ? 4.0 : now * 0.001);
      gl.uniform2f(gl.getUniformLocation(prog, 'u_pointer'), 0.5, 0.5);
      gl.uniform1f(gl.getUniformLocation(prog, 'u_harmonic'), harmonic);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced && !document.hidden) rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, [harmonic]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090a06] text-[#f1f2ef]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-6 left-6 flex gap-2 font-mono text-xs">
        {[4, 6, 8, 12].map((h) => (
          <button key={h} onClick={() => setHarmonic(h)} className="px-3 py-1.5 border border-[#363a2e]">
            H:{h}x
          </button>
        ))}
      </div>
    </div>
  );
}
export default AetherShaderStage;
