import { useState, useEffect, useRef } from 'react';
import './App.css';
import FileControls from './components/FileControls';
import Controls from './components/Controls';
import Visualizer from './components/Visualizer';
import FindingsTable from './components/FindingsTable';
import FastaTable from './components/FastaTable';
import { analyzeSequence } from './api';

function App() {
  const [secuencia, setSecuencia] = useState('');
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [acceptedPatterns, setAcceptedPatterns] = useState([]);
  const [automataImage, setAutomataImage] = useState(null);
  const [exportName, setExportName] = useState('');
  const taRef = useRef(null);
  const [parsedFastas, setParsedFastas] = useState([]);
  const [selectedFastaIndex, setSelectedFastaIndex] = useState(null);

  const analizarADN = async () => {
    try {
      const data = await analyzeSequence(secuencia, acceptedPatterns);
      const detalles = (data && data.data && data.data.detalles) ? data.data.detalles : [];
      setResultados(detalles);
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

  const handleFastaUpload = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result || '';
      const parts = text.split(/>+/).map(p => p.trim()).filter(p => p.length > 0);
      const entries = parts.map(p => {
        const lines = p.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        const header = lines.length > 0 ? lines[0] : '';
        const seqLines = lines.slice(1);
        const rawSeq = seqLines.join('').toUpperCase().replace(/\s+/g, '');
        // validity will be determined by backend; mark as unknown (null) for now
        return { header, seq: rawSeq, valid: null, length: rawSeq.length };
      });
      setParsedFastas(entries);
      // if there is exactly one valid entry, load it automatically
      // if only one entry, auto-select and ask backend to validate/analyze it
      if (entries.length === 1) {
        setSelectedFastaIndex(0);
        setSecuencia(entries[0].seq);
        // call backend to validate/analyze and update validity
        analizarSecuenciaTexto(entries[0].seq, 0).then(() => {}).catch(() => {});
      } else {
        setSecuencia('');
        setSelectedFastaIndex(null);
        setResultados([]);
      }
    };
    reader.readAsText(f);
    // reset the input value so the same file can be re-selected if needed
    e.target.value = '';
  };

  const analizarSecuenciaTexto = async (seq, idx = null) => {
    try {
      const res = await analyzeSequence(seq, acceptedPatterns);
      const detalles = (res && res.data && res.data.detalles) ? res.data.detalles : [];
      setResultados(detalles);
      setSeleccionado(null);
      if (idx !== null) {
        const ok = res && res.valid === true;
        setParsedFastas(prev => prev.map((p, i) => i === idx ? { ...p, valid: ok } : p));
      }
      return res;
    } catch (error) {
      alert('No se comunica con Flask - Verifica que el servidor esté ejecutándose');
      throw error;
    }
  };

  const selectFasta = (idx) => {
    const entry = parsedFastas[idx];
    if (!entry) return;
    setSelectedFastaIndex(idx);
    setSecuencia(entry.seq);
    setResultados([]);
    // ask backend to validate and analyze sequence (updates parsedFastas via analizarSecuenciaTexto)
    analizarSecuenciaTexto(entry.seq, idx).catch(() => {
      alert('No se puede validar en el servidor');
    });
  };

  const exportToFasta = () => {
    if (!secuencia || secuencia.trim() === '') { alert('No hay secuencia para exportar'); return; }
    const header = '>gi|12345678|ref|NM_001| Homo sapiens gen de prueba';
    const content = header + '\n' + secuencia + '\n';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    // sanitize filename provided by user
    let filename = (exportName || '').trim();
    if (filename === '') filename = 'secuencia.fasta.txt';
    // replace forbidden chars for filenames
    filename = filename.replace(/[<>:"/\\|?*]+/g, '_');
    if (!/\.txt$/i.test(filename)) filename = filename + '.txt';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
            <Controls insertAtCursor={insertAtCursor} analizarADN={analizarADN} />
            <FileControls onFastaUpload={handleFastaUpload} exportName={exportName} setExportName={setExportName} onExport={exportToFasta} />
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
          <FindingsTable resultados={resultados} seleccionado={seleccionado} setSeleccionado={setSeleccionado} secuencia={secuencia} />
        </div>
      </div>
      <FastaTable parsedFastas={parsedFastas} selectedFastaIndex={selectedFastaIndex} selectFasta={selectFasta} />
    </div>
  );
}

export default App;