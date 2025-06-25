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

  addFaltaEnvido: (teamIndex) => {
    set(state => {
      const singingTeamScore = state.trucoScores[teamIndex].score;
      const opponentIndex = teamIndex === 0 ? 1 : 0;
      const opponentScore = state.trucoScores[opponentIndex].score;

      let points;
      // Si el que canta está en las "malas"
      if (singingTeamScore < 15) {
        points = 15 - singingTeamScore;
      } 
      // Si el que canta está en las "buenas"
      else {
        points = 30 - singingTeamScore;
      }
      
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
  }
})); 