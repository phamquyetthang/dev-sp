/* eslint-disable @typescript-eslint/no-explicit-any */
import SVGDOMPropertyConfig from "react-dom-core/lib/SVGDOMPropertyConfig";
import HTMLDOMPropertyConfig from "react-dom-core/lib/HTMLDOMPropertyConfig";

const NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
  COMMENT: 8,
};

const ATTRIBUTE_MAPPING = {
  for: "htmlFor",
  class: "className",
};

const ELEMENT_ATTRIBUTE_MAPPING = {
  input: {
    checked: "defaultChecked",
    value: "defaultValue",
    autofocus: "autoFocus",
  },
};

// Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Element#SVG_elements
const ELEMENT_TAG_NAME_MAPPING = {
  a: "a",
  altglyph: "altGlyph",
  altglyphdef: "altGlyphDef",
  altglyphitem: "altGlyphItem",
  animate: "animate",
  animatecolor: "animateColor",
  animatemotion: "animateMotion",
  animatetransform: "animateTransform",
  audio: "audio",
  canvas: "canvas",
  circle: "circle",
  clippath: "clipPath",
  "color-profile": "colorProfile",
  cursor: "cursor",
  defs: "defs",
  desc: "desc",
  discard: "discard",
  ellipse: "ellipse",
  feblend: "feBlend",
  fecolormatrix: "feColorMatrix",
  fecomponenttransfer: "feComponentTransfer",
  fecomposite: "feComposite",
  feconvolvematrix: "feConvolveMatrix",
  fediffuselighting: "feDiffuseLighting",
  fedisplacementmap: "feDisplacementMap",
  fedistantlight: "feDistantLight",
  fedropshadow: "feDropShadow",
  feflood: "feFlood",
  fefunca: "feFuncA",
  fefuncb: "feFuncB",
  fefuncg: "feFuncG",
  fefuncr: "feFuncR",
  fegaussianblur: "feGaussianBlur",
  feimage: "feImage",
  femerge: "feMerge",
  femergenode: "feMergeNode",
  femorphology: "feMorphology",
  feoffset: "feOffset",
  fepointlight: "fePointLight",
  fespecularlighting: "feSpecularLighting",
  fespotlight: "feSpotLight",
  fetile: "feTile",
  feturbulence: "feTurbulence",
  filter: "filter",
  font: "font",
  "font-face": "fontFace",
  "font-face-format": "fontFaceFormat",
  "font-face-name": "fontFaceName",
  "font-face-src": "fontFaceSrc",
  "font-face-uri": "fontFaceUri",
  foreignobject: "foreignObject",
  g: "g",
  glyph: "glyph",
  glyphref: "glyphRef",
  hatch: "hatch",
  hatchpath: "hatchpath",
  hkern: "hkern",
  iframe: "iframe",
  image: "image",
  line: "line",
  lineargradient: "linearGradient",
  marker: "marker",
  mask: "mask",
  mesh: "mesh",
  meshgradient: "meshgradient",
  meshpatch: "meshpatch",
  meshrow: "meshrow",
  metadata: "metadata",
  "missing-glyph": "missingGlyph",
  mpath: "mpath",
  path: "path",
  pattern: "pattern",
  polygon: "polygon",
  polyline: "polyline",
  radialgradient: "radialGradient",
  rect: "rect",
  script: "script",
  set: "set",
  solidcolor: "solidcolor",
  stop: "stop",
  style: "style",
  svg: "svg",
  switch: "switch",
  symbol: "symbol",
  text: "text",
  textpath: "textPath",
  title: "title",
  tref: "tref",
  tspan: "tspan",
  unknown: "unknown",
  use: "use",
  video: "video",
  view: "view",
  vkern: "vkern",
};

/**
 * Iterates over elements of object invokes iteratee for each element
 *
 * @param {object}   obj        Collection object
 * @param {function} iteratee   Callback function called in iterative processing
 * @param {any}      context    This arg (aka Context)
 */
