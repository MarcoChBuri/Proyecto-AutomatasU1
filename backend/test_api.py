import requests
import json

def probar_analisis_adn(secuencia_ejemplo):
    # La URL donde corre tu Flask (ajusta el puerto si usas otro)
    url = "http://localhost:5000/api/v1/analizar"
    
    # El cuerpo del mensaje (JSON)
    payload = {
        "secuencia": secuencia_ejemplo
    }
    
    headers = {
        "Content-Type": "application/json"
    }

    print(f"--- Probando secuencia: {secuencia_ejemplo} ---")
    
    try:
        # Enviamos la petición POST
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        
        # Verificamos si el servidor respondió bien
        if response.status_code == 200:
            resultado = response.json()
            print("✅ Conexión exitosa")
            print(f"📊 Total encontrados: {resultado['data']['conteo_total']}")
            
            for detalle in resultado['data']['detalles']:
                print(f"   🧬 Patrón: {detalle['patron']} | Rango: [{detalle['inicio']} - {detalle['fin']}]")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: ¿Olvidaste encender el servidor Flask? (python app.py)")

if __name__ == "__main__":
    # Prueba 1: Cadena con los tres codones finales
    cadena_test = "ATGTAAATGTAGATGTGA"
    probar_analisis_adn(cadena_test)
    
    print("\n")
    
    # Prueba 2: Una cadena más larga y desordenada
    cadena_larga = "CCCCCATGAAAAGGGTAACCCCCATGTAGCCCCCATGTGA"
    probar_analisis_adn(cadena_larga)