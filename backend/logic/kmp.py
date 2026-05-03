def buscar_atg(texto):
    patron = "ATG"
    m = len(patron)
    n = len(texto)
    
    lps = [0] * m
    j = 0 
    
    indices = []
    i = 0 
    while i < n:
        if patron[j] == texto[i]:
            i += 1
            j += 1
        if j == m:
            # Encontrado: Guardamos el índice donde termina el ATG
            indices.append(i) 
            j = lps[j-1]
        elif i < n and patron[j] != texto[i]:
            if j != 0:
                j = lps[j-1]
            else:
                i += 1
    return indices