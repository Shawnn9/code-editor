import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here');

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div style={{ height: '90vh', border: '1px solid #ccc' }}>
      <Editor
        height="100%"
        defaultLanguage="javascript" // Default language
        defaultValue={code}
        theme="vs-dark" // Theme (dark mode)
        onChange={(value) => handleEditorChange(value)}
        options={{
          fontSize: 14,
          wordWrap: 'on',
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
