# Analizador de ADN - Autómata Finito Determinista

Herramienta para analizar secuencias de ADN utilizando un Autómata Finito Determinista (AFD) de 10 estados que detecta patrones de inicio (ATG) y terminación (TAA, TAG, TGA).

## 📋 Tabla de Contenidos
- [Instalación](#instalación)
- [Tecnologías Usadas](#tecnologías-usadas)
- [Metodología](#metodología)
- [Ejecución](#ejecución)

---

## 🚀 Instalación

### Requisitos Previos
- Python 3.8+
- Node.js 14+
- Git

### Backend (Flask)

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd Proyecto-AutomatasU1
```

2. Crear entorno virtual:
```bash
python -m venv venv
```

3. Activar entorno virtual:

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

4. Instalar dependencias:
```bash
pip install -r requirements.txt
```

### Frontend (React + Vite)

1. Navegar a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Volver a la raíz:
```bash
cd ..
```

---

## 🛠️ Tecnologías Usadas

### Backend
- **Flask 3.1.3** - Framework web Python
- **Flask-CORS 6.0.2** - Soporte CORS para comunicación frontend-backend
- **Werkzeug 3.1.8** - WSGI utilities para Flask
- **Gunicorn 20.1.0** - Servidor WSGI para producción

### Frontend
- **React** - Librería de interfaz de usuario
- **Vite** - Build tool y dev server
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de estilos

---

## 📚 Metodología

### Autómata Finito Determinista (AFD)

El proyecto implementa un AFD de **10 estados** que analiza secuencias de ADN:

**Estados:**
- **D** - Inicial (default)
- **E** - Primer nucleótido de ATG (T)
- **F** - Segundo nucleótido de ATG (A)
- **G** - Transición AT (G)
- **H** - Estado final TAA
- **I** - Estado final TAG
- **J** - Estado final TGA

**Funcionamiento:**
1. El algoritmo busca todos los puntos donde aparece "ATG" (inicio de gen)
2. Desde cada ATG, procesa la secuencia carácter por carácter según la tabla de transiciones
3. Al alcanzar un estado final (H, I, J), registra el hallazgo con su posición
4. Continúa procesando hasta el final de la secuencia

**Validación:**
- Si la secuencia no contiene patrones válidos (ATG...TAA/TAG/TGA), se muestra "Cadena inválida"

---

## ⚙️ Ejecución

### Iniciar Backend (en la raíz del proyecto)

**Con entorno virtual activado:**
```bash
python backend/app.py
```

El servidor estará disponible en `http://localhost:5000`

### Iniciar Frontend (en la raíz del proyecto)

**En otra terminal:**
```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
Proyecto-AutomatasU1/
├── backend/
│   ├── app.py                 # Aplicación Flask
│   ├── api/
│   │   └── routes.py          # Rutas API
│   └── logic/
│       ├── automata.py        # Lógica del AFD
│       └── kmp.py             # Búsqueda de patrones ATG
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Componente principal
│   │   └── assets/
│   └── package.json
├── requirements.txt           # Dependencias Python
└── README.md
```

---

## 🔬 Ejemplo de Uso

**Entrada válida:**
```
ggggatgtaa
```
✅ Resultado: Detecta ATG en posición 4 y TAA en posición 9

**Entrada inválida:**
```
attattttt
```
❌ Resultado: Cadena inválida (no contiene ATG...TAA/TAG/TGA)