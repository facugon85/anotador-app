import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store principal para manejar el estado de ambos juegos
export const useGameStore = create((set, get) => ({
  // Estado para Escoba de 15
  escobaScores: [
    { name: 'Nosotros', score: 0 },
    { name: 'Ellos', score: 0 },
  ],
  escobaPlayers: ['Nosotros', 'Ellos'],
  escobaHistory: [],
  
  // Estado para Truco
  trucoScores: [
    { name: 'Nosotros', score: 0 },
    { name: 'Ellos', score: 0 },
  ],
  trucoTeams: ['Nosotros', 'Ellos'],
  trucoHistory: [],
  trucoPlayerCount: 2, // SIEMPRE 2 por defecto
  
  // Estado específico para Truco de 6 (2 equipos de 3 jugadores)
  truco6Teams: [
    { name: 'Nosotros', score: 0, players: ['Jugador 1', 'Jugador 2', 'Jugador 3'] },
    { name: 'Ellos', score: 0, players: ['Jugador 4', 'Jugador 5', 'Jugador 6'] },
  ],
  truco6CurrentTurn: 0, // Índice del equipo que tiene el turno
  truco6Alliances: [], // Alianzas temporales entre equipos
  truco6GamePhase: 'normal', // 'normal', 'flor', 'contra-flor'
  truco6History: [],

  // Estado para Truco de 6 alternando Redondo y Pica Pica
  modoTruco: 'redondo', // 'redondo' o 'picaPica'
  rondaActual: 0, // 0 = redonda, 1 = pica pica, 2 = redonda, ...
  duelosPicaPica: [
    ['Jugador 1', 'Jugador 4'],
    ['Jugador 2', 'Jugador 5'],
    ['Jugador 3', 'Jugador 6'],
  ],

  // Acciones para Escoba
  setEscobaPlayers: (players) => {
    const newScores = players.map((player, index) => ({
      name: player,
      score: get().escobaScores[index]?.score || 0,
    }));
    
    set({
      escobaPlayers: players,
      escobaScores: newScores,
    });
    get().saveToStorage();
  },

  addEscobaPlayer: () => {
    set(state => {
      const newPlayerName = `Jugador ${state.escobaPlayers.length + 1}`;
      const newPlayers = [...state.escobaPlayers, newPlayerName];
      const newScores = [...state.escobaScores, { name: newPlayerName, score: 0 }];
      
      return {
        escobaPlayers: newPlayers,
        escobaScores: newScores,
      };
    });
    get().saveToStorage();
  },

  removeEscobaPlayer: (playerIndex) => {
    set(state => {
      if (state.escobaPlayers.length <= 2) return state; // Mínimo 2 jugadores
      
      const newPlayers = state.escobaPlayers.filter((_, index) => index !== playerIndex);
      const newScores = state.escobaScores.filter((_, index) => index !== playerIndex);
      
      return {
        escobaPlayers: newPlayers,
        escobaScores: newScores,
      };
    });
    get().saveToStorage();
  },

  addEscobaScore: (playerIndex, points) => {
    set(state => ({
      escobaScores: state.escobaScores.map((player, index) =>
        index === playerIndex
          ? { ...player, score: player.score + points }
          : player
      ),
      escobaHistory: [...state.escobaHistory, {
        playerIndex,
        points,
        timestamp: Date.now(),
      }],
    }));
    get().saveToStorage();
  },

  undoLastEscobaScore: () => {
    set(state => {
      const newHistory = [...state.escobaHistory];
      const lastAction = newHistory.pop();
      
      if (lastAction) {
        return {
          escobaScores: state.escobaScores.map((player, index) =>
            index === lastAction.playerIndex
              ? { ...player, score: Math.max(0, player.score - lastAction.points) }
              : player
          ),
          escobaHistory: newHistory,
        };
      }
      return state;
    });
    get().saveToStorage();
  },

  resetEscobaGame: () => {
    console.log('resetEscobaGame called in store');
    set(state => ({
      escobaScores: state.escobaScores.map(player => ({ ...player, score: 0 })),
      escobaHistory: [],
    }));
    get().saveToStorage();
    console.log('resetEscobaGame completed');
  },

  // Acciones para Truco
  setTrucoPlayerCount: (count) => {
    set({ trucoPlayerCount: count });
    if (count === 6) {
      set({
        truco6Teams: [
          { name: 'Nosotros', score: 0, players: ['Jugador 1', 'Jugador 2', 'Jugador 3'] },
          { name: 'Ellos', score: 0, players: ['Jugador 4', 'Jugador 5', 'Jugador 6'] },
        ],
        truco6History: [],
      });
    } else {
      set({
        trucoScores: [
          { name: count === 2 ? 'Yo' : 'Nosotros', score: 0 },
          { name: count === 2 ? 'Vos' : 'Ellos', score: 0 },
        ],
        trucoHistory: [],
      });
    }
    get().saveToStorage();
  },

  setTrucoTeams: (teams) => {
    const newScores = teams.map((team, index) => ({
      name: team,
      score: get().trucoScores[index]?.score || 0,
    }));
    
    set({
      trucoTeams: teams,
      trucoScores: newScores,
    });
    get().saveToStorage();
  },

  // Acciones específicas para Truco de 6 (2 equipos)
  setTruco6Teams: (teams) => {
    const newScores = teams.map((team, index) => ({
      ...team,
      score: get().truco6Teams[index]?.score || 0,
    }));
    
    set({
      truco6Teams: newScores,
    });
    get().saveToStorage();
  },

  setTruco6PlayerNames: (teamIndex, playerNames) => {
    set(state => ({
      truco6Teams: state.truco6Teams.map((team, index) =>
        index === teamIndex
          ? { ...team, players: playerNames }
          : team
      ),
    }));
    get().saveToStorage();
  },

  setTruco6TeamName: (teamIndex, name) => {
    set(state => ({
      truco6Teams: state.truco6Teams.map((team, index) =>
        index === teamIndex
          ? { ...team, name }
          : team
      ),
    }));
    get().saveToStorage();
  },

  nextTruco6Turn: () => {
    set(state => ({
      truco6CurrentTurn: (state.truco6CurrentTurn + 1) % 2, // Solo 2 equipos
    }));
    get().saveToStorage();
  },

  setTruco6Turn: (teamIndex) => {
    set({ truco6CurrentTurn: teamIndex });
    get().saveToStorage();
  },

  addTruco6Score: (teamIndex, points, type = 'normal') => {
    set(state => {
      const newTeams = state.truco6Teams.map((team, index) =>
        index === teamIndex
          ? { ...team, score: team.score + points }
          : team
      );

      const newHistory = [...state.truco6History, {
        teamIndex,
        points,
        type,
        timestamp: Date.now(),
        turn: state.truco6CurrentTurn,
      }];

      return {
        truco6Teams: newTeams,
        truco6History: newHistory,
      };
    });
    get().saveToStorage();
  },

  addTruco6Flor: (teamIndex) => {
    set(state => {
      const florPoints = 3;
      const newTeams = state.truco6Teams.map((team, index) =>
        index === teamIndex
          ? { ...team, score: team.score + florPoints }
          : team
      );

      const newHistory = [...state.truco6History, {
        teamIndex,
        points: florPoints,
        type: 'flor',
        timestamp: Date.now(),
        turn: state.truco6CurrentTurn,
      }];

      return {
        truco6Teams: newTeams,
        truco6History: newHistory,
        truco6GamePhase: 'flor',
      };
    });
    get().saveToStorage();
  },

  addTruco6ContraFlor: (teamIndex) => {
    set(state => {
      const contraFlorPoints = 6;
      const newTeams = state.truco6Teams.map((team, index) =>
        index === teamIndex
          ? { ...team, score: team.score + contraFlorPoints }
          : team
      );

      const newHistory = [...state.truco6History, {
        teamIndex,
        points: contraFlorPoints,
        type: 'contra-flor',
        timestamp: Date.now(),
        turn: state.truco6CurrentTurn,
      }];

      return {
        truco6Teams: newTeams,
        truco6History: newHistory,
        truco6GamePhase: 'contra-flor',
      };
    });
    get().saveToStorage();
  },

  addTruco6Envido: (teamIndex, points) => {
    set(state => {
      const newTeams = state.truco6Teams.map((team, index) =>
        index === teamIndex
          ? { ...team, score: team.score + points }
          : team
      );

      const newHistory = [...state.truco6History, {
        teamIndex,
        points,
        type: 'envido',
        timestamp: Date.now(),
        turn: state.truco6CurrentTurn,
      }];

      return {
        truco6Teams: newTeams,
        truco6History: newHistory,
      };
    });
    get().saveToStorage();
  },

  addTruco6FaltaEnvido: (teamIndex) => {
    set(state => {
      const singingTeamScore = state.truco6Teams[teamIndex].score;
      const opponentIndex = teamIndex === 0 ? 1 : 0;
      const opponentScore = state.truco6Teams[opponentIndex].score;
      const maxScore = 30;
      // Falta Envido: suma los puntos que le faltan al rival para llegar al máximo
      const points = maxScore - Math.max(singingTeamScore, opponentScore);
      const newTeams = state.truco6Teams.map((team, index) =>
        index === teamIndex
          ? { ...team, score: team.score + points }
          : team
      );
      const newHistory = [...state.truco6History, {
        teamIndex,
        points,
        type: 'falta-envido',
        timestamp: Date.now(),
        turn: state.truco6CurrentTurn,
      }];
      return {
        truco6Teams: newTeams,
        truco6History: newHistory,
      };
    });
    get().saveToStorage();
  },

  undoLastTruco6Score: () => {
    set(state => {
      const newHistory = [...state.truco6History];
      const lastAction = newHistory.pop();
      
      if (lastAction) {
        return {
          truco6Teams: state.truco6Teams.map((team, index) =>
            index === lastAction.teamIndex
              ? { ...team, score: Math.max(0, team.score - lastAction.points) }
              : team
          ),
          truco6History: newHistory,
          truco6GamePhase: lastAction.type === 'flor' || lastAction.type === 'contra-flor' ? 'normal' : state.truco6GamePhase,
        };
      }
      return state;
    });
    get().saveToStorage();
  },

  resetTruco6Game: () => {
    set(state => ({
      truco6Teams: state.truco6Teams.map(team => ({ ...team, score: 0 })),
      truco6History: [],
      truco6CurrentTurn: 0,
      truco6GamePhase: 'normal',
      truco6Alliances: [],
    }));
    get().saveToStorage();
  },

  addFaltaEnvido: (teamIndex) => {
    set(state => {
      const singingTeamScore = state.trucoScores[teamIndex].score;
      const opponentIndex = teamIndex === 0 ? 1 : 0;
      const opponentScore = state.trucoScores[opponentIndex].score;
      const maxScore = 30;
      // Falta Envido: suma los puntos que le faltan al rival para llegar al máximo
      const points = maxScore - Math.max(singingTeamScore, opponentScore);
      const trucoScores = state.trucoScores.map((team, index) =>
        index === teamIndex
          ? { ...team, score: team.score + points }
          : team
      );
      const trucoHistory = [...state.trucoHistory, {
        teamIndex,
        points,
        type: 'falta-envido',
        timestamp: Date.now(),
      }];
      return { trucoScores, trucoHistory };
    });
    get().saveToStorage();
  },

  addTrucoScore: (teamIndex, points) => {
    set(state => ({
      trucoScores: state.trucoScores.map((team, index) =>
        index === teamIndex
          ? { ...team, score: team.score + points }
          : team
      ),
      trucoHistory: [...state.trucoHistory, {
        teamIndex,
        points,
        timestamp: Date.now(),
      }],
    }));
    get().saveToStorage();
  },

  undoLastTrucoScore: () => {
    set(state => {
      const newHistory = [...state.trucoHistory];
      const lastAction = newHistory.pop();
      
      if (lastAction) {
        return {
          trucoScores: state.trucoScores.map((team, index) =>
            index === lastAction.teamIndex
              ? { ...team, score: Math.max(0, team.score - lastAction.points) }
              : team
          ),
          trucoHistory: newHistory,
        };
      }
      return state;
    });
    get().saveToStorage();
  },

  resetTrucoGame: () => {
    console.log('resetTrucoGame called in store');
    set(state => ({
      trucoScores: state.trucoScores.map(team => ({ ...team, score: 0 })),
      trucoHistory: [],
    }));
    get().saveToStorage();
    console.log('resetTrucoGame completed');
  },

  // Persistencia con AsyncStorage
  saveToStorage: async () => {
    const state = get();
    try {
      await AsyncStorage.setItem('gameState', JSON.stringify({
        escobaScores: state.escobaScores,
        escobaPlayers: state.escobaPlayers,
        escobaHistory: state.escobaHistory,
        trucoScores: state.trucoScores,
        trucoTeams: state.trucoTeams,
        trucoHistory: state.trucoHistory,
        trucoPlayerCount: state.trucoPlayerCount,
        truco6Teams: state.truco6Teams,
        truco6CurrentTurn: state.truco6CurrentTurn,
        truco6Alliances: state.truco6Alliances,
        truco6GamePhase: state.truco6GamePhase,
        truco6History: state.truco6History,
        modoTruco: state.modoTruco,
        rondaActual: state.rondaActual,
        duelosPicaPica: state.duelosPicaPica,
      }));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  loadFromStorage: async () => {
    try {
      const savedState = await AsyncStorage.getItem('gameState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        set(parsedState);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },

  setModoTruco: (modo) => set({ modoTruco: modo }),
  avanzarMano: () => {
    const state = get();
    const puntosA = state.truco6Teams[0]?.score || 0;
    const puntosB = state.truco6Teams[1]?.score || 0;
    if (puntosA < 25 && puntosB < 25) {
      const nextRonda = state.rondaActual + 1;
      set({
        modoTruco: nextRonda % 2 === 0 ? 'picaPica' : 'redondo',
        rondaActual: nextRonda,
      });
    } else {
      set({ modoTruco: 'redondo' });
    }
  },
  setDuelosPicaPica: (duelos) => set({ duelosPicaPica: duelos }),
  calcularFaltaEnvido: () => {
    const state = get();
    return state.modoTruco === 'picaPica' ? 6 : (/* lógica normal aquí */ 30 - Math.max(state.truco6Teams[0]?.score || 0, state.truco6Teams[1]?.score || 0));
  },
})); 