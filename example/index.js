const ctx = require('pex-context')()
const random = require('pex-random')
const hsluv = require('hsluv')

const createGeomBuilder = require('../')

const camera = require('pex-cam/perspective')({
  fov: Math.PI / 3,
  aspect: ctx.gl.canvas.width / ctx.gl.canvas.height * 2 / 4,
  position: [1, 1, 1]
})
require('pex-cam/orbiter')({ camera: camera })

const clearCmd = {
  pass: ctx.pass({
    clearColor: [1, 1, 1, 1],
    clearDepth: 1
  })
}

const N = 200

function noiseFunc (x, y, z) {
  var n = 0
  // x *= 1.4
  // z *= 1.4
  n += random.noise3(x, 0, z)
  n += random.noise3(x * 2, 0, z * 2) / 2
  n += random.noise3(x * 4, 0, z * 4) / 4
  n += random.noise3(x * 8, 0, z * 8) / 8
  n += random.noise3(x * 16, 0, z * 8) / 16
  n = 1 - Math.abs(n)
  // n = Math.abs(n)
  // n += random.noise3(x, 0, z)
  // n = Math.max(0, n)
  n /= 4
  return n
}

function createGeometryFromArrays () {
  random.seed(0)
  const positions = []
  const colors = []
  for (let x = 0; x < N; x++) {
    for (let z = 0; z < N; z++) {
      const a = [x / N - 0.5, 0, z / N - 0.5]
      const b = [(x + 1) / N - 0.5, 0, z / N - 0.5]
      const c = [(x + 1) / N - 0.5, 0, (z + 1) / N - 0.5]
      const d = [(x) / N - 0.5, 0, (z + 1) / N - 0.5]
      const verts = [a, b, c, d]
      verts.forEach((p) => {
        p[1] = noiseFunc(p[0], p[1], p[2])
      })
      const color = hsluv.hsluvToRgb([200 + 80 * a[1] * 4, 60, 60 + 30 * a[1] * 4])
      color.push(1)
      positions.push(a, c, b)
      positions.push(a, d, c)
      colors.push(color, color, color)
      colors.push(color, color, color)
    }
  }
  return {
    positions: positions,
    colors: colors,
    count: positions.length
  }
}

function createGeometryFromTypedArrays () {
  random.seed(0)
  const positions = new Float32Array(N * N * 6 * 3)
  const colors = new Float32Array(N * N * 6 * 4)
  let i = 0

  for (let x = 0; x < N; x++) {
    for (let z = 0; z < N; z++) {
      const a = [x / N - 0.5, 0, z / N - 0.5]
      const b = [(x + 1) / N - 0.5, 0, z / N - 0.5]
      const c = [(x + 1) / N - 0.5, 0, (z + 1) / N - 0.5]
      const d = [(x) / N - 0.5, 0, (z + 1) / N - 0.5]
      const verts = [a, b, c, d]
      verts.forEach((p) => {
        p[1] = noiseFunc(p[0], p[1], p[2])
      })
      const color = hsluv.hsluvToRgb([300 + 80 * a[1] * 4, 60, 60 + 30 * a[1] * 4])
      color.push(1)
      ;[a, c, b, a, d, c].forEach((p) => {
        positions[i * 3 + 0] = p[0]
        positions[i * 3 + 1] = p[1]
        positions[i * 3 + 2] = p[2]
        colors[i * 4 + 0] = color[0]
        colors[i * 4 + 1] = color[1]
        colors[i * 4 + 2] = color[2]
        colors[i * 4 + 3] = color[3]
        i++
      })
    }
  }
  return {
    positions: positions,
    colors: colors,
    count: N * N * 6
  }
}

