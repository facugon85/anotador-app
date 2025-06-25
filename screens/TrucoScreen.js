import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  Platform,
  Modal,
  Animated,
  Switch,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import PlayerCard from '../components/PlayerCard';
import ScoreButton from '../components/ScoreButton';
import ScoringModal from '../components/ScoringModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Undo2, RefreshCw, Settings, Shield, Zap, Plus, X, Minus, Users, Flower, Crown, ArrowLeft, UserPlus } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Paleta homogénea
const BG = '#181818';
const CARD_BG = '#232323';
const BORDER = '#bbff01';
const ICON = '#bbff01';
const TITLE = '#fff';
const SUBTITLE = '#bdbdbd';
const BUTTON_YELLOW = '#ffe600';
const BUTTON_TEXT = '#111';

export default function TrucoScreen({ navigation }) {
  const {
    trucoScores,
    addTrucoScore: addScore,
    undoLastTrucoScore,
    resetTrucoGame,
    setTrucoTeams,
    trucoTeams,
    addFaltaEnvido,
    trucoPlayerCount,
    setTrucoPlayerCount,
    truco6Teams,
    truco6GamePhase,
    addTruco6Score,
    addTruco6Flor,
    addTruco6ContraFlor,
    addTruco6Envido,
    addTruco6FaltaEnvido,
    undoLastTruco6Score,
    resetTruco6Game,
    setTruco6Teams,
    setTruco6PlayerNames,
    setTruco6TeamName,
    nextTruco6Turn,
    setTruco6Turn,
  } = useGameStore();
  
  const [editing, setEditing] = useState(false);
  const [teamNames, setTeamNames] = useState([...trucoTeams]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);
  const [isResetModalVisible, setResetModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const [editing6Teams, setEditing6Teams] = useState([
    { name: truco6Teams[0]?.name || 'Nosotros', players: truco6Teams[0]?.players || ['Jugador 1', 'Jugador 2', 'Jugador 3'] },
    { name: truco6Teams[1]?.name || 'Ellos', players: truco6Teams[1]?.players || ['Jugador 4', 'Jugador 5', 'Jugador 6'] },
  ]);

  const [florEnabled, setFlorEnabled] = useState(false);

  useEffect(() => {
    setEditing6Teams([
      { name: truco6Teams[0]?.name || 'Nosotros', players: truco6Teams[0]?.players || ['Jugador 1', 'Jugador 2', 'Jugador 3'] },
      { name: truco6Teams[1]?.name || 'Ellos', players: truco6Teams[1]?.players || ['Jugador 4', 'Jugador 5', 'Jugador 6'] },
    ]);
    setTeamNames([...trucoTeams]);
  }, [trucoTeams, truco6Teams]);

  const MAX_SCORE = 30;
  
  const currentTeams = trucoPlayerCount === 6 ? truco6Teams.slice(0, 2) : trucoScores;
  const winner = currentTeams.find((team) => team.score >= MAX_SCORE);

  const { leader, last } = useMemo(() => {
    if (currentTeams.length < 2) return { leader: null, last: null };
    const sorted = [...currentTeams].sort((a, b) => b.score - a.score);
    return {
      leader: sorted[0],
      last: sorted[sorted.length - 1],
    };
  }, [currentTeams]);
  
  useEffect(() => {
    if (winner) {
      setModalVisible(false);
      showConfettiAnimation();
      Alert.alert('¡Fin del Juego!', `¡${winner.name} ha ganado la partida!`, [
        { text: 'Nueva Partida', onPress: () => setResetModalVisible(true), style: 'destructive' },
        { text: 'OK', style: 'cancel' },
      ]);
    }
  }, [winner]);

  const showConfettiAnimation = () => {
    setShowConfetti(true);
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideConfettiAnimation = () => {
    Animated.timing(confettiAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowConfetti(false);
    });
  };

  const handleReset = () => {
    setResetModalVisible(true);
    hideConfettiAnimation();
  };

  const openEditModal = () => {
    setEditing(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeEditModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setEditing(false);
    });
  };

  const handleSave = () => {
    if (trucoPlayerCount === 6) {
      const isValid = editing6Teams.every(team => 
        team.name.trim() && team.players.every(player => player.trim())
      );
      
      if (isValid) {
        setTruco6Teams(editing6Teams);
        closeEditModal();
      } else {
        Alert.alert('Error', 'Todos los equipos y jugadores deben tener nombres');
      }
    } else {
      if (teamNames[0].trim() && teamNames[1].trim()) {
        setTrucoTeams(teamNames);
        closeEditModal();
      } else {
        Alert.alert('Error', 'Los nombres de los equipos no pueden estar vacíos');
      }
    }
  };

  const handleOpenModal = (index) => {
    if (winner) return;
    setSelectedTeamIndex(index);
    setModalVisible(true);
  };

  const selectedTeam = selectedTeamIndex !== null 
    ? (trucoPlayerCount === 6
        ? { ...truco6Teams[selectedTeamIndex], index: selectedTeamIndex }
        : { ...trucoScores[selectedTeamIndex], index: selectedTeamIndex })
    : null;

  const getModalButtons = () => {
    if (!selectedTeam) return [];

    const baseButtons = [
      { label: '+1 Punto', onPress: () => {
        if (trucoPlayerCount === 6) {
          addTruco6Score(selectedTeam.index, 1);
        } else {
          addScore(selectedTeam.index, 1);
        }
      }, variant: 'secondary', icon: <Plus size={18} color="white"/> },
      { label: '-1 Punto', onPress: () => {
        if (trucoPlayerCount === 6) {
          if (selectedTeam.score > 0) addTruco6Score(selectedTeam.index, -1);
        } else {
          if (selectedTeam.score > 0) addScore(selectedTeam.index, -1);
        }
      }, variant: 'danger', icon: <Minus size={18} color="white"/>, disabled: selectedTeam.score === 0 },
    ];

    if (trucoPlayerCount === 6 && florEnabled) {
      return [
        { label: 'Flor (3)', onPress: () => addTruco6Flor(selectedTeam.index), icon: <Flower size={18} color="white"/>, variant: 'secondary' },
        { label: 'Contra Flor (6)', onPress: () => addTruco6ContraFlor(selectedTeam.index), icon: <Flower size={18} color="white"/>, variant: 'secondary' },
        { label: 'Envido (2)', onPress: () => addTruco6Envido(selectedTeam.index, 2), icon: <Shield size={18} color="white"/> },
        { label: 'Real Envido (3)', onPress: () => addTruco6Envido(selectedTeam.index, 3), icon: <Shield size={18} color="white"/> },
        { label: 'Falta Envido', onPress: () => addTruco6FaltaEnvido(selectedTeam.index), icon: <Shield size={18} color="white"/>, variant: 'secondary' },
        { label: 'Falta Envido (Pica Pica) (6)', onPress: () => addTruco6Score(selectedTeam.index, 6), icon: <Shield size={18} color="white"/>, variant: 'secondary' },
        { label: 'Truco (2)', onPress: () => addTruco6Score(selectedTeam.index, 2), icon: <Zap size={18} color="white"/> },
        { label: 'Retruco (3)', onPress: () => addTruco6Score(selectedTeam.index, 3), icon: <Zap size={18} color="white"/> },
        { label: 'Vale Cuatro (4)', onPress: () => addTruco6Score(selectedTeam.index, 4), icon: <Zap size={18} color="white"/> },
        ...baseButtons,
      ];
    } else if (trucoPlayerCount === 6) {
      return [
        { label: 'Envido (2)', onPress: () => addTruco6Envido(selectedTeam.index, 2), icon: <Shield size={18} color="white"/> },
        { label: 'Real Envido (3)', onPress: () => addTruco6Envido(selectedTeam.index, 3), icon: <Shield size={18} color="white"/> },
        { label: 'Falta Envido', onPress: () => addTruco6FaltaEnvido(selectedTeam.index), icon: <Shield size={18} color="white"/>, variant: 'secondary' },
        { label: 'Falta Envido (Pica Pica) (6)', onPress: () => addTruco6Score(selectedTeam.index, 6), icon: <Shield size={18} color="white"/>, variant: 'secondary' },
        { label: 'Truco (2)', onPress: () => addTruco6Score(selectedTeam.index, 2), icon: <Zap size={18} color="white"/> },
        { label: 'Retruco (3)', onPress: () => addTruco6Score(selectedTeam.index, 3), icon: <Zap size={18} color="white"/> },
        { label: 'Vale Cuatro (4)', onPress: () => addTruco6Score(selectedTeam.index, 4), icon: <Zap size={18} color="white"/> },
        ...baseButtons,
      ];
    } else {
      return [
        { label: 'Envido (2)', onPress: () => addScore(selectedTeam.index, 2), icon: <Shield size={18} color="white"/> },
        { label: 'Real Envido (3)', onPress: () => addScore(selectedTeam.index, 3), icon: <Shield size={18} color="white"/> },
        { label: 'Falta Envido', onPress: () => addFaltaEnvido(selectedTeam.index), icon: <Shield size={18} color="white"/>, variant: 'secondary' },
        { label: 'Truco (2)', onPress: () => addScore(selectedTeam.index, 2), icon: <Zap size={18} color="white"/> },
        { label: 'Retruco (3)', onPress: () => addScore(selectedTeam.index, 3), icon: <Zap size={18} color="white"/> },
        { label: 'Vale Cuatro (4)', onPress: () => addScore(selectedTeam.index, 4), icon: <Zap size={18} color="white"/> },
        ...baseButtons,
      ];
    }
  };

  const modalButtons = getModalButtons().map(btn => ({ ...btn, disabled: !!winner }));

  const getTrucoDescription = () => (florEnabled ? 'Con Flor' : 'Sin Flor');

  const handleUndo = () => {
    if (trucoPlayerCount === 6) {
      undoLastTruco6Score();
    } else {
      undoLastTrucoScore();
    }
  };

  const handleResetGame = () => {
    if (trucoPlayerCount === 6) {
      resetTruco6Game();
    } else {
      resetTrucoGame();
    }
  };

  const EditPanel = () => (
    <Modal
      visible={editing}
      transparent={true}
      onRequestClose={closeEditModal}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View style={[
          styles.modalContent,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              })
            }]
          }
        ]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajustes</Text>
            <TouchableOpacity onPress={closeEditModal} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalList} contentContainerStyle={{paddingBottom: 32, paddingTop: 8, paddingHorizontal: 16}}>
            <Text style={[styles.sectionTitle, {marginBottom: 18, marginTop: 4}]}>Número de Jugadores</Text>
            <View style={[styles.playerCountContainer, {marginBottom: 28}]}> 
              {[2, 4, 6].map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.playerCountButton,
                    trucoPlayerCount === count && styles.playerCountButtonActive,
                    { marginHorizontal: 4 }
                  ]}
                  onPress={() => setTrucoPlayerCount(count)}
                >
                  <Users size={20} color={trucoPlayerCount === count ? "#232323" : "#bbff01"} />
                  <Text style={[
                    styles.playerCountText,
                    trucoPlayerCount === count && styles.playerCountTextActive
                  ]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
              <Text style={{ color: '#d4d4d4', fontSize: 16, marginRight: 12 }}>Habilitar Flor</Text>
              <Switch
                value={florEnabled}
                onValueChange={setFlorEnabled}
                thumbColor={florEnabled ? '#84cc16' : '#ccc'}
                trackColor={{ false: '#52525b', true: '#a3e635' }}
              />
            </View>
            <ScoreButton label="Guardar Cambios" onPress={handleSave} style={[styles.saveButton, {marginTop: 16, marginBottom: 8, marginHorizontal: 0}]} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  let equipos;
  if (trucoPlayerCount === 2) {
    equipos = [
      { name: 'Yo', score: trucoScores[0]?.score || 0 },
      { name: 'Vos', score: trucoScores[1]?.score || 0 },
    ];
  } else if (trucoPlayerCount === 6) {
    equipos = truco6Teams.map((team, index) => ({ ...team, index }));
  } else {
    equipos = [
      { name: 'Nosotros', score: trucoScores[0]?.score || 0, index: 0 },
      { name: 'Ellos', score: trucoScores[1]?.score || 0, index: 1 },
    ];
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {showConfetti && !isModalVisible && (
        <Animated.View 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 999,
            opacity: confettiAnim
          }} 
          pointerEvents="box-none"
        >
          <ConfettiCannon
            count={200}
            origin={{ x: 0, y: 0 }}
            explosionSpeed={500}
            fallSpeed={4000}
            fadeOut={true}
            colors={['#ff3d5a', '#ffe600', '#7bb420', '#00cfff', '#bb86fc', '#fff']}
            onAnimationEnd={hideConfettiAnimation}
          />
        </Animated.View>
      )}
      <EditPanel />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Truco</Text>
            <Text style={styles.subtitle}>{getTrucoDescription()}</Text>
            <Text style={styles.subtitle}>A {MAX_SCORE} puntos</Text>
          </View>
          <TouchableOpacity onPress={openEditModal} style={styles.settingsButton}>
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          {equipos.map((team, index) => (
            <PlayerCard
              key={index}
              name={team.name}
              score={team.score}
              isWinner={winner?.name === team.name}
              isLeading={leader?.name === team.name}
              isLast={last?.name === team.name && equipos.length > 1}
              maxScore={MAX_SCORE}
              onPress={() => handleOpenModal(team.index ?? index)}
              gameType="truco"
              playerCount={trucoPlayerCount}
              isCurrentTurn={trucoPlayerCount === 6}
              players={trucoPlayerCount === 6 ? team.players : undefined}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.buttonRow}>
          <ScoreButton label="Volver" onPress={() => navigation.navigate('Home')} variant="black" icon={<ArrowLeft size={20} color="white"/>} style={[styles.bottomButton, { backgroundColor: '#232323' }]} />
          <ScoreButton label="Reiniciar" onPress={handleReset} variant="danger" icon={<RefreshCw size={20} color="white"/>} style={styles.bottomButton} />
        </View>
      </View>

      <ScoringModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        player={selectedTeam}
        buttons={modalButtons}
      />

      <ConfirmationModal
        isVisible={isResetModalVisible}
        onClose={() => setResetModalVisible(false)}
        onConfirm={handleResetGame}
        title="Nueva Partida"
        message="¿Estás seguro de que quieres reiniciar la partida? Se perderán todos los puntos."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingBottom: 120,
    padding: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: SUBTITLE,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  settingsButton: {
    backgroundColor: '#232323',
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamCard: {
    backgroundColor: CARD_BG,
    borderWidth: 2,
    borderColor: BORDER,
    borderRadius: 16,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  teamName: {
    color: TITLE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  score: {
    color: BORDER,
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressBar: {
    backgroundColor: BORDER,
    height: 18,
    borderRadius: 12,
  },
  progressContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 8,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: BORDER,
    fontWeight: 'bold',
    fontSize: 18,
  },
  resetButton: {
    borderColor: '#ff3d3d',
  },
  resetButtonText: {
    color: '#ff3d3d',
  },
  helpButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  helpButtonText: {
    color: BORDER,
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#181818',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  rulesButtonContainer: {
    alignItems: 'center',
  },
  rulesButton: {
    backgroundColor: '#302f2c', // Gris oscuro cálido
    borderColor: '#00FF00', // Verde neón
    borderWidth: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(48, 47, 44, 0.9)', // Gris oscuro cálido con transparencia
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    marginTop: 'auto',
    marginBottom: 50,
    borderWidth: 2,
    borderColor: '#444',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  closeButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: '#bbff01',
    borderRadius: 16,
    backgroundColor: '#232323',
  },
  modalList: {
    padding: 0,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
  },
  playerCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  playerCountButton: {
    backgroundColor: '#232323',
    borderWidth: 2,
    borderColor: '#bbff01',
    borderRadius: 16,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
  },
  playerCountButtonActive: {
    backgroundColor: '#bbff01',
    borderColor: '#bbff01',
  },
  playerCountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  playerCountTextActive: {
    color: '#232323',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#7bb420',
    borderColor: '#7bb420',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  addPlayerButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addPlayerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  playerInput: {
    backgroundColor: '#181818',
    color: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    fontSize: 18,
    flex: 1,
    borderWidth: 2,
    borderColor: '#444',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 2,
  },
  minusCircle: {
    backgroundColor: '#232323',
    borderRadius: 50,
    padding: 8,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 