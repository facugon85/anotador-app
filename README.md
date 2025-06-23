# Anotador 🃏

Una aplicación móvil y web para llevar el control de puntos en juegos de cartas clásicos: **Truco**, **Chinchón** y **Escoba de 15**. Pensada para ser rápida, visual, fácil de usar y con soporte para múltiples plataformas.

---

## 🚀 ¿Qué es Anotador?

Anotador es una app para anotar partidas de Truco, Chinchón y Escoba de 15, con interfaz moderna, animaciones, indicadores visuales y soporte para compartir y guardar partidas. Ideal para reuniones con amigos y familia.

---

## 📲 ¿Cómo usar?

1. **Descarga o abre la app web:**
   - [Versión web (GitHub Pages)](https://facugon85.github.io/anotador-app/)
   - O clona el repo y ejecuta `npm install && npm run web` para desarrollo local.
2. **Selecciona un juego** en la pantalla principal.
3. **Agrega los jugadores/equipos** y comienza a sumar puntos.
4. **Usa los botones de deshacer y reiniciar** para controlar la partida.
5. **¡Disfruta las animaciones y el confetti cuando alguien gana!**

---

## ✨ Features principales

- Soporte para Truco, Chinchón y Escoba de 15
- Animaciones de confetti al ganar
- Indicadores visuales de peligro y victoria
- Modal de edición de equipos/jugadores en cada juego
- Responsive: funciona en móvil y web
- Temas oscuros y colores llamativos
- Roadmap y feedback visible para usuarios

---

## 🛣️ Roadmap (lo que se viene)

- Cuentas de usuario (guardar progreso y estadísticas en la nube)
- Versión PWA (instalable desde el navegador)
- App nativa para iOS y Android
- Nuevos juegos: Póker, Burako
- Estadísticas avanzadas y gráficos
- Temas personalizables

---

## 📝 Bitácora de cambios

### v1.2.0 (2024-06-XX)
- Animación de confetti para todos los juegos
- Barra de progreso dinámica en Chinchón (verde → amarillo → naranja → rojo)
- Icono de calavera para el perdedor
- Modal de edición de equipos/jugadores mejorado
- Número de versión visible en pantalla principal
- Mejoras visuales y de UX en navegación y transiciones
- Roadmap y mensaje de apoyo en el modal

### v1.1.0 (2024-05-XX)
- Nuevo juego: Escoba de 15
- Mejoras en la edición de equipos
- Indicadores visuales para el líder y el último
- Corrección de bugs menores

### v1.0.0 (2024-05-XX)
- Lanzamiento inicial
- Soporte para Truco y Chinchón
- Animaciones básicas
- Modal de edición de equipos
- Diseño oscuro y responsive

---

## 👨‍💻 Autor

Hecho con ❤️ por [Cufa](https://facugon85.github.io/dev_cv/#)

¿Ideas, sugerencias o bugs? ¡Abrí un issue o contactame!

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