function createGeometryFromTypedArraysNoGC () {
  random.seed(0)
  const positions = new Float32Array(N * N * 6 * 3)
  const colors = new Float32Array(N * N * 6 * 4)
  let i = 0

  for (let x = 0; x < N; x++) {
    for (let z = 0; z < N; z++) {
      const ax = x / N - 0.5
      const az = z / N - 0.5
      const ay = noiseFunc(ax, 0, az)
      const bx = (x + 1) / N - 0.5
      const bz = z / N - 0.5
      const by = noiseFunc(bx, 0, bz)
      const cx = (x + 1) / N - 0.5
      const cz = (z + 1) / N - 0.5
      const cy = noiseFunc(cx, 0, cz)
      const dx = x / N - 0.5
      const dz = (z + 1) / N - 0.5
      const dy = noiseFunc(dx, 0, dz)
      const color = hsluv.hsluvToRgb([100 + 80 * (1 - ay * 4), 60, 60 + 30 * ay * 4])
      color.push(1)
      positions[i * 3 + 0] = ax
      positions[i * 3 + 1] = ay
      positions[i * 3 + 2] = az
      colors[i * 4 + 0] = color[0]
      colors[i * 4 + 1] = color[1]
      colors[i * 4 + 2] = color[2]
      colors[i * 4 + 3] = color[3]
      i++
      positions[i * 3 + 0] = cx
      positions[i * 3 + 1] = cy
      positions[i * 3 + 2] = cz
      colors[i * 4 + 0] = color[0]
      colors[i * 4 + 1] = color[1]
      colors[i * 4 + 2] = color[2]
      colors[i * 4 + 3] = color[3]
      i++
      positions[i * 3 + 0] = bx
      positions[i * 3 + 1] = by
      positions[i * 3 + 2] = bz
      colors[i * 4 + 0] = color[0]
      colors[i * 4 + 1] = color[1]
      colors[i * 4 + 2] = color[2]
      colors[i * 4 + 3] = color[3]
      i++
      positions[i * 3 + 0] = ax
      positions[i * 3 + 1] = ay
      positions[i * 3 + 2] = az
      colors[i * 4 + 0] = color[0]
      colors[i * 4 + 1] = color[1]
      colors[i * 4 + 2] = color[2]
      colors[i * 4 + 3] = color[3]
      i++
      positions[i * 3 + 0] = dx
      positions[i * 3 + 1] = dy
      positions[i * 3 + 2] = dz
      colors[i * 4 + 0] = color[0]
      colors[i * 4 + 1] = color[1]
      colors[i * 4 + 2] = color[2]
      colors[i * 4 + 3] = color[3]
      i++
      positions[i * 3 + 0] = cx
      positions[i * 3 + 1] = cy
      positions[i * 3 + 2] = cz
      colors[i * 4 + 0] = color[0]
      colors[i * 4 + 1] = color[1]
      colors[i * 4 + 2] = color[2]
      colors[i * 4 + 3] = color[3]
      i++
    }
  }
  return {
    positions: positions,
    colors: colors,
    count: N * N * 6
  }
}

function createGeometryFromGeomBuilder (builder) {
  random.seed(0)
  builder = builder || createGeomBuilder({ colors: true })
  for (let x = 0; x < N; x++) {
    for (let z = 0; z < N; z++) {
      const a = [x / N - 0.5, 0, z / N - 0.5]
      const b = [(x + 1) / N - 0.5, 0, z / N - 0.5]
      const c = [(x + 1) / N - 0.5, 0, (z + 1) / N - 0.5]
      const d = [(x) / N - 0.5, 0, (z + 1) / N - 0.5]
      const verts = [a, b, c, d]
      verts.forEach((p) => {
        p[1] = noiseFunc(p[0], p[1], p[2])
      })
      const color = hsluv.hsluvToRgb([180 + 80 * (a[1] * 4), 60, 60 + 30 * (1 - a[1] * 4)])
      color.push(1)

      builder.addPosition(a)
      builder.addPosition(c)
      builder.addPosition(b)
      builder.addPosition(a)
      builder.addPosition(d)
      builder.addPosition(c)

      builder.addColor(color)
      builder.addColor(color)
      builder.addColor(color)
      builder.addColor(color)
      builder.addColor(color)
      builder.addColor(color)
    }
  }
  return builder
}

