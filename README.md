# Anotador 🃏

Una aplicación móvil para llevar el control de puntos en juegos de cartas clásicos: **Escoba de 15** y **Truco**.

## 🎮 Características

### Escoba de 15
- Soporte para 2-4 jugadores
- Botones para sumar puntos por escobas, siete de oro y cartas
- Detección automática del ganador (primer jugador en llegar a 15)
- Barra de progreso visual

### Truco
- Dos equipos
- Botones para Envido (1 punto), Truco (3 puntos) y Retruco (6 puntos)
- Puntuación hasta 30 puntos
- Detección automática del ganador

### Funcionalidades Comunes
- ✅ Botón para deshacer último punto
- ✅ Botón para reiniciar partida
- ✅ Animaciones sutiles al sumar puntos
- ✅ Persistencia local con AsyncStorage
- ✅ Interfaz intuitiva y accesible

## 🏗️ Arquitectura del Proyecto

```
cartas-counter/
├── App.js                 # Punto de entrada principal
├── package.json           # Dependencias del proyecto
├── app.json              # Configuración de Expo
├── README.md             # Este archivo
├── screens/              # Pantallas de la aplicación
│   ├── HomeScreen.js     # Pantalla de inicio
│   ├── EscobaScreen.js   # Pantalla de Escoba de 15
│   └── TrucoScreen.js    # Pantalla de Truco
├── components/           # Componentes reutilizables
│   ├── ScoreButton.js    # Botón de puntaje con animación
│   └── PlayerScore.js    # Componente de puntaje de jugador
├── store/                # Manejo de estado global
│   └── gameStore.js      # Store principal con Zustand
└── assets/               # Recursos (imágenes, sonidos, etc.)
```

## 🛠️ Stack Tecnológico

- **React Native** con **Expo** - Framework de desarrollo móvil
- **Zustand** - Manejo de estado global (más simple que Redux)
- **React Navigation** - Navegación entre pantallas
- **AsyncStorage** - Persistencia local de datos
- **JavaScript puro** - Sin TypeScript por simplicidad

## 📱 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI: `npm install -g @expo/cli`

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd cartas-counter
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el proyecto**
   ```bash
   npm start
   ```

4. **Ejecutar en dispositivo/emulador**
   - Escanear el código QR con la app Expo Go (Android/iOS)
   - Presionar `a` para Android
   - Presionar `i` para iOS

## 🎯 Cómo Usar la App

### Pantalla de Inicio
- Selecciona entre "Escoba de 15" o "Truco"
- Los botones tienen colores temáticos (marrón para Escoba, rojo para Truco)

### Escoba de 15
1. **Configuración inicial:**
   - Selecciona el número de jugadores (2-4)
   - Ingresa los nombres de los jugadores
   - Presiona "Comenzar Partida"

2. **Durante el juego:**
   - Usa los botones para sumar puntos:
     - **Escoba**: +1 punto
     - **Siete de Oro**: +7 puntos
     - **Cartas**: +1 punto
   - El botón "↶ Deshacer" resta 1 punto
   - "Reiniciar Partida" resetea todos los puntajes

### Truco
1. **Configuración inicial:**
   - Ingresa los nombres de ambos equipos
   - Presiona "Comenzar Partida"

2. **Durante el juego:**
   - Usa los botones para sumar puntos:
     - **Envido**: +1 punto
     - **Truco**: +3 puntos
     - **Retruco**: +6 puntos
   - El botón "↶ Deshacer" resta 1 punto
   - "Reiniciar Partida" resetea todos los puntajes

## 🔧 Explicación del Código

### Store (Zustand) - `store/gameStore.js`
```javascript
// Estructura del estado global
{
  escoba: {
    players: [],        // Array de nombres de jugadores
    scores: {},         // Objeto con puntajes por jugador
    gameHistory: [],    // Historial de partidas (futuro)
    currentGame: null   // Partida actual (futuro)
  },
  truco: {
    team1: { name: 'Equipo 1', score: 0 },
    team2: { name: 'Equipo 2', score: 0 },
    gameHistory: [],
    currentGame: null
  }
}
```

**Ventajas de Zustand:**
- Sintaxis simple y directa
- No requiere providers ni context
- Actualizaciones automáticas en componentes
- Menos boilerplate que Redux

### Componentes Reutilizables

**ScoreButton** - Botón de puntaje con animación:
- Propiedades: `title`, `points`, `onPress`, `color`, `size`
- Animación de escala al presionar
- Diferentes tamaños (small, medium, large)

**PlayerScore** - Visualización de puntaje:
- Muestra nombre, puntaje y barra de progreso
- Indicador de ganador cuando se alcanza el puntaje máximo
- Colores temáticos por juego

### Navegación
- **Stack Navigator** para navegación entre pantallas
- Headers personalizados con colores temáticos
- Navegación fluida entre Home → Escoba/Truco

### Persistencia
- **AsyncStorage** guarda automáticamente el estado
- Se carga al iniciar la app
- Mantiene configuración de jugadores/equipos

## 🎨 Diseño y UX

### Paleta de Colores
- **Escoba**: Marrón (#8B4513) - inspirado en cartas españolas
- **Truco**: Rojo (#DC143C) - color de cartas españolas
- **Fondo**: Gris claro (#f5f5f5) - limpio y legible
- **Ganador**: Dorado (#FFD700) - destacado especial

### Principios de Diseño
- **Botones grandes** para fácil toque durante partidas
- **Contraste alto** para legibilidad
- **Espaciado generoso** para evitar toques accidentales
- **Feedback visual** con animaciones sutiles

## 🚀 Escalabilidad

### Para Agregar Nuevos Juegos
1. Crear nueva pantalla en `/screens`
2. Agregar estado en `gameStore.js`
3. Actualizar navegación en `App.js`
4. Crear componentes específicos si es necesario

### Para Agregar Funcionalidades
- **Historial**: Usar `gameHistory` arrays en el store
- **Sonidos**: Integrar `expo-av` para audio
- **Compartir**: Usar `expo-sharing` para WhatsApp
- **Tema oscuro**: Implementar con `useColorScheme`

### Para Mejorar Performance
- Implementar `React.memo` en componentes
- Usar `useCallback` para funciones
- Optimizar re-renders con selectores específicos

## 📋 Próximas Funcionalidades

- [ ] Historial de partidas
- [ ] Compartir resultados por WhatsApp
- [ ] Sonidos de juego ("¡Truco!", "¡Quiero!")
- [ ] Modo oscuro
- [ ] Estadísticas de jugadores
- [ ] Configuración de puntaje máximo personalizado

## 🤝 Contribución

El proyecto está diseñado para ser fácilmente extensible. Cada componente y función está documentada y modularizada para facilitar futuras mejoras.

---

**¡Disfruta contando puntos en tus partidas de cartas! 🃏✨** 