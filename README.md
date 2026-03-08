# TRUEMATH 🧠⚡

Plataforma interactiva de lógica simbólica con estética cyberpunk. Proyecto universitario construido con React + Vite.

## 📦 Tech Stack

| Tecnología | Uso |
|---|---|
| **React 19** | UI / Componentes |
| **Vite 7** | Bundler / Dev server |
| **Tailwind CSS 4** | Estilos utilitarios |
| **Framer Motion** | Animaciones |
| **Zustand** | Estado global del juego |
| **React Router v7** | Navegación SPA |
| **Supabase** | Base de datos (leaderboard) |

## 🚀 Instalación y Ejecución

### Requisitos previos

- **Node.js** v18 o superior → [https://nodejs.org](https://nodejs.org)
- **npm** (viene incluido con Node.js)

### 1. Clonar el repositorio

```bash
git clone https://github.com/OsirisMlndzDev4/TRUEMATH.git
cd TRUEMATH
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo **`.env`** en la raíz del proyecto con el siguiente contenido:

```env
VITE_SUPABASE_URL=<url_proporcionada_por_el_líder>
VITE_SUPABASE_ANON_KEY=<key_proporcionada_por_el_líder>
```

> ⚠️ **IMPORTANTE:** Las keys de Supabase NO se suben al repositorio por seguridad. Pídelas al líder del equipo.

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

Se abrirá en `http://localhost:5173` (o el puerto que indique la terminal).

### 5. Build de producción (opcional)

```bash
npm run build
npm run preview
```

## 🎮 Módulos del Juego

| Módulo | Descripción |
|---|---|
| **Syntax Node** | Traduce oraciones a fórmulas de lógica simbólica. Timer de 60s por ejercicio, puntuación basada en velocidad. |
| **Truth Finder** | Resuelve tablas de verdad y clasifica fórmulas (tautología, contradicción, contingencia). Bonus por tiempo. |

## 📁 Estructura del Proyecto

```
TRUEMATH/
├── src/
│   ├── components/       # Componentes de cada módulo
│   │   ├── syntax/       # Módulo 1: Syntax Node
│   │   ├── finder/       # Módulo 2: Truth Finder
│   │   └── ui/           # Componentes reutilizables (botones, cards, etc.)
│   ├── screens/          # Pantallas principales (Home, GameOver, Leaderboard)
│   ├── data/             # Datos de ejercicios y niveles
│   ├── store/            # Estado global (Zustand)
│   ├── utils/            # Utilidades (engine de lógica, Supabase, leaderboard)
│   ├── App.jsx           # Router principal
│   ├── main.jsx          # Entry point
│   └── index.css         # Estilos globales
├── .env                  # Variables de entorno (NO se sube a Git)
├── package.json
└── vite.config.js
```

## 🔑 Notas sobre Supabase

- La app usa una tabla `scores` en Supabase para el leaderboard.
- Las keys se manejan vía variables de entorno (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`).
- RLS (Row Level Security) está activado con políticas de lectura pública e inserción limitada.
