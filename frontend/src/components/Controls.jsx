import React from 'react';

export default function Controls({ insertAtCursor, analizarADN }) {
  return (
    <div className="controls-row">
      <div className="pattern-buttons">
        <span>Patrones rápidos:</span>
        {['ATG','TAA','TAG','TGA'].map(p => (
          <div key={p} className="pattern-control">
            <button className="btn pattern" onClick={() => insertAtCursor(p)}>{p}</button>
          </div>
        ))}
      </div>
      <div className="quick-buttons">
        <button className="btn" onClick={() => insertAtCursor('A')}>A</button>
        <button className="btn" onClick={() => insertAtCursor('T')}>T</button>
        <button className="btn" onClick={() => insertAtCursor('G')}>G</button>
        <button className="btn" onClick={() => insertAtCursor('C')}>C</button>
        <button className="btn" onClick={() => insertAtCursor(' ')}>Espacio</button>
        <button className="btn primary" onClick={analizarADN}>Analizar Secuencia</button>
      </div>
    </div>
  );
}
