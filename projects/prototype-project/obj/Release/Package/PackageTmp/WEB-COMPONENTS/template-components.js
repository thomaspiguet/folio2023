(function(window, document) {
  'use strict';

  /*
   * Tools to simplify using web components in Logibec UI Kit.
   */

  /**
   * Registers a custom web component.
   * 
   * @param {string} tagName 
   * @param {Object} options 
   */
  function defineComponent(tagName, options) {
    
    // Assertions.
    if (!tagName || tagName.length === 0 || tagName.indexOf('-') === -1) {
      throw new Error('"tagName" must not be empty, null or undefined and must contain an hyphen (-)');
    }

    // Keep a reference to the document where the component is defined.
    var currentScript = null;
    if (document._currentScript) {
      // IE and Edge
      currentScript = document._currentScript;
    } else {
      currentScript = document.currentScript;
    }
    
    var localDocument = currentScript.ownerDocument;

    // Create an anymous class for the component.
    // NOTE ES6 syntax + Custom Elements v1 spec: doesn't work on IE11. Kept for reference.
    //  var itemClass = class extends HTMLElement {
    //   constructor() {
    //     super();
    //     if (options) {
    //       if (options.onInit) {
    //         options.onInit.call(this, arguments);
    //       }
    //       if (options.templateId) {
    //         var clone = lukCloneTemplate(localDocument, options.templateId);
    //         if (options.onProcessTemplate) {
    //           options.onProcessTemplate.call(this, clone, localDocument);
    //         }
    //         this.appendChild(clone);
    //       }
    //     }
    //   }
    //   connectedCallback() {
    //     if (options && options.onConnected) {
    //       options.onConnected.call(this, arguments);
    //     }
    //   }
    //   // TODO handle other callbacks?
    // };
    //
    // customElements.define(tagName, ItemClass);

    // NOTE ES5 syntax + Custom Elements v0 spec: Works "everywhere" (with polyfills).
    var proto = Object.create(HTMLElement.prototype);
    proto.createdCallback = function () {
      if (options) {
        if (options.onInit) {
          options.onInit.call(this, arguments);
        }
        if (options.templateId) {
          var clone = cloneTemplate(localDocument, options.templateId);

          if (options.onProcessTemplate) {
            options.onProcessTemplate.call(this, clone, localDocument);
          }

          this.appendChild(clone);
        }
      }
    };    
    proto.attachedCallback = function() {
      if (options && options.onConnected) {
        options.onConnected.call(this, arguments);
      }
    };
    
    document.registerElement(tagName, { prototype: proto });
  }

  /**
   * Deeps clones and import a template content identified by its `templateId`
   * from `containingDocument` into the current document.
   * 
   * @param {HTMLDocument} containingDocument The document where the template is defined.
   * @param {string} templateId The template ID.
   * @returns {HTMLElement} Cloned / imported element.
   */
  function cloneTemplate(containingDocument, templateId) {
    var tpl = containingDocument.getElementById(templateId);
    var clone = document.importNode(tpl.content, true);
    return clone;
  }

  // Exports
  window.templateComponents = {
    define: defineComponent,
    cloneTemplate: cloneTemplate
  };

})(window, document);