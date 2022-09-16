import _html from './template.html';

const iframe = document.createElement("iframe");
iframe.style.width = '100%';
iframe.style.height = '300px';

iframe.srcdoc = _html;

document.getElementById('root').appendChild(iframe)


import { basicSetup, EditorView } from "codemirror";
import { EditorState, Compartment, ViewUpdate } from "@codemirror/state";
import { html } from "@codemirror/lang-html"


let language = new Compartment;
let tabSize = new Compartment;


iframe.onload = () => {
    const document = iframe.contentDocument;

    let htmlValue = '';

    let stateHTML = EditorState.create({
        extensions: [
            basicSetup,
            language.of(html()),
            tabSize.of(EditorState.tabSize.of(8)),
            EditorView.updateListener.of(v => {
                    if (v.docChanged) {
                        // Document changed
                        htmlValue = v.state.doc.toString();
                        handleChange();
                    }
                }
            )
        ]
    })

    
    
    let viewHTML = new EditorView({
        state: stateHTML,
        parent: document.getElementById("source-code-html")
    })


    let isAutoRunEnabled = true;

    const barWrapper = document.getElementById("bar-wrapper");
    const loading = document.getElementById("loading");
    const autoRun = document.getElementById("auto-run");
    const runButtonWrapper = document.getElementById("run-button-wrapper");
    const tabButtons = document.getElementsByClassName("tab-button");

    runButtonWrapper.onclick = () => {
        run();
    }

    autoRun.onchange = (event) => {
        if (event.target.checked) {
            isAutoRunEnabled = true;
            runButtonWrapper.style.display = "none";
            barWrapper.style.display = "flex";
        }
        else {
            isAutoRunEnabled = false;
            runButtonWrapper.style.display = "flex";
            barWrapper.style.display = "none";
        }
    }

    runButtonWrapper.style.display = "none";
    barWrapper.style.display = "flex";

    let timeout;

    const handleChange = () => {
        if (!isAutoRunEnabled) {
            return;
        }
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        loading.classList.remove("animated-loading");
        setTimeout(() => {
            loading.classList.add("animated-loading");
        }, 0)
        timeout = setTimeout(() => {
            run();
        }, 500)
    }

    // viewHTML.on("change", handleChange);
    // cmCSS.on("change", handleChange);
    // cmJS.on("change", handleChange);

    const run = () => {
        const doc = document.getElementById("doc");

        const cssCode = ''
        // const htmlCode = cmHTML.getValue();
        const jsCode = ''

        localStorage.setItem("htmlCode", htmlValue);
        // localStorage.setItem("cssCode", cssCode);
        // localStorage.setItem("jssCode", jsCode);

        // Build-up the HTML DOC
        const htmlDoc = `<!DOCTYPE html><head> <title>CodeRunner</title> <style>${cssCode}</style></head><body> ${htmlValue}<script>${jsCode}</script></body></html>`

        doc.setAttribute("srcdoc", htmlDoc);
    }

    [...tabButtons].forEach(tabButton => {
        tabButton.onclick = (event) => {
            event.target.classList.add("active");

            const tabId = tabButton.getAttribute("tab-id");

            [...tabButtons].filter(el => el.getAttribute("tab-id") !== tabId).forEach(el => {
                el.classList.remove("active");
            })

            const tabs = document.getElementsByClassName("tab");

            [...tabs].forEach(el => {
                if (el.getAttribute("value") === tabId) {
                    el.classList.add("active");
                    cmHTML.refresh();
                    cmCSS.refresh();
                    cmJS.refresh();
                }
                else {
                    el.classList.remove("active");
                }
            })
        }
    });

    const loadFromLocalStorage = () => {
        // Initial load
        const htmlCodeLoaded = localStorage.getItem("htmlCode");
        const cssCodeLoaded = localStorage.getItem("cssCode");
        const jsCodeLoaded = localStorage.getItem("jssCode");

        stateHTML.update({changes: {from: 0, to: stateHTML.doc.length, insert: htmlCodeLoaded}})

        // if (htmlCodeLoaded !== null) {
        //     cmHTML.setValue(htmlCodeLoaded);
        // }

        // if (cssCodeLoaded !== null) {
        //     cmCSS.setValue(cssCodeLoaded);
        // }

        // if (jsCodeLoaded !== null) {
        //     cmJS.setValue(jsCodeLoaded);
        // }
    }

    loadFromLocalStorage();

}

