import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';

const CodeEditor = ({ initialCode = '// Write your code here', language = 'javascript' }) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' }
  ];

  const handleRunCode = () => {
    setIsRunning(true);
    // This would typically send the code to a backend for execution
    // For now, we'll just simulate a response
    setTimeout(() => {
      setOutput('Code executed successfully!\nOutput: Hello, World!');
      setIsRunning(false);
    }, 1000);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FontAwesomeIcon icon={faUndo} className="mr-1" />
            Reset
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FontAwesomeIcon icon={faPlay} className="mr-1" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FontAwesomeIcon icon={faSave} className="mr-1" />
            Save
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="h-[400px] border-b border-gray-200 dark:border-gray-700">
        <Editor
          height="100%"
          language={selectedLanguage}
          value={code}
          onChange={setCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            matchBrackets: 'always',
          }}
        />
      </div>

      {/* Output Console */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Output</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
          {output || 'No output yet. Run your code to see the results.'}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor; 