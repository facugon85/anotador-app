import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useChinchonStore = create((set, get) => ({
  // Estado del juego
  jugadores: [
    { id: 1, nombre: 'Jugador 1', puntos: 0 },
    { id: 2, nombre: 'Jugador 2', puntos: 0 },
  ],
  historial: [],
  limitePuntos: 100,
  ganador: null,

  // Acciones para jugadores
  agregarJugador: () => {
    const { jugadores } = get();
    if (jugadores.length < 6) {
      const nuevoId = Math.max(...jugadores.map(j => j.id)) + 1;
      const nuevoJugador = {
        id: nuevoId,
        nombre: `Jugador ${nuevoId}`,
        puntos: 0
      };
      
      set(state => ({
        jugadores: [...state.jugadores, nuevoJugador]
      }));
      get().guardarEnStorage();
    }
  },

  eliminarJugador: (id) => {
    const { jugadores } = get();
    if (jugadores.length > 2) {
      set(state => ({
        jugadores: state.jugadores.filter(j => j.id !== id)
      }));
      get().guardarEnStorage();
    }
  },

  cambiarNombreJugador: (id, nuevoNombre) => {
    set(state => ({
      jugadores: state.jugadores.map(j => 
        j.id === id ? { ...j, nombre: nuevoNombre } : j
      )
    }));
    get().guardarEnStorage();
  },

  // Acciones de puntuación
  agregarPuntos: (id, puntos) => {
    const { ganador } = get();
    if (ganador && ganador.length > 0) return;

    set(state => {
      const nuevosJugadores = state.jugadores.map(j =>
        j.id === id ? { ...j, puntos: j.puntos + puntos } : j
      );

      const historialActualizado = [
        ...state.historial, 
        { tipo: 'agregarPuntos', jugadorId: id, puntos: puntos }
      ];
      
      const alguienPerdio = nuevosJugadores.some(j => j.puntos > state.limitePuntos);
      let nuevoGanador = state.ganador;

      if (alguienPerdio && !state.ganador) {
        const lowestScore = Math.min(...nuevosJugadores.map(j => j.puntos));
        const ganadores = nuevosJugadores
          .filter(j => j.puntos === lowestScore)
          .map(g => ({ ...g, chinchon: false }));
        
        nuevoGanador = ganadores;
      }

      return { 
        jugadores: nuevosJugadores,
        historial: historialActualizado,
        ganador: nuevoGanador 
      };
    });

    get().guardarEnStorage();
  },

  corte: (id) => {
    const { ganador } = get();
    if (ganador) return;

    set(state => {
      const nuevosJugadores = state.jugadores.map(j =>
        j.id === id ? { ...j, puntos: Math.max(0, j.puntos - 10) } : j // Evitar puntos negativos
      );

      const historialActualizado = [
        ...state.historial, 
        { tipo: 'corte', jugadorId: id }
      ];

      // No se verifica ganador en un corte, solo se actualizan puntos.
      return { 
        jugadores: nuevosJugadores,
        historial: historialActualizado 
      };
    });

    get().guardarEnStorage();
  },

  chinchon: (id) => {
    const { jugadores, ganador } = get();
    if (ganador && ganador.length > 0) return;

    const jugadorGanador = jugadores.find(j => j.id === id);
    if (jugadorGanador) {
      set({ ganador: [{ ...jugadorGanador, chinchon: true }] });
      get().guardarEnStorage();
    }
  },

  deshacerUltima: () => {
    const { historial, jugadores } = get();
    if (historial.length === 0) return;

    const ultimaAccion = historial[historial.length - 1];
    const nuevoHistorial = historial.slice(0, -1);

    if (ultimaAccion.tipo === 'chinchon') {
      set({ historial: nuevoHistorial, ganador: null });
      get().guardarEnStorage();
      return; 
    }

    set(state => {
      const nuevosJugadores = [...state.jugadores];
      const index = nuevosJugadores.findIndex(j => j.id === ultimaAccion.jugadorId);

      if (index !== -1) {
        if (ultimaAccion.tipo === 'agregarPuntos') {
          nuevosJugadores[index] = {
            ...nuevosJugadores[index],
            puntos: nuevosJugadores[index].puntos - ultimaAccion.puntos,
          };
        } else if (ultimaAccion.tipo === 'corte') {
          nuevosJugadores[index] = {
            ...nuevosJugadores[index],
            puntos: nuevosJugadores[index].puntos + 10,
          };
        }
      }
      
      return { 
        jugadores: nuevosJugadores, 
        historial: nuevoHistorial, 
        ganador: null 
      };
    });

    get().guardarEnStorage();
  },

  reiniciarPartida: () => {
    console.log('reiniciarPartida called in store');
    set(state => ({
      jugadores: state.jugadores.map(j => ({ ...j, puntos: 0 })),
      historial: [],
      ganador: null
    }));
    get().guardarEnStorage();
    console.log('reiniciarPartida completed');
  },

  cambiarLimite: (nuevoLimite) => {
    set({ limitePuntos: nuevoLimite });
    get().guardarEnStorage();
  },

  // Verificar ganador (YA NO SE USA DIRECTAMENTE, la lógica se movió)
  verificarGanador: () => {
    // Esta función ahora está vacía o puede ser eliminada,
    // ya que su lógica se ha integrado en agregarPuntos.
  },

  // Obtener jugadores ordenados por puntos (menor a mayor)
  getJugadoresOrdenados: () => {
    const { jugadores } = get();
    return [...jugadores].sort((a, b) => a.puntos - b.puntos);
  },

  // Persistencia
  guardarEnStorage: async () => {
    const state = get();
    try {
      await AsyncStorage.setItem('chinchonState', JSON.stringify({
        jugadores: state.jugadores,
        historial: state.historial,
        limitePuntos: state.limitePuntos,
        ganador: state.ganador
      }));
    } catch (error) {
      console.error('Error guardando estado de Chinchón:', error);
    }
  },

  cargarDesdeStorage: async () => {
    try {
      const savedState = await AsyncStorage.getItem('chinchonState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Migración para el estado de 'ganador'
        if (parsedState.ganador && !Array.isArray(parsedState.ganador)) {
          // Si 'ganador' existe pero no es un array, es el formato antiguo.
          // Lo convertimos a un array para que sea compatible.
          parsedState.ganador = [parsedState.ganador];
        }

        set(parsedState);
      }
    } catch (error) {
      console.error('Error cargando estado de Chinchón:', error);
    }
  }
})); 