function createGeometryFromGeomBuilderWithCells (builder, solidColor, yOffset) {
  random.seed(0)
  builder = builder || createGeomBuilder({ colors: true, cells: true })
  var index = 0
  for (let x = 0; x < N; x++) {
    for (let z = 0; z < N; z++) {
      const a = [x / N - 0.5, 0, z / N - 0.5]
      const b = [(x + 1) / N - 0.5, 0, z / N - 0.5]
      const c = [(x + 1) / N - 0.5, 0, (z + 1) / N - 0.5]
      const d = [(x) / N - 0.5, 0, (z + 1) / N - 0.5]
      const verts = [a, b, c, d]
      verts.forEach((p) => {
        p[1] = noiseFunc(p[0], p[1], p[2]) + (yOffset || 0)
      })
      const color = solidColor || hsluv.hsluvToRgb([80 + 80 * (a[1] * 4), 60, 60 + 30 * (1 - a[1] * 4)])
      if (!solidColor) color.push(1)

      builder.addPosition(a)
      builder.addColor(color)
      if (x < N - 1 && z < N - 1) {
        builder.addCell([index, index + 1, index + 1 + N])
        builder.addCell(index, index + 1 + N, index + N)
      }
      index++
    }
  }
  return builder
}

function createGeometryFromGeomBuilderWithCellsAsLines (builder) {
  random.seed(0)
  builder = builder || createGeomBuilder({ colors: true, cells: true })
  var index = 0
  for (let x = 0; x < N; x++) {
    for (let z = 0; z < N; z++) {
      const a = [x / N - 0.5, 0, z / N - 0.5]
      const b = [(x + 1) / N - 0.5, 0, z / N - 0.5]
      const c = [(x + 1) / N - 0.5, 0, (z + 1) / N - 0.5]
      const d = [(x) / N - 0.5, 0, (z + 1) / N - 0.5]
      const verts = [a, b, c, d]
      verts.forEach((p) => {
        p[1] = noiseFunc(p[0], p[1], p[2])
      })
      const color = hsluv.hsluvToRgb([180 + 80, 60, 60])
      color.push(1)

      builder.addPosition(a)
      builder.addColor(color)
      if (x < N - 1 && z < N - 1) {
        if (x % 3 === 0) {
          builder.addCell(index, index + 1)
        }
      }
      index++
    }
  }
  return builder
}

function createGeometryFromGeomBuilderWithCellsAsColumns (builder) {
  random.seed(0)
  builder = builder || createGeomBuilder({ colors: true, cells: true })
  var index = 0
  var N2 = N / 4
  for (let x = 0; x < N2; x++) {
    for (let z = 0; z < N2; z++) {
      const a = [x / N2 - 0.5, 0, z / N2 - 0.5]
      a[1] = noiseFunc(a[0], 0, a[2])
      let color = [0, 0, 0, 1]

      builder.addPosition(a)
      builder.addColor(color)
      if (x < N2 - 1 && z < N2 - 1) {
        builder.addCell(index, index + 1)
        builder.addCell(index, index + N2)
      }
      index++
    }
  }
  return builder
}

function createGeometryFromGeomBuilderWithCellsAsPoints (builder) {
  random.seed(0)
  builder = builder || createGeomBuilder({ colors: true, cells: true })
  var index = 0
  for (let x = 0; x < N; x++) {
    for (let z = 0; z < N; z++) {
      const a = [x / N - 0.5, 0, z / N - 0.5]
      const b = [(x + 1) / N - 0.5, 0, z / N - 0.5]
      const c = [(x + 1) / N - 0.5, 0, (z + 1) / N - 0.5]
      const d = [(x) / N - 0.5, 0, (z + 1) / N - 0.5]
      const verts = [a, b, c, d]
      verts.forEach((p) => {
        p[1] = noiseFunc(p[0], p[1], p[2])
      })
      const color = hsluv.hsluvToRgb([180 + 80, 60, 60])
      color.push(1)

      builder.addPosition(a)
      builder.addColor(color)
      if (x < N - 1 && z < N - 1) {
        if (x % 4 === 0 && z % 4 === 0) {
          builder.addCell(index)
        }
      }
      index++
    }
  }
  return builder
}

const drawCmd = {
  pipeline: ctx.pipeline({
    vert: `
    attribute vec3 aPosition;
    attribute vec4 aColor;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    varying vec4 vColor;
    void main () {
      vColor = aColor;
      gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
    }
    `,
    frag: `
    #ifdef GL_ES
    precision highp float;
    #endif
    varying vec4 vColor;
    void main () {
      gl_FragColor = vColor;
    }
    `,
    depthTest: true,
    cullFace: true
  }),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix
  }
}

