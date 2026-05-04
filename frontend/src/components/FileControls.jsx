import React from 'react';

export default function FileControls({ onFastaUpload, exportName, setExportName, onExport }) {
  return (
    <div className="file-controls">
      <label className="file-label">Subir FASTA</label>
      <input type="file" accept=".txt" onChange={onFastaUpload} />
      <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px'}}>
        <input
          type="text"
          placeholder="Nombre de archivo..."
          value={exportName}
          onChange={(e) => setExportName(e.target.value)}
          style={{padding: '6px', flex: '1'}}
        />
        <button className="btn" onClick={onExport}>Exportar a FASTA</button>
      </div>
    </div>
  );
}
