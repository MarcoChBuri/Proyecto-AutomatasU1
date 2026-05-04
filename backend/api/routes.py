from flask import Blueprint, request, jsonify
from logic.kmp import buscar_atg
from logic.automata import procesar_automata

api_bp = Blueprint('api', __name__)

@api_bp.route('/analizar', methods=['POST'])
def analizar():
    try:
        data = request.get_json()
        if not data or 'secuencia' not in data:
            return jsonify({"error": "Falta el campo 'secuencia'"}), 400
        
        secuencia = data['secuencia'].upper().strip()
        # simple validation: only A/T/G/C allowed
        import re
        letters_ok = bool(re.fullmatch(r'[ATGC]+', secuencia))

        if not letters_ok:
            return jsonify({
                "status": "success",
                "valid": False,
                "data": {
                    "conteo_total": 0,
                    "detalles": []
                }
            }), 200

        # find start codons and run automaton to determine valid ORFs
        indices_inicio = buscar_atg(secuencia)
        if not indices_inicio:
            # no ATG found -> invalid according to rules
            return jsonify({
                "status": "success",
                "valid": False,
                "data": {
                    "conteo_total": 0,
                    "detalles": []
                }
            }), 200

        resultados = procesar_automata(secuencia, indices_inicio)
        # valid only if automata found at least one valid ORF (start+stop)
        is_valid = bool(resultados and len(resultados) > 0)

        return jsonify({
            "status": "success",
            "valid": is_valid,
            "data": {
                "conteo_total": len(resultados),
                "detalles": resultados
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500