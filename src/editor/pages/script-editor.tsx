/** @format */

import React, { useState, useContext, useEffect } from "react";
import MonacoEditor from 'react-monaco-editor';

export const ScriptEditor = () => {
    return (
        <div>
            123
            <MonacoEditor
                width="800"
                height="600"
                language="javascript"
                theme="vs-dark"
                value=""
            />
        </div>
    );
}

export default ScriptEditor;