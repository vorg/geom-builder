// TODO
// add positions documentation
// change index to offset so it's always up to date?
// allow int instead of bool

function GeomBuilder (opts) {
  opts = opts || {}
  this.count = 0

  var size = opts.size || 32
  this.positions = new Float32Array(size * (opts.positions || 3))
  this.positionsIndex = 0

  if (opts.colors) {
    this.colors = new Float32Array(size * opts.colors)
    this.colorsIndex = 0
  }
  if (opts.normals) {
    this.normals = new Float32Array(size * opts.normals)
    this.normalsIndex = 0
  }
  if (opts.uvs) {
    this.uvs = new Float32Array(size * opts.uvs)
    this.uvsIndex = 0
  }
  if (opts.cells) {
    this.cells = new Uint16Array(size * opts.cells)
    this.indexCount = 0
  }
}

GeomBuilder.prototype.addPosition = function (pos) {
  var values = arguments[0].length ? pos : arguments
  if (this.positionsIndex + values.length >= this.positions.length) {
    this.positions = this._expandFloatArray(this.positions)
  }
  for (var i = 0; i < values.length; i++) {
    this.positions[this.positionsIndex++] = values[i]
  }
  this.count++
}

GeomBuilder.prototype.addColor = function (color) {
  var values = arguments[0].length ? color : arguments
  if (this.colorsIndex + values.length >= this.colors.length) {
    this.colors = this._expandFloatArray(this.colors)
  }
  for (var i = 0; i < values.length; i++) {
    this.colors[this.colorsIndex++] = values[i]
  }
}

GeomBuilder.prototype.addNormal = function (normal) {
  var values = arguments[0].length ? normal : arguments
  if (this.normalsIndex + values.length >= this.normals.length) {
    this.normals = this._expandFloatArray(this.normals)
  }
  for (var i = 0; i < values.length; i++) {
    this.normals[this.normalsIndex++] = values[i]
  }
}

GeomBuilder.prototype.addUV = function (uv) {
  var values = arguments[0].length ? uv : arguments
  if (this.uvsIndex + values.length >= this.uvs.length) {
    this.uvs = this._expandFloatArray(this.uvs)
  }
  for (var i = 0; i < values.length; i++) {
    this.uvs[this.uvsIndex++] = values[i]
  }
}

GeomBuilder.prototype.addCell = function (indices) {
  var values = arguments[0].length ? indices : arguments

  if (this.indexCount + values.length >= this.cells.length) {
    this.cells = this._expandUintArray(this.cells)
  }
  for (var i = 0; i < values.length; i++) {
    this.cells[this.indexCount++] = values[i]
  }
}

GeomBuilder.prototype.reset = function () {
  this.positionsIndex = 0
  if (this.normals) this.normalsIndex = 0
  if (this.uvs) this.uvsIndex = 0
  if (this.colors) this.colorsIndex = 0
  if (this.cells) this.indexCount = 0
  this.count = 0
}

GeomBuilder.prototype._expandFloatArray = function (a) {
  console.log(`Expanding ${a.length} to ${a.length * 2}`)
  const biggerArray = new Float32Array(a.length * 2)
  biggerArray.set(a)
  return biggerArray
}

GeomBuilder.prototype._expandUintArray = function (a) {
  const biggerArray = new Uint16Array(a.length * 2)
  biggerArray.set(a)
  return biggerArray
}

module.exports = function createGeomBuilder (opts) {
  return new GeomBuilder(opts)
}