const drawLinesCmd = {
  pipeline: ctx.pipeline({
    vert: `
    attribute vec3 aPosition;
    attribute vec4 aColor;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    varying vec4 vColor;
    void main () {
      vColor = aColor;
      gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
    }
    `,
    frag: `
    #ifdef GL_ES
    precision highp float;
    #endif
    varying vec4 vColor;
    void main () {
      gl_FragColor = vColor;
    }
    `,
    depthTest: true,
    cullFace: true,
    primitive: ctx.Primitive.Lines
  }),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix
  }
}

const drawPointsCmd = {
  pipeline: ctx.pipeline({
    vert: `
    attribute vec3 aPosition;
    attribute vec4 aColor;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    varying vec4 vColor;
    void main () {
      vColor = aColor;
      gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
      gl_PointSize = 2.0;
    }
    `,
    frag: `
    #ifdef GL_ES
    precision highp float;
    #endif
    varying vec4 vColor;
    void main () {
      gl_FragColor = vColor;
    }
    `,
    depthTest: true,
    cullFace: true,
    primitive: ctx.Primitive.Points
  }),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix
  }
}

// arrays of arrays
console.time('geometry from arrays - build')
const g1 = createGeometryFromArrays()
console.timeEnd('geometry from arrays - build')
console.time('geometry from arrays - upload')
const landscape1 = {
  attributes: {
    aPosition: ctx.vertexBuffer(g1.positions),
    aColor: ctx.vertexBuffer(g1.colors)
  },
  count: g1.count
}
console.timeEnd('geometry from arrays - upload')

console.time('geometry from typed arrays - build')
const g2 = createGeometryFromTypedArrays()
console.timeEnd('geometry from typed arrays - build')
console.time('geometry from typed arrays - upload')
const landscape2 = {
  attributes: {
    aPosition: ctx.vertexBuffer(g2.positions),
    aColor: ctx.vertexBuffer(g2.colors)
  },
  count: g2.count
}
console.timeEnd('geometry from typed arrays - upload')

console.time('geometry from typed arrays no GC - build')
const g3 = createGeometryFromTypedArraysNoGC()
console.timeEnd('geometry from typed arrays no GC - build')
console.time('geometry from typed arrays no GC - upload')
const landscape3 = {
  attributes: {
    aPosition: ctx.vertexBuffer(g3.positions),
    aColor: ctx.vertexBuffer(g3.colors)
  },
  count: g3.count
}
console.timeEnd('geometry from typed arrays no GC - upload')

console.time('geometry from geom builder - build cold')
let g4 = createGeometryFromGeomBuilder()
console.timeEnd('geometry from geom builder - build cold')
console.time('geometry from geom builder - build hot')
g4.reset()
g4 = createGeometryFromGeomBuilder(g4)
console.timeEnd('geometry from geom builder - build hot')
console.time('geometry from geom builder - upload cold')
const landscape4 = {
  attributes: {
    aPosition: ctx.vertexBuffer(g4.positions),
    aColor: ctx.vertexBuffer(g4.colors)
  },
  count: g4.count
}
console.timeEnd('geometry from geom builder - upload cold')
console.time('geometry from geom builder - upload hot')
ctx.update(landscape4.attributes.aPosition, { data: g4.positions })
ctx.update(landscape4.attributes.aColor, { data: g4.colors })
console.timeEnd('geometry from geom builder - upload hot')

console.time('geometry from geom builder with indices - build cold')
let g5 = createGeometryFromGeomBuilderWithCells()
console.timeEnd('geometry from geom builder with indices - build cold')
console.time('geometry from geom builder with indices - build hot')
g5.reset()
g5 = createGeometryFromGeomBuilderWithCells(g5)
console.timeEnd('geometry from geom builder with indices - build hot')
console.time('geometry from geom builder with indices - upload cold')
const landscape5 = {
  attributes: {
    aPosition: ctx.vertexBuffer(g5.positions),
    aColor: ctx.vertexBuffer(g5.colors)
  },
  indices: ctx.indexBuffer(g5.cells)
}
console.timeEnd('geometry from geom builder with indices - upload cold')
console.time('geometry from geom builder with indices - upload hot')
ctx.update(landscape5.attributes.aPosition, { data: g5.positions })
ctx.update(landscape5.attributes.aColor, { data: g5.colors })
console.timeEnd('geometry from geom builder with indices - upload hot')

