/* eslint-disable import/no-extraneous-dependencies */
import { basicSetup, EditorView } from 'codemirror';

import { EditorState, Compartment } from '@codemirror/state';

import { html } from '@codemirror/lang-html';

import { css } from '@codemirror/lang-css';

import { javascript } from '@codemirror/lang-javascript';

import _html from './template.html';

const defaultOptions = {
  width: '100%',
  height: '300px',
  loadHTMLFromCache: true,
  loadCSSFromCache: true,
  loadJavaScriptFromCache: true,
};

/* eslint-disable import/prefer-default-export */
export function init(domElement, options = defaultOptions) {
  const language = new Compartment();
  const tabSize = new Compartment();

  const iframe = document.createElement('iframe');

  if ('width' in options) {
    iframe.style.width = options.width;
  } else {
    iframe.style.width = defaultOptions.width;
  }

  if ('height' in options) {
    iframe.style.height = options.height;
  } else {
    iframe.style.height = defaultOptions.height;
  }

  // Remove the border around the iframe
  iframe.style.border = 'none';

  // Inject template HTML
  iframe.srcdoc = _html;

  // Append iframe to the desired DOM
  domElement.appendChild(iframe);

  let htmlValue = '';
  let cssValue = '';
  let javaScriptValue = '';

  if ('htmlValue' in options) {
    htmlValue = options.htmlValue;
  } else {
    let { loadHTMLFromCache } = defaultOptions;
    if ('loadHTMLFromCache' in options) {
      loadHTMLFromCache = options.loadHTMLFromCache;
    }
    if (loadHTMLFromCache) {
      htmlValue = localStorage.getItem('htmlCode');
    }
  }

  if ('cssValue' in options) {
    cssValue = options.cssValue;
  } else {
    let { loadCSSFromCache } = defaultOptions;
    if ('loadCSSFromCache' in options) {
      loadCSSFromCache = options.loadCSSFromCache;
    }
    if (loadCSSFromCache) {
      cssValue = localStorage.getItem('cssCode');
    }
  }

  if ('javaScriptValue' in options) {
    javaScriptValue = options.javaScriptValue;
  } else {
    let { loadJavaScriptFromCache } = defaultOptions;
    if ('loadJavaScriptFromCache' in options) {
      loadJavaScriptFromCache = options.loadJavaScriptFromCache;
    }
    if (loadJavaScriptFromCache) {
      javaScriptValue = localStorage.getItem('javaScriptCode');
    }
  }

  iframe.onload = () => {
    const document = iframe.contentDocument;

    const run = () => {
      const doc = document.getElementById('doc');

      localStorage.setItem('htmlCode', htmlValue);
      localStorage.setItem('cssCode', cssValue);
      localStorage.setItem('javaScriptCode', javaScriptValue);

      // Build-up the HTML DOC
      const htmlDoc = `<!DOCTYPE html><head><title>CodeRunner</title><style>${cssValue}</style></head><body>${htmlValue}<script>${javaScriptValue}</script></body></html>`;

      doc.setAttribute('srcdoc', htmlDoc);
    };

    // Initial run
    run();

    let timeout;
    let isAutoRunEnabled = true;

    const barWrapper = document.getElementById('bar-wrapper');
    const loading = document.getElementById('loading');
    const autoRun = document.getElementById('auto-run');
    const runButtonWrapper = document.getElementById('run-button-wrapper');
    const tabButtons = document.getElementsByClassName('tab-button');

    const handleChange = () => {
      if (!isAutoRunEnabled) {
        return;
      }
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      loading.classList.remove('animated-loading');

      setTimeout(() => {
        loading.classList.add('animated-loading');
      }, 0);

      timeout = setTimeout(() => {
        run();
      }, 500);
    };

    const stateHTML = EditorState.create({
      doc: htmlValue,
      extensions: [
        basicSetup,
        language.of(html()),
        tabSize.of(EditorState.tabSize.of(8)),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            // Document changed
            htmlValue = v.state.doc.toString();
            handleChange();
          }
        }),
      ],
    });

    const stateCSS = EditorState.create({
      doc: cssValue,
      extensions: [
        basicSetup,
        language.of(css()),
        tabSize.of(EditorState.tabSize.of(8)),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            // Document changed
            cssValue = v.state.doc.toString();
            handleChange();
          }
        }),
      ],
    });

    const stateJs = EditorState.create({
      doc: javaScriptValue,
      extensions: [
        basicSetup,
        language.of(javascript()),
        tabSize.of(EditorState.tabSize.of(8)),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            // Document changed
            javaScriptValue = v.state.doc.toString();
            handleChange();
          }
        }),
      ],
    });

    // eslint-disable-next-line no-unused-vars
    const viewHTML = new EditorView({
      state: stateHTML,
      parent: document.getElementById('source-code-html'),
    });

    // eslint-disable-next-line no-unused-vars
    const viewCSS = new EditorView({
      state: stateCSS,
      parent: document.getElementById('source-code-css'),
    });

    // eslint-disable-next-line no-unused-vars
    const viewJs = new EditorView({
      state: stateJs,
      parent: document.getElementById('source-code-javascript'),
    });

    runButtonWrapper.onclick = () => {
      run();
    };

    autoRun.onchange = (event) => {
      if (event.target.checked) {
        isAutoRunEnabled = true;
        runButtonWrapper.style.display = 'none';
        barWrapper.style.display = 'flex';
      } else {
        isAutoRunEnabled = false;
        runButtonWrapper.style.display = 'flex';
        barWrapper.style.display = 'none';
      }
    };

    runButtonWrapper.style.display = 'none';
    barWrapper.style.display = 'flex';

    [...tabButtons].forEach((tabButton) => {
      const localTabButton = tabButton;
      localTabButton.onclick = (event) => {
        event.target.classList.add('active');

        const tabId = tabButton.getAttribute('tab-id');

        [...tabButtons].filter((el) => el.getAttribute('tab-id') !== tabId).forEach((el) => {
          el.classList.remove('active');
        });

        const tabs = document.getElementsByClassName('tab');

        [...tabs].forEach((el) => {
          if (el.getAttribute('value') === tabId) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });
      };
    });
  };
}
