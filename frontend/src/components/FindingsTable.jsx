import React from 'react';

export default function FindingsTable({ resultados, seleccionado, setSeleccionado, secuencia }) {
  return (
    <>
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
      <div className="accepted-list"></div>
    </>
  );
}
