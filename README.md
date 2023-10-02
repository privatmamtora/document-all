# Purpose

Find all elements in the DOM.
- Includes ShadowDom support
- Includes Iframe/Frame support

## Getting Started

```js
npm install document-all
```

## API

### `findAllNodes`

```js
import { findAllNodes } from 'document-all'

// Max number of shadow roots to go down. Default is Infinity.
let options = {}
options.maxDepth = 3;

// Container can be any Node
const container = document

findAllNodes(document, options)
```

### `findAllElements`

```js
import { findAllElements } from 'document-all'

// Max number of shadow roots to go down. Default is Infinity.
let options = {}
options.maxDepth = 3;

// Container can be any Element, DocumentFragment, or ShadowRoot
const container = document

findAllElements(document, options)
```

## Element / Node Order

Elements and Nodes are returned in the order they're discovered via a "depth-first" search.

Example:

```html
<div>
    <my-custom-element>
      #shadowRoot
      <slot></slot>
    </my-custom-element>

    <my-other-custom-element>
      #shadowRoot
      <slot></slot>
    </my-other-custom-element>
</div>
```

Would produce an array like this:

```js
[
  "div",

  // my-custom-element
  "my-custom-element",
  "ShadowRoot",
  "slot"

  // my-other-custom-element
  "my-other-custom-element",
  "ShadowRoot",
  "slot"
]
```
