/** @format */

import React, { useState, useContext, useEffect } from "react";

import MonacoEditor from 'react-monaco-editor/lib/index';

class ScriptEditor extends React.Component {
    render() {
        return (
            <MonacoEditor
                width="800"
                height="600"
                language="javascript"
                theme="vs-dark"
                value="hello world!"
            />
        );
    }
}

export default ScriptEditor;