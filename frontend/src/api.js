import axios from 'axios';

export async function analyzeSequence(secuencia, accepted=[]) {
  const res = await axios.post('http://localhost:5000/api/v1/analizar', {
    secuencia: secuencia.toUpperCase().trim(),
    accepted: accepted
  });
  return res.data;
}

export default { analyzeSequence };
