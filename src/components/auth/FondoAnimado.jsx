import { useEffect, useRef } from 'react'

// Fondo animado de login y registro (diseño de Stitch): un shader WebGL que
// dibuja un fondo navy, un brillo índigo, una onda de luz índigo-cian y una
// grilla de puntos tenues. Todo el dibujo lo hace la GPU en el fragment shader.

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.22;

  // Base navy (#0B1026 a #080C1D)
  vec3 baseColor = mix(vec3(0.043, 0.063, 0.149), vec3(0.031, 0.047, 0.114), uv.y);

  // Brillo índigo (#3730A3) que se mueve despacio
  vec2 glowPos = vec2(0.35 + 0.05 * sin(t * 0.8), 0.5 + 0.04 * cos(t * 0.7));
  vec3 ambientGlow = vec3(0.18, 0.14, 0.48) * smoothstep(0.9, 0.0, length(uv - glowPos)) * 0.35;

  // Onda de luz
  float wave = sin(uv.x * 3.8 + t) * 0.08 + cos(uv.x * 2.1 - t * 0.7) * 0.05;
  float waveDist = abs(uv.y - (0.42 + wave));
  float ribbonCore = exp(-waveDist * 42.0) * 0.85;
  float ribbonHalo = exp(-waveDist * 12.0) * 0.35;
  vec3 ribbonCol = mix(vec3(0.427, 0.157, 0.851), vec3(0.22, 0.55, 0.92), uv.x);

  // Grilla de puntos; los cercanos a la onda se iluminan
  float gridStep = 48.0;
  vec2 gUv = uv * vec2(gridStep, gridStep * (u_resolution.y / u_resolution.x));
  float d = length(fract(gUv) - 0.5);
  float dotAlpha = smoothstep(0.08, 0.02, d) * 0.14;
  float nearWave = smoothstep(0.25, 0.0, waveDist);
  vec3 dots = mix(vec3(0.2, 0.25, 0.45), ribbonCol, nearWave * 0.6) * (dotAlpha + nearWave * dotAlpha * 1.5);

  vec3 color = baseColor + ambientGlow + dots + ribbonCol * (ribbonCore + ribbonHalo);

  // Viñeta suave
  float vig = smoothstep(1.3, 0.45, length(uv - 0.5));
  color *= mix(0.85, 1.0, vig);

  gl_FragColor = vec4(color, 1.0);
}`

const compilarShader = (gl, tipo, fuente) => {
  const shader = gl.createShader(tipo)
  gl.shaderSource(shader, fuente)
  gl.compileShader(shader)
  return shader
}

const FondoAnimado = () => {
  const canvasRef = useRef(null)

  // El canvas es un sistema externo a React: el efecto lo inicializa y la
  // función de limpieza corta la animación al salir de la pantalla.
  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl')
    // Sin WebGL queda el degradado navy de .auth-pantalla como respaldo.
    if (!gl) return

    const programa = gl.createProgram()
    gl.attachShader(programa, compilarShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER))
    gl.attachShader(programa, compilarShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
    gl.linkProgram(programa)
    gl.useProgram(programa)

    // Dos triángulos que cubren todo el canvas.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const posicion = gl.getAttribLocation(programa, 'a_position')
    gl.enableVertexAttribArray(posicion)
    gl.vertexAttribPointer(posicion, 2, gl.FLOAT, false, 0, 0)

    const uTiempo = gl.getUniformLocation(programa, 'u_time')
    const uResolucion = gl.getUniformLocation(programa, 'u_resolution')

    let ultimoMs = 0
    const dibujar = (ms) => {
      ultimoMs = ms
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform1f(uTiempo, ms / 1000)
      gl.uniform2f(uResolucion, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // El buffer de dibujo acompaña el tamaño que le da el CSS al canvas.
    // Cambiar el tamaño borra el canvas, así que se vuelve a dibujar.
    const ajustarTamano = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      dibujar(ultimoMs)
    }
    const observador = new ResizeObserver(ajustarTamano)
    observador.observe(canvas)
    ajustarTamano()

    // Si el usuario pidió menos movimiento queda el primer cuadro fijo.
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cuadro
    const animar = (ms) => {
      dibujar(ms)
      cuadro = requestAnimationFrame(animar)
    }
    if (!sinMovimiento) cuadro = requestAnimationFrame(animar)

    return () => {
      cancelAnimationFrame(cuadro)
      observador.disconnect()
      gl.deleteProgram(programa)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return <canvas ref={canvasRef} className="auth-fondo" aria-hidden="true" />
}

export default FondoAnimado
