// @ts-check

/**
 * @typedef {Element | DocumentFragment | ShadowRoot | Node | HTMLSlotElement} NodesContainer
 * @typedef {Document | DocumentFragment | ShadowRoot | Element | HTMLIFrameElement | HTMLSlotElement } ElementsContainer
 */

/**
 * @typedef {Object} options
 * @property {number} maxDepth=Infinity
 * @property {string} [propertyKey="children"]
 * @property {function(ElementsContainer | NodesContainer): boolean}  [filter]
 */

function getDefaultOptions() {
  return {
    maxDepth: Infinity, 
    propertyKey: 'children'
  }
}

/**
 * @param {NodesContainer} container
 * @param {options} options
 * @return {Node[]}
 */
export function findAllNodes (container, options) {
  let defaultOptions = getDefaultOptions();
  defaultOptions.propertyKey = 'childNodes';
  return walk(container, Object.assign({}, defaultOptions, options));
}

/**
 * @param {ElementsContainer} container
 * @param {options} options
 * @return {Array<ElementsContainer>}
 */
export function findAllElements (container, options) {
  let defaultOptions = getDefaultOptions();
  return walk(container, Object.assign({}, defaultOptions, options));
}

// Private


/**
 * @template [T=Array<Node>]
 * @param {ElementsContainer | NodesContainer} container
 * @param {options} options
 * @param {number} depth
 * @return {T}
 */
function walk (container, options, depth = 0) {
  /**
   * @type {Array<Node>}
   */
  let nodes = []

  nodes.push(container);

  // If filter is provided, check if this container should be explored
  if (options.filter) {
    if (!options.filter(container)) {
      return /** @type {T} */ (nodes);
    }
  }

  // @ts-expect-error
  const children = Array.from(container[options.propertyKey])

  if ("shadowRoot" in container && container.shadowRoot) {
    if (depth < options.maxDepth) {
      depth++

      nodes = nodes.concat(walk(container.shadowRoot, options, depth))
    }
  }

  if ("contentDocument" in container && container.contentDocument) {
    if (depth < options.maxDepth) {
      depth++;

      nodes = nodes.concat(walk(container.contentDocument.documentElement, options, depth));
    }
  }

  if (options.propertyKey === 'childNodes' && "assignedNodes" in container && container.assignedNodes().length) {
    depth++;
    let slotNodes = [...container.assignedNodes()];
    for (const n of slotNodes) {
      nodes = nodes.concat(walk(n, options, depth));
    }    
  }
  
  if (options.propertyKey === 'children' && "assignedElements" in container && container.assignedElements().length) {
    depth++;
    let slotElems = [...container.assignedElements()];
    for (const e of slotElems) {
      nodes = nodes.concat(walk(e, options, depth));
    }
  }

  children.forEach((node) => {
    nodes = nodes.concat(walk(node, options, depth))
  })


  return /** @type {T} */ (nodes);
}