function eachObj(obj: any, iteratee: any, context?: unknown) {
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      iteratee.call(context || obj, key, obj[key]);
    }
  });
}

// Populate property map with ReactJS's attribute and property mappings
// TODO handle/use .Properties value eg: MUST_USE_PROPERTY is not HTML attr
function mappingAttributesFromReactConfig(config: any) {
  eachObj(config.Properties, function (propname: string) {
    const mapFrom =
      config.DOMAttributeNames[propname] || propname.toLowerCase();

    if (!ATTRIBUTE_MAPPING[mapFrom as keyof typeof ATTRIBUTE_MAPPING])
      ATTRIBUTE_MAPPING[mapFrom as keyof typeof ATTRIBUTE_MAPPING] = propname;
  });
}

mappingAttributesFromReactConfig(HTMLDOMPropertyConfig);
mappingAttributesFromReactConfig(SVGDOMPropertyConfig);

/**
 * Convert tag name to tag name suitable for JSX.
 *
 * @param  {string} tagName  String of tag name
 * @return {string}
 */
function jsxTagName(tagName: string) {
  let name = tagName.toLowerCase();

  if (Object.prototype.hasOwnProperty.call(ELEMENT_TAG_NAME_MAPPING, name)) {
    name =
      ELEMENT_TAG_NAME_MAPPING[name as keyof typeof ELEMENT_TAG_NAME_MAPPING];
  }

  return name;
}

/**
 * Repeats a string a certain number of times.
 * Also: the future is bright and consists of native string repetition:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
 *
 * @param {string} string  String to repeat
 * @param {number} times   Number of times to repeat string. Integer.
 * @see http://jsperf.com/string-repeater/2
 */
function repeatString(string: string, times: number) {
  if (times === 1) {
    return string;
  }
  if (times < 0) {
    throw new Error();
  }
  let repeated = "";
  while (times) {
    if (times & 1) {
      repeated += string;
    }
    if ((times >>= 1)) {
      string += string;
    }
  }
  return repeated;
}

/**
 * Determine if the string ends with the specified substring.
 *
 * @param {string} haystack String to search in
 * @param {string} needle   String to search for
 * @return {boolean}
 */
function endsWith(haystack: string, needle: string) {
  return haystack.slice(-needle.length) === needle;
}

/**
 * Trim the specified substring off the string. If the string does not end
 * with the specified substring, this is a no-op.
 *
 * @param {string} haystack String to search in
 * @param {string} needle   String to search for
 * @return {string}
 */
function trimEnd(haystack: string, needle: string) {
  return endsWith(haystack, needle)
    ? haystack.slice(0, -needle.length)
    : haystack;
}

/**
 * Convert a hyphenated string to camelCase.
 */
function hyphenToCamelCase(string: string) {
  return string.replace(/-(.)/g, function (_, chr) {
    return chr.toUpperCase();
  });
}

/**
 * Determines if the specified string consists entirely of whitespace.
 */
function isEmpty(string: string) {
  return !/[^\s]/.test(string);
}

/**
 * Determines if the specified string consists entirely of numeric characters.
 */
function isNumeric(input: any) {
  return (
    input !== undefined &&
    input !== null &&
    (typeof input === "number" || parseInt(input, 10) == input)
  );
}

// let createElement
// if (typeof IN_BROWSER !== 'undefined' && IN_BROWSER) {
//   // Browser environment, use document.createElement directly.
//   createElement = function (tag) {
//     return document.createElement(tag)
//   }
// } else {
// Node.js-like environment, use jsdom.
// const jsdom = require('jsdom-no-contextify').jsdom
// const window = jsdom().defaultView
const createElement = function (tag: any) {
  return window.document.createElement(tag);
};
// }

const tempEl = createElement("div");
/**
 * Escapes special characters by converting them to their escaped equivalent
 * (eg. "<" to "&lt;"). Only escapes characters that absolutely must be escaped.
 *
 * @param {string} value
 * @return {string}
 */
