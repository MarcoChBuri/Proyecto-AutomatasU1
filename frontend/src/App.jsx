import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [secuencia, setSecuencia] = useState('');
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  const analizarADN = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/analizar', { 
        secuencia: secuencia.toUpperCase().trim() 
      });
      setResultados(res.data.data.detalles);
      setSeleccionado(null);
    } catch (error) {
      alert("Error al conectar con el servidor Flask");
    }
  };

  const renderVisualizador = () => {
    if (!secuencia) return <span className="text-gray-500">Esperando secuencia...</span>;
    
    let html = [];
    let ultimoPos = 0;
    const aResaltar = seleccionado !== null ? [resultados[seleccionado]] : resultados;
    const ordenados = [...aResaltar].sort((a, b) => a.inicio - b.inicio);

    ordenados.forEach((item, idx) => {
      if (item.inicio > ultimoPos) {
        html.push(secuencia.substring(ultimoPos, item.inicio));
      }
      const esSeleccionado = seleccionado !== null;
      html.push(
        <span key={idx} className={esSeleccionado ? "bg-yellow-400 text-black font-bold" : "bg-blue-500/30 border-b-2 border-blue-500"}>
          {secuencia.substring(item.inicio, item.fin + 1)}
        </span>
      );
      ultimoPos = item.fin + 1;
    });
    html.push(secuencia.substring(ultimoPos));
    return html;
  };

  return (
    <div className="container">
      <h1 style={{color: '#60a5fa'}}>DNA Analyzer - AFD 10 Estados</h1>
      
      <div className="main-grid">
        <div className="panel">
          <textarea 
            placeholder="Pega tu cadena de ADN..."
            value={secuencia}
            onChange={(e) => setSecuencia(e.target.value)}
          />
          <button onClick={analizarADN}>Analizar Secuencia</button>
          
          <div className="visualizador">
            {renderVisualizador()}
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
              {resultados.map((res, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSeleccionado(seleccionado === idx ? null : idx)}
                  className={seleccionado === idx ? "active-row" : ""}
                >
                  <td>{idx + 1}</td>
                  <td><span className="badge">{res.patron}</span></td>
                  <td>[{res.inicio} - {res.fin}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;