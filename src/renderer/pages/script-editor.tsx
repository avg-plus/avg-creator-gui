/** @format */

import React, { useState, useContext, useEffect } from "react";

import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

class ScriptEditor extends React.Component {
    editor?: monaco.editor.IStandaloneCodeEditor;
    private containerElement?: HTMLDivElement;

    private MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
            if (label === 'json') {
                return './json.worker.js';
            }
            if (label === 'css') {
                return './css.worker.js';
            }
            if (label === 'html') {
                return './html.worker.js';
            }
            if (label === 'typescript' || label === 'javascript') {
                return './ts.worker.js';
            }
            return './editor.worker.js';
        },
    };
    constructor(props: any) {
        super(props);
        this.containerElement = undefined;
    }

    componentDidMount() {
        this.initMonaco();
    }

    assignRef = (component: HTMLDivElement) => {
        this.containerElement = component;
    };

    initMonaco() {
        if (this.containerElement) {
            // Before initializing monaco editor
            this.editor = monaco.editor.create(
                this.containerElement,
                {
                    value: 'hello world',
                    language: 'javascript'
                }
            );
            // After initializing monaco editor
            this.editorDidMount(this.editor);
        }
    }
    editorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    }
    render() {
        return (
            <div>
                <div className="editor-element" ref={this.assignRef}></div>
                editor
            </div>
        );
    }
}

export default ScriptEditor;