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

GeomBuilder.prototype.addPosition = function (position) {
  if (this.positionsIndex + position.length >= this.positions.length) {
    this.positions = this._expandFloatArray(this.positions)
  }
  for (var i = 0; i < position.length; i++) {
    this.positions[this.positionsIndex++] = position[i]
  }
  this.count++
}

GeomBuilder.prototype.addColor = function (color) {
  if (this.colorsIndex + color.length >= this.colors.length) {
    this.colors = this._expandFloatArray(this.colors)
  }
  for (var i = 0; i < color.length; i++) {
    this.colors[this.colorsIndex++] = color[i]
  }
}

GeomBuilder.prototype.addNormal = function (normal) {
  if (this.normalsIndex + normal.length >= this.normals.length) {
    this.normals = this._expandFloatArray(this.normals)
  }
  for (var i = 0; i < normal.length; i++) {
    this.normals[this.normalsIndex++] = normal[i]
  }
}

GeomBuilder.prototype.addUV = function (uv) {
  if (this.uvsIndex + uv.length >= this.uvs.length) {
    this.uvs = this._expandFloatArray(this.uvs)
  }
  for (var i = 0; i < uv.length; i++) {
    this.uvs[this.uvsIndex++] = uv[i]
  }
}

GeomBuilder.prototype.addCell = function (indices) {
  if (this.indexCount + indices.length >= this.cells.length) {
    this.cells = this._expandUintArray(this.cells)
  }
  for (var i = 0; i < indices.length; i++) {
    this.cells[this.indexCount++] = indices[i]
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
