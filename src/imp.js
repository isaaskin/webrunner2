const cmHTML = CodeMirror(document.getElementById("source-code-html"), {
    mode: "htmlmixed",
    theme: "abcdef",
    lineNumbers: true,
    gutter: true,
});

const cmCSS = CodeMirror(document.getElementById("source-code-css"), {
    mode: "css",
    theme: "abcdef",
    lineNumbers: true,
    gutter: true
});

const cmJS = CodeMirror(document.getElementById("source-code-js"), {
    mode: "javascript",
    theme: "abcdef",
    lineNumbers: true,
    gutter: true
});

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

cmHTML.on("change", handleChange);
cmCSS.on("change", handleChange);
cmJS.on("change", handleChange);

const run = () => {
    const doc = document.getElementsByClassName("doc")[0];

    const cssCode = cmCSS.getValue();
    const htmlCode = cmHTML.getValue();
    const jsCode = cmJS.getValue();

    localStorage.setItem("htmlCode", htmlCode);
    localStorage.setItem("cssCode", cssCode);
    localStorage.setItem("jssCode", jsCode);

    // Build-up the HTML DOC
    const htmlDoc = `<!DOCTYPE html><head> <title>CodeRunner</title> <style>${cssCode}</style></head><body> ${htmlCode}<script>${jsCode}</script></body></html>`

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

    if (htmlCodeLoaded !== null) {
        cmHTML.setValue(htmlCodeLoaded);
    }

    if (cssCodeLoaded !== null) {
        cmCSS.setValue(cssCodeLoaded);
    }

    if (jsCodeLoaded !== null) {
        cmJS.setValue(jsCodeLoaded);
    }
}

loadFromLocalStorage();
