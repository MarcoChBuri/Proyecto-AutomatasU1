import React from 'react';

export default function FastaTable({ parsedFastas, selectedFastaIndex, selectFasta }) {
  if (!parsedFastas || parsedFastas.length === 0) return null;
  return (
    <div className="fasta-table" style={{marginTop: '18px'}}>
      <h3>Entradas FASTA cargadas: {parsedFastas.length}</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Header</th>
            <th>Len</th>
            <th>Válida</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {parsedFastas.map((f, i) => (
            <tr key={i} className={selectedFastaIndex === i ? 'active-row' : ''}>
              <td>{i + 1}</td>
              <td title={f.header} style={{maxWidth: '480px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{f.header || '(sin header)'}</td>
              <td>{f.length}</td>
              <td style={{fontWeight: 'bold'}}>
                {f.valid === null ? (
                  <span className="muted">Pendiente</span>
                ) : (
                  <span style={{color: f.valid ? '#16a34a' : '#ef4444'}}>{f.valid ? 'Sí' : 'No'}</span>
                )}
              </td>
              <td><button className="btn" onClick={() => selectFasta(i)}>Seleccionar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