let g6bg = createGeometryFromGeomBuilderWithCells(null, [1, 1, 1, 1], -0.01)
const landscape6bg = {
  attributes: {
    aPosition: ctx.vertexBuffer(g6bg.positions),
    aColor: ctx.vertexBuffer(g6bg.colors)
  },
  indices: ctx.indexBuffer(g6bg.cells)
}

let g6 = createGeometryFromGeomBuilderWithCellsAsLines()
const landscape6 = {
  attributes: {
    aPosition: ctx.vertexBuffer(g6.positions),
    aColor: ctx.vertexBuffer(g6.colors)
  },
  indices: ctx.indexBuffer(g6.cells)
}

let g6p = createGeometryFromGeomBuilderWithCellsAsPoints()
const landscape6p = {
  attributes: {
    aPosition: ctx.vertexBuffer(g6p.positions),
    aColor: ctx.vertexBuffer(g6p.colors)
  },
  indices: ctx.indexBuffer(g6p.cells)
}

let g7 = createGeometryFromGeomBuilderWithCellsAsColumns()
const landscape7 = {
  attributes: {
    aPosition: ctx.vertexBuffer(g7.positions),
    aColor: ctx.vertexBuffer(g7.colors)
  },
  indices: ctx.indexBuffer(g7.cells)
}

const width = ctx.gl.drawingBufferWidth
const height = ctx.gl.drawingBufferHeight

let frame = 0
let query4 = ctx.query()
let query5 = ctx.query()
ctx.frame(() => {
  ctx.submit(clearCmd)

  ctx.submit(drawCmd, {
    viewport: [0, height / 2, width / 4, height / 2],
    attributes: landscape1.attributes,
    count: landscape1.count
  })

  ctx.submit(drawCmd, {
    viewport: [width / 4, height / 2, width / 4, height / 2],
    attributes: landscape2.attributes,
    count: landscape2.count
  })

  ctx.submit(drawCmd, {
    viewport: [0, 0, width / 4, height / 2],
    attributes: landscape3.attributes,
    count: landscape3.count
  })

  if (frame === 0) ctx.beginQuery(query4)
  ctx.submit(drawCmd, {
    viewport: [width / 4, 0, width / 4, height / 2],
    attributes: landscape4.attributes,
    count: landscape4.count
  })
  if (frame === 0) ctx.endQuery(query4)
  if (frame === 3) console.log('geometry from geom builder render time', query4.result / 1000000)

  if (frame === 0) ctx.beginQuery(query5)
  ctx.submit(drawCmd, {
    viewport: [width * 2 / 4, height / 2, width / 4, height / 2],
    attributes: landscape5.attributes,
    indices: landscape5.indices
  })
  if (frame === 0) ctx.endQuery(query5)
  if (frame === 3) console.log('geometry from geom builder with indices render time', query5.result / 1000000)

  ctx.submit(drawCmd, {
    viewport: [width * 2 / 4, 0, width / 4, height / 2],
    attributes: landscape6bg.attributes,
    indices: landscape6bg.indices
  })
  ctx.submit(drawLinesCmd, {
    viewport: [width * 2 / 4, 0, width / 4, height / 2],
    attributes: landscape6.attributes,
    indices: landscape6.indices
  })
  ctx.submit(drawCmd, {
    viewport: [width * 3 / 4, 0, width / 4, height / 2],
    attributes: landscape6bg.attributes,
    indices: landscape6bg.indices
  })
  ctx.submit(drawPointsCmd, {
    viewport: [width * 3 / 4, 0, width / 4, height / 2],
    attributes: landscape6p.attributes,
    indices: landscape6p.indices
  })

  ctx.submit(drawCmd, {
    viewport: [width * 3 / 4, height / 2, width / 4, height / 2],
    attributes: landscape6bg.attributes,
    indices: landscape6bg.indices
  })
  ctx.submit(drawLinesCmd, {
    viewport: [width * 3 / 4, height / 2, width / 4, height / 2],
    attributes: landscape7.attributes,
    indices: landscape7.indices
  })
  frame++
})