function escapeSpecialChars(value: string) {
  // Uses this One Weird Trick to escape text - Raw text inserted as textContent
  // will have its escaped version in innerHTML.
  tempEl.textContent = value;
  return tempEl.innerHTML;
}

class HTMLtoJSX {
  config: any;
  output: any;
  level: any;
  _inPreTag: any;

  constructor(config: any) {
    this.config = config || {};

    if (!this.config.indent) {
      this.config.indent = "  ";
    }
  }
  /**
   * Reset the internal state of the converter
   */
  public reset() {
    this.output = "";
    this.level = 0;
    this._inPreTag = false;
  }
  /**
   * Main entry point to the converter. Given the specified HTML, returns a
   * JSX object representing it.
   * @param {string} html HTML to convert
   * @return {string} JSX
   */
  public convert(html: string) {
    this.reset();

    const containerEl = createElement("div");
    containerEl.innerHTML = "\n" + this._cleanInput(html) + "\n";

    if (this._onlyOneTopLevel(containerEl)) {
      // Only one top-level element, the component can return it directly
      // No need to actually visit the container element
      this._traverse(containerEl);
    } else {
      // More than one top-level element, need to wrap the whole thing in a
      // container.
      this.output +=
        this.config.indent + this.config.indent + this.config.indent;
      this.level++;
      this._visit(containerEl);
    }
    this.output = this.output.trim() + "\n";

    this.output = this._removeJSXClassIndention(
      this.output,
      this.config.indent
    );
    return this.output;
  }

  /**
   * Cleans up the specified HTML so it's in a format acceptable for
   * converting.
   *
   * @param {string} html HTML to clean
   * @return {string} Cleaned HTML
   */
  public _cleanInput(html: string) {
    // Remove unnecessary whitespace
    html = html.trim();
    // Ugly method to strip script tags. They can wreak havoc on the DOM nodes
    // so let's not even put them in the DOM.
    html = html.replace(/<script([\s\S]*?)<\/script>/g, "");
    return html;
  }

  /**
   * Determines if there's only one top-level node in the DOM tree. That is,
   * all the HTML is wrapped by a single HTML tag.
   *
   * @param {DOMElement} containerEl Container element
   * @return {boolean}
   */
  _onlyOneTopLevel(containerEl: any) {
    // Only a single child element
    if (
      containerEl.childNodes.length === 1 &&
      containerEl.childNodes[0].nodeType === NODE_TYPE.ELEMENT
    ) {
      return true;
    }
    // Only one element, and all other children are whitespace
    let foundElement = false;
    for (let i = 0, count = containerEl.childNodes.length; i < count; i++) {
      const child = containerEl.childNodes[i];
      if (child.nodeType === NODE_TYPE.ELEMENT) {
        if (foundElement) {
          // Encountered an element after already encountering another one
          // Therefore, more than one element at root level
          return false;
        } else {
          foundElement = true;
        }
      } else if (
        child.nodeType === NODE_TYPE.TEXT &&
        !isEmpty(child.textContent)
      ) {
        // Contains text content
        return false;
      }
    }
    return true;
  }

  /**
   * Gets a newline followed by the correct indentation for the current
   * nesting level
   *
   * @return {string}
   */
  _getIndentedNewline() {
    return "\n" + repeatString(this.config.indent, this.level + 2);
  }

  /**
   * Handles processing the specified node
   *
   * @param {Node} node
   */
  public _visit(node: Node) {
    this._beginVisit(node);
    this._traverse(node);
    this._endVisit(node);
  }

  /**
   * Traverses all the children of the specified node
   *
   * @param {Node} node
   */
  public _traverse(node: Node) {
    this.level++;
    for (let i = 0, count = node.childNodes.length; i < count; i++) {
      this._visit(node.childNodes[i]);
    }
    this.level--;
  }

