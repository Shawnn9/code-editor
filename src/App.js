import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';

const App = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('vs-dark'); // Default theme is dark
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(getStarterCode(lang));
  };

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
      case 'php':
        return `<?php\n\necho "Hello, PHP!";\n?>`;
      default:
        return '';
    }
  };

  const handleRunCode = async () => {
    if (['python', 'c', 'cpp', 'php'].includes(language)) {
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
      setOutput('Unsupported language for execution.');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const clearOutput = () => {
    setOutput('');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredLanguages = [
    { lang: 'javascript', name: 'JavaScript' },
    { lang: 'html', name: 'HTML' },
    { lang: 'css', name: 'CSS' },
    { lang: 'python', name: 'Python' },
    { lang: 'cpp', name: 'C++' },
    { lang: 'php', name: 'PHP' },
  ].filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="App">
      <div className={`Sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button onClick={toggleSidebar} className="Sidebar-toggle">
          {sidebarOpen ? '>' : '<'}
        </button>
        <h3>Languages</h3>
        <input
          type="text"
          placeholder="Search languages"
          value={search}
          onChange={handleSearch}
          className="Sidebar-search"
        />
        <div className="Sidebar-languages">
          {filteredLanguages.map((item) => (
            <div
              key={item.lang}
              className={`Sidebar-item ${language === item.lang ? 'active' : ''}`}
              onClick={() => handleLanguageChange(item.lang)}
            >
              {sidebarOpen && <span>{item.name}</span>}
            </div>
          ))}
        </div>
        {/* Dark/Light Theme Buttons */}
        <div className="ThemeButtons">
          <button onClick={() => handleThemeChange('vs-dark')} className="ThemeButton">
            <img src="https://img.icons8.com/ios-filled/50/000000/moon.png" alt="Dark Mode" />
          </button>
          <button onClick={() => handleThemeChange('vs')} className="ThemeButton">
            <img src="https://img.icons8.com/ios-filled/50/000000/sun.png" alt="Light Mode" />
          </button>
        </div>
      </div>

      <div className="Main-section">
        <div className="Editor">
          <div className="Editor-header">
            <button className="RunButton" onClick={handleRunCode}>Run Code</button>
          </div>
          <Editor
            height="calc(100% - 50px)"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme={theme}
          />
        </div>

        <div className="Output">
          <h3>Output:</h3>
          <div className="Output-header">
            {/* Clear Output Button inside Output */}
            <button className="ClearButton" onClick={clearOutput}>Clear Output</button>
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
