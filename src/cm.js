import { basicSetup, EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { html } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"

let language = new Compartment;
let tabSize = new Compartment;


let stateHTML = EditorState.create({
    extensions: [
        basicSetup,
        language.of(html()),
        tabSize.of(EditorState.tabSize.of(8))
    ]
})

let viewHTML = new EditorView({
    state: stateHTML,
    parent: document.getElementById("source-code-html")
})

let stateJS = EditorState.create({
    extensions: [
        basicSetup,
        language.of(javascript()),
        tabSize.of(EditorState.tabSize.of(8))
    ]
})

let viewJS = new EditorView({
    state: stateJS,
    parent: document.getElementById("js")
})