import React, { useState } from 'react';
import Graph from './components/Graph';
import './App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState('graph1.json');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Graphi</h1>
        <select onChange={handleFileChange} value={selectedFile} className="file-selector">
          <option value="graph1.json">Graph 1</option>
          <option value="graph2.json">Graph 2</option>
          <option value="graph3.json">Graph 3</option>
        </select>
      </header>
      <main className="app-main">
        <Graph selectedFile={selectedFile} />
      </main>
    </div>
  );
};

export default App;
