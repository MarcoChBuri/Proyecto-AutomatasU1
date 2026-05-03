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
        
        # Limpieza de cadena (mayúsculas y sin espacios)
        secuencia = data['secuencia'].upper().strip()
        
        # Fase 1: KMP para filtrar inicios
        indices_inicio = buscar_atg(secuencia)
        
        if not indices_inicio:
            return jsonify({"status": "success", "detalles": [], "conteo": 0}), 200

        # Fase 2: Autómata de 10 estados
        resultados = procesar_automata(secuencia, indices_inicio)

        return jsonify({
            "status": "success",
            "data": {
                "conteo_total": len(resultados),
                "detalles": resultados
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500