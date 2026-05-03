def procesar_automata(secuencia, indices_inicio):
    # Tabla de transiciones (Se mantiene tu diseño de estados)
    tabla = {
        'D': {'A': 'D', 'T': 'E', 'G': 'D', 'C': 'D'},
        'E': {'A': 'F', 'T': 'E', 'G': 'G', 'C': 'D'},
        'F': {'A': 'H', 'T': 'E', 'G': 'I', 'C': 'D'},
        'G': {'A': 'J', 'T': 'E', 'G': 'D', 'C': 'D'},
        'H': {'A': 'D', 'T': 'E', 'G': 'D', 'C': 'D'}, # TAA
        'I': {'A': 'D', 'T': 'E', 'G': 'D', 'C': 'D'}, # TAG
        'J': {'A': 'D', 'T': 'E', 'G': 'D', 'C': 'D'}  # TGA
    }
    
    finales = {'H': 'TAA', 'I': 'TAG', 'J': 'TGA'}
    hallazgos = []

    for inicio_atg in indices_inicio:
        estado = 'D'
        # NO usamos break. Si un ATG encuentra un TAA y luego un TGA, 
        # reportará ambos como secuencias válidas que empezaron en ese ATG.
        for k in range(inicio_atg, len(secuencia)):
            letra = secuencia[k]
            if letra in tabla[estado]:
                estado = tabla[estado][letra]
                
                if estado in finales:
                    # Registramos el hallazgo
                    hallazgos.append({
                        "patron": finales[estado],
                        "inicio": inicio_atg - 3, # Donde empezó el ATG
                        "fin": k
                    })
                    # El estado vuelve a D para seguir buscando más finales 
                    # para este MISMO inicio ATG
                    estado = 'D' 
            else:
                estado = 'D'
                
    return hallazgos