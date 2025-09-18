# geom-builder

Simplicial-complex-like geometry builder backed by typed arrays.

![](screenshot.png)

## Installation

```bash
npm install geom-builder
```

## Usage

```js
import createGeomBuilder from "geom-builder";
const builder = createGeomBuilder({ vertexColors: 4, cells: 3 });

builder.addPosition([0, 0, 0]);
builder.addPosition([1, 0, 0]);
builder.addPosition([1, 1, 0]);

builder.addVertexColor([1, 0, 0, 1]);
builder.addVertexColor([0, 1, 0, 1]);
builder.addVertexColor([0, 0, 1, 1]);

builder.addCell([0, 1, 0]);
// or builder.addCell(0, 1, 0)

//builder.count = 3 //vertex count
//builder.indexCount = 3 //indices count
//builder.positions = Float32Array(0, 0, 0, 1, 0, 0, 1, 1, 0, ..,)
//builder.colors = Float32Array(1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, ...)
//builder.cells = Uint16Array(0, 1, 2, ...)
```

## API

### `createGeomBuilder(opts): geometryBuilder`

**Parameters**

- opts
  - size: `Int` (default: `32`) - preallocated vertex buffer size
  - positions: `Int` (default: `3`) - positions attribute
  - normals: `Int` - enable normals attribute
  - uvs: `Int` - enable uvs attribute
  - vertexColors: `Int` - enable vertexColors attribute
  - cells: `Int` - enable cells (indices)
  - attributeNames: `Int` - enable an arbitrary attribute

_Note: `positions` attribute is always enabled and defaults to size 3_
_Note: attribute names should be plural_

**Returns**

geometryBuilder: `{ positions: Float32Array, vertexColors: Float32Array, cells: Uint32Array }`: each attribute can be enabled by passing an integer e.g.: `createGeomBuilder({ positions: 3, vertexColors: 4, cells: 2 })`.

## Adding vertex and index data

Every time we add vertex position, color, etc., the internal buffer size is checked and expanded by doubling its capacity as necessary. Therefore `builder.count` should be used to determine how many vertices to draw instead of `builder.positions.length` as not all allocated vertices have to be used. Similarly for meshes with cells `builder.cellsIndex` should be used instead of `builder.cells.length`.

All enabled attributes can be accessed by `builder.attributeName` e.g. `builder.vertexColors`.

All data methods accept structs or individual components e.g. `builder.addPosition(v)` or `builder.addPosition(v[0], v[1], v[2])`.

### builder.reset()

Reset all the counters to prepare arrays for reuse. Nothing is deallocated.

### builder.addPosition(pos)

- pos: `vec3` - position to add

_Note: adding a vertex position will increment `builder.count` counter indicating number of vertices added so far_

### builder.addNormal(normal)

- normal: `vec3` - normal to add

_Note: you need to enable normals in constructor_

### builder.addUV(uv)

- uv: `vec2` - uv texture coord to add

_Note: you need to enable uvs in constructor_

### builder.addVertexColor(color)

- vertexColor: `vec4` - vertexColor to add

_Note: you need to enable vertexColors in constructor_

### builder.addCell(cell)

- cell: `number | vec2 | vec3` - cell (face) with vertex indices to add

_Note: you need to enable cells in constructor_

### builder.addAttributeName(attributeValue)

- attributeValue: `number | array` - any attribute to add

_Note: you need to enable attributeNames (plural) in constructor to get builder.addAttributeName (singular)_

## License

MIT, see [LICENSE.md](http://github.com/vorg/geom-builder/blob/master/LICENSE.md) for details.
