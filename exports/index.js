// @ts-check

/**
 * @typedef {Element | DocumentFragment | ShadowRoot | Node} NodesContainer
 * @typedef {Document | DocumentFragment | ShadowRoot | Element} ElementsContainer
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
 * @param {number} shadowRootDepth
 * @return {T}
 */
function walk (container, options, shadowRootDepth = 0) {
  /**
   * @type {Array<Node>}
   */
  let nodes = []

  // If filter is provided, check if this container should be explored
  if (options.filter) {
    if (!options.filter(container)) {
      return /** @type {T} */ (nodes);
    }
  }

  nodes.push(container)

  // @ts-expect-error
  const children = Array.from(container[options.propertyKey])

  if ("shadowRoot" in container && container.shadowRoot) {
    if (shadowRootDepth < options.maxDepth) {
      shadowRootDepth++

      nodes = nodes.concat(walk(container.shadowRoot, options, shadowRootDepth))
    }
  }

  children.forEach((node) => {
    nodes = nodes.concat(walk(node, options, shadowRootDepth))
  })


  return /** @type {T} */ (nodes);
}