  /**
   * Handle pre-visit behaviour for the specified node.
   *
   * @param {Node} node
   */
  _beginVisit(node: Node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this._beginVisitElement(node);
        break;

      case NODE_TYPE.TEXT:
        this._visitText(node);
        break;

      case NODE_TYPE.COMMENT:
        this._visitComment(node);
        break;

      default:
        console.warn("Unrecognised node type: " + node.nodeType);
    }
  }

  /**
   * Handles post-visit behaviour for the specified node.
   *
   * @param {Node} node
   */
  _endVisit(node: Node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this._endVisitElement(node);
        break;
      // No ending tags required for these types
      case NODE_TYPE.TEXT:
      case NODE_TYPE.COMMENT:
        break;
    }
  }

  /**
   * Handles pre-visit behaviour for the specified element node
   *
   * @param {DOMElement} node
   */
  _beginVisitElement(node: any) {
    const tagName = jsxTagName(node.tagName);
    const attributes: string[] = [];
    for (let i = 0, count = node.attributes.length; i < count; i++) {
      attributes.push(this._getElementAttribute(node, node.attributes[i]));
    }

    if (tagName === "textarea") {
      // Hax: textareas need their inner text moved to a "defaultValue" attribute.
      attributes.push("defaultValue={" + JSON.stringify(node.value) + "}");
    }
    if (tagName === "style") {
      // Hax: style tag contents need to be dangerously set due to liberal curly brace usage
      attributes.push(
        "dangerouslySetInnerHTML={{__html: " +
          JSON.stringify(node.textContent) +
          " }}"
      );
    }
    if (tagName === "pre") {
      this._inPreTag = true;
    }

    this.output += "<" + tagName;
    if (attributes.length > 0) {
      this.output += " " + attributes.join(" ");
    }
    if (!this._isSelfClosing(node)) {
      this.output += ">";
    }
  }

  /**
   * Handles post-visit behaviour for the specified element node
   *
   * @param {Node} node
   */
  _endVisitElement(node: any) {
    const tagName = jsxTagName(node.tagName);
    // De-indent a bit
    // TODO: It's inefficient to do it this way :/
    this.output = trimEnd(this.output, this.config.indent);
    if (this._isSelfClosing(node)) {
      this.output += " />";
    } else {
      this.output += "</" + tagName + ">";
    }

    if (tagName === "pre") {
      this._inPreTag = false;
    }
  }
  /**
   * Determines if this element node should be rendered as a self-closing
   * tag.
   *
   * @param {Node} node
   * @return {boolean}
   */
  _isSelfClosing(node: any) {
    const tagName = jsxTagName(node.tagName);
    // If it has children, it's not self-closing
    // Exception: All children of a textarea are moved to a "defaultValue" attribute, style attributes are dangerously set.
    return !node.firstChild || tagName === "textarea" || tagName === "style";
  }

  /**
   * Handles processing of the specified text node
   *
   * @param {TextNode} node
   */
  _visitText(node: any) {
    const parentTag = node.parentNode && jsxTagName(node.parentNode.tagName);
    if (parentTag === "textarea" || parentTag === "style") {
      // Ignore text content of textareas and styles, as it will have already been moved
      // to a "defaultValue" attribute and "dangerouslySetInnerHTML" attribute respectively.
      return;
    }

    let text = escapeSpecialChars(node.textContent);

    if (this._inPreTag) {
      // If this text is contained within a <pre>, we need to ensure the JSX
      // whitespace coalescing rules don't eat the whitespace. This means
      // wrapping newlines and sequences of two or more spaces in letiables.
      text = text
        .replace(/\r/g, "")
        .replace(/( {2,}|\n|\t|\{|\})/g, function (whitespace: any) {
          return "{" + JSON.stringify(whitespace) + "}";
        });
    } else {
      // Handle any curly braces.
      text = text.replace(/(\{|\})/g, function (brace: string) {
        return "{'" + brace + "'}";
      });
      // If there's a newline in the text, adjust the indent level
      if (text.indexOf("\n") > -1) {
        text = text.replace(/\n\s*/g, this._getIndentedNewline());
      }
    }
    this.output += text;
  }

  /**
   * Handles processing of the specified text node
   *
   * @param {Text} node
   */
  _visitComment(node: any) {
    this.output += "{/*" + node.textContent.replace("*/", "* /") + "*/}";
  }

  /**
   * Gets a JSX formatted version of the specified attribute from the node
   *
   * @param {DOMElement} node
   * @param {object}     attribute
   * @return {string}
   */
  _getElementAttribute(node: any, attribute: any) {
    const tagName = jsxTagName(
      node.tagName
    ) as keyof typeof ELEMENT_ATTRIBUTE_MAPPING;
    const name =
      (ELEMENT_ATTRIBUTE_MAPPING[tagName] &&
        ELEMENT_ATTRIBUTE_MAPPING[tagName][
          attribute.name as keyof typeof ELEMENT_ATTRIBUTE_MAPPING.input
        ]) ||
      ATTRIBUTE_MAPPING[attribute.name as keyof typeof ATTRIBUTE_MAPPING] ||
      attribute.name;
    let result = name;
    switch (attribute.name) {
      case "style":
        return this._getStyleAttribute(attribute.value);
      default:
        if (isNumeric(attribute.value)) {
          result += "={" + attribute.value + "}";
        } else if (attribute.value.length > 0) {
          result += '="' + attribute.value.replace(/"/gm, "&quot;") + '"';
        } else if (attribute.value.length === 0 && attribute.name === "alt") {
          result += '=""';
        }
        return result;
    }
  }

  /**
   * Gets a JSX formatted version of the specified element styles
   *
   * @param {string} styles
   * @return {string}
   */
  _getStyleAttribute(styles: any) {
    const jsxStyles = new StyleParser(styles).toJSXString();
    return "style={{" + jsxStyles + "}}";
  }

  /**
   * Removes class-level indention in the JSX output. To be used when the JSX
   * output is configured to not contain a class deifinition.
   *
   * @param {string} output JSX output with class-level indention
   * @param {string} indent Configured indention
   * @return {string} JSX output wihtout class-level indention
   */
  _removeJSXClassIndention(output: any, indent: any) {
    const classIndention = new RegExp("\\n" + indent + indent + indent, "g");
    return output.replace(classIndention, "\n");
  }
}

