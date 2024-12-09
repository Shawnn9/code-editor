import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';

const App = () => {
  const [language, setLanguage] = useState('javascript'); // Selected language
  const [code, setCode] = useState('// Write your code here'); // Editor content
  const [output, setOutput] = useState(''); // Output
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar visibility state

  // Handle language selection
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(getStarterCode(lang));
  };

  // Starter code for each language
  const getStarterCode = (lang) => {
    switch (lang) {
      case 'javascript':
        return `console.log('Hello, JavaScript!');`;
      case 'html':
        return `<h1>Hello, HTML!</h1>`;
      case 'css':
        return `body { background-color: lightblue; }`;
      case 'python':
        return `print("Hello, Python!")`;
      case 'c':
        return `#include <stdio.h>\n\nint main() {\n    printf("Hello, C!\\n");\n    return 0;\n}`;
      case 'cpp':
        return `#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    return 0;\n}`;
      case 'java':
        return `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`;
      case 'php':
        return `<?php\n\necho "Hello, PHP!";\n?>`;
      default:
        return '';
    }
  };

  // Handle "Run Code" button
  const handleRunCode = async () => {
    if (['python', 'c', 'cpp', 'java', 'php'].includes(language)) {
      try {
        const response = await fetch('http://127.0.0.1:5000/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setOutput(`Error: ${errorData.error}`);
          return;
        }

        const result = await response.json();
        setOutput(result.output);
      } catch (err) {
        setOutput(`Error: ${err.message}`);
      }
    } else if (language === 'javascript') {
      try {
        let consoleOutput = '';
        const originalLog = console.log;
        console.log = (message) => {
          consoleOutput += message + '\n';
        };

        eval(code); // Execute JavaScript code
        console.log = originalLog; // Restore console.log
        setOutput(consoleOutput || 'Code executed successfully.');
      } catch (err) {
        setOutput(`Error: ${err.message}`);
      }
    } else if (language === 'html' || language === 'css') {
      const iframe = document.getElementById('output-frame');
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      if (language === 'html') {
        iframeDoc.open();
        iframeDoc.write(code);
        iframeDoc.close();
      } else if (language === 'css') {
        iframeDoc.open();
        iframeDoc.write(`<style>${code}</style>`);
        iframeDoc.close();
      }
      setOutput('Code rendered in the output frame.');
    } else {
      setOutput(`Running ${language} is not supported.`);
    }
  };

  // Clear the output
  const clearOutput = () => {
    setOutput('');
  };

  // Toggle the sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className={`Sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button onClick={toggleSidebar} className="Sidebar-toggle">
          {sidebarOpen ? '>' : '<'}
        </button>
        <h3>Languages</h3>
        {[ // List of language icons and names
          { lang: 'javascript', img: '/images/js.png', name: 'JavaScript' },
          { lang: 'html', img: '/images/html.png', name: 'HTML' },
          { lang: 'css', img: '/images/css.png', name: 'CSS' },
          { lang: 'python', img: '/images/python.png', name: 'Python' },
          { lang: 'cpp', img: '/images/c-.png', name: 'C++' },
          { lang: 'java', img: '/images/java.png', name: 'Java' },
          { lang: 'php', img: '/images/php.png', name: 'PHP' },
        ].map((item) => (
          <div
            key={item.lang}
            className={`Sidebar-item ${language === item.lang ? 'active' : ''}`}
            onClick={() => handleLanguageChange(item.lang)}
          >
            <img src={item.img} alt={item.name} className="Sidebar-icon" />
            {sidebarOpen && <span>{item.name}</span>}
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="Main-section">
        {/* Editor Section */}
        <div className="Editor">
          <Editor
            height="calc(100% - 50px)" // Adjusted height to account for button height
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            key={language}
          />
          {/* Run Code Button inside Editor */}
          <div className="RunButton-container">
            <button className="RunButton" onClick={handleRunCode}>
              Run Code
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="Output">
          <h3>Output:</h3>
          <div className="Output-header">
            <button className="ClearButton" onClick={clearOutput}>
              Clear Output
            </button>
          </div>
          {language === 'html' || language === 'css' ? (
            <iframe id="output-frame"></iframe>
          ) : (
            <pre>{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
