import React from 'react';

export default function Visualizer({ secuencia, taRef, renderVisualizador }) {
  return (
    <>
      <textarea 
        ref={taRef}
        placeholder="Pega tu cadena de ADN..."
        value={secuencia}
        onChange={() => { /* controlled from parent */ }}
      />

      <div className="visualizador">
        <pre className="sequence">{renderVisualizador()}</pre>
      </div>
    </>
  );
}