export class StyleParser {
  private styles: { [key: string]: string } = {};

  constructor(rawStyle: string) {
    this.parse(rawStyle);
  }

  /**
   * Parse the specified inline style attribute value
   * @param {string} rawStyle Raw style attribute
   */
  private parse(rawStyle: string): void {
    rawStyle.split(";").forEach((style) => {
      style = style.trim();
      const firstColon = style.indexOf(":");
      let key = style.substr(0, firstColon);
      const value = style.substr(firstColon + 1).trim();
      if (key !== "") {
        // Style key should be case insensitive
        key = key.toLowerCase();
        this.styles[key] = value;
      }
    });
  }

  /**
   * Convert the style information represented by this parser into a JSX
   * string
   *
   * @return {string}
   */
  public toJSXString(): string {
    const output: string[] = [];
    Object.entries(this.styles).forEach(([key, value]) =>
      output.push(this.toJSXKey(key) + ": " + this.toJSXValue(value))
    );
    return output.join(", ");
  }

  /**
   * Convert the CSS style key to a JSX style key
   *
   * @param {string} key CSS style key
   * @return {string} JSX style key
   */
  private toJSXKey(key: string): string {
    // Don't capitalize -ms- prefix
    if (/^-ms-/.test(key)) {
      key = key.substr(1);
    }
    return hyphenToCamelCase(key);
  }

  /**
   * Convert the CSS style value to a JSX style value
   *
   * @param {string} value CSS style value
   * @return {string} JSX style value
   */
  private toJSXValue(value: string): string {
    if (isNumeric(value)) {
      // If numeric, no quotes
      return value;
    } else {
      // Probably a string, wrap it in quotes
      return "'" + value.replace(/'/g, '"') + "'";
    }
  }
}

export default HTMLtoJSX;
