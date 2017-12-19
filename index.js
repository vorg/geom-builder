function GeomBuilder (opts) {
  this.size = opts.size || 32
  this.count = 0

  this.positions = new Float32Array(this.size * 3)
  this.positionsIndex = 0

  if (opts.normals) {
    this.normals = new Float32Array(this.size * 3)
    this.normalsIndex = 0
  }
  if (opts.uvs) {
    this.uvs = new Float32Array(this.size * 2)
    this.uvsIndex = 0
  }
  if (opts.colors) {
    this.colors = new Float32Array(this.size * 4)
    this.colorsIndex = 0
  }
  if (opts.cells) {
    this.cells = new Uint16Array(this.size * 3) // just an estimate
    this.indexCount = 0
  }
}

GeomBuilder.prototype.addPosition = function (p) {
  if (this.positionsIndex * 3 + 3 >= this.positions.length) {
    this.positions = this._expandFloatArray(this.positions)
  }
  var i = this.positionsIndex * 3
  this.positions[i + 0] = p[0]
  this.positions[i + 1] = p[1]
  this.positions[i + 2] = p[2]
  this.positionsIndex++
  this.count++
}

GeomBuilder.prototype.addNormal = function (n) {
  if (this.normalsIndex * 3 + 3 >= this.normals.length) {
    this.normals = this._expandFloatArray(this.normals)
  }
  var i = this.normalsIndex * 3
  this.normals[i + 0] = n[0]
  this.normals[i + 1] = n[1]
  this.normals[i + 2] = n[2]
  this.normalsIndex++
}

GeomBuilder.prototype.addUV = function (uv) {
  if (this.uvsIndex * 2 + 2 >= this.uvs.length) {
    this.uvs = this._expandFloatArray(this.uvs)
  }
  var i = this.uvsIndex * 2
  this.uvs[i + 0] = uv[0]
  this.uvs[i + 1] = uv[1]
  this.uvsIndex++
}

GeomBuilder.prototype.addColor = function (c) {
  if (this.colorsIndex * 4 + 4 >= this.colors.length) {
    this.colors = this._expandFloatArray(this.colors)
  }
  var i = this.colorsIndex * 4
  this.colors[i + 0] = c[0]
  this.colors[i + 1] = c[1]
  this.colors[i + 2] = c[2]
  this.colors[i + 3] = c[3]
  this.colorsIndex++
}

GeomBuilder.prototype.addCell = function (...indices) {
  if (indices[0].length) indices = indices[0] // allow array-like cell

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
