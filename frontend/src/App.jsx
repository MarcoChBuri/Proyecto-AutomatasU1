import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [secuencia, setSecuencia] = useState('');
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [acceptedPatterns, setAcceptedPatterns] = useState([]);
  const [automataImage, setAutomataImage] = useState(null);
  const taRef = useRef(null);

  const analizarADN = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/analizar', { 
        secuencia: secuencia.toUpperCase().trim(),
        accepted: acceptedPatterns
      });
      setResultados(res.data.data.detalles);
      setSeleccionado(null);
    } catch (error) {
      alert("No se comunica con Flask - Verifica que el servidor esté ejecutándose");
    }
  };

  const insertAtCursor = (text) => {
    const ta = taRef.current;
    if (!ta) { setSecuencia(prev => prev + text); return; }
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const before = secuencia.slice(0, start);
    const after = secuencia.slice(end);
    const next = before + text + after;
    setSecuencia(next);
    // restore cursor after inserted text
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + text.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const togglePattern = (p) => {
    setAcceptedPatterns(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleImageUpload = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAutomataImage(reader.result);
    reader.readAsDataURL(f);
  };

  const renderVisualizador = () => {
    if (!secuencia) return <span className="text-gray-500">Esperando secuencia...</span>;

    let html = [];
    const selectedMatch = seleccionado !== null ? resultados[seleccionado] : null;
    
    for (let i = 0; i < secuencia.length; i++) {
      if (selectedMatch && i >= selectedMatch.inicio && i <= selectedMatch.fin) {
        // This position is part of the selected match
        if (i === selectedMatch.inicio) {
          html.push(
            <span key={i} id={`match-${seleccionado}`} className="match selected">
              {secuencia.substring(selectedMatch.inicio, selectedMatch.fin + 1)}
            </span>
          );
        }
        i = selectedMatch.fin; // Jump to end of match
      } else {
        // Normal character, no highlight
        html.push(secuencia[i]);
      }
    }
    
    return html;
  };

  useEffect(() => {
    if (seleccionado !== null) {
      const el = document.getElementById(`match-${seleccionado}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [seleccionado]);

  return (
    <div className="container">
      <h1 style={{color: '#60a5fa'}}>Analizador de ADN</h1>
      


      <div className="main-grid">
        <div className="panel">
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

          <textarea 
            ref={taRef}
            placeholder="Pega tu cadena de ADN..."
            value={secuencia}
            onChange={(e) => setSecuencia(e.target.value)}
          />

          <div className="visualizador">
            <pre className="sequence">{renderVisualizador()}</pre>
          </div>
        </div>

        <div className="panel">
          <h3>Hallazgos: {resultados.length}</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Patrón</th>
                <th>Rango</th>
              </tr>
            </thead>
            <tbody>
              {resultados.length === 0 && secuencia ? (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', color: '#ef4444', fontWeight: 'bold'}}>Cadena inválida</td>
                </tr>
              ) : (
                resultados.map((res, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => setSeleccionado(seleccionado === idx ? null : idx)}
                    className={seleccionado === idx ? "active-row" : ""}
                  >
                    <td>{idx + 1}</td>
                    <td><span className="badge" title={res.patron}>Coincidencia</span></td>
                    <td>[{res.inicio} - {res.fin}]</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="accepted-list">
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;