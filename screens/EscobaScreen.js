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
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import PlayerCard from '../components/PlayerCard';
import ScoreButton from '../components/ScoreButton';
import ScoringModal from '../components/ScoringModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Undo2, RefreshCw, Settings, Trophy, Star, Medal, GitBranch, X, Minus, UserPlus, ArrowLeft } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function EscobaScreen({ navigation }) {
  const {
    escobaScores,
    addEscobaScore,
    undoLastEscobaScore,
    resetEscobaGame,
    setEscobaPlayers,
    escobaPlayers,
    addEscobaPlayer,
    removeEscobaPlayer,
  } = useGameStore();

  const [editing, setEditing] = useState(false);
  const [playerNames, setPlayerNames] = useState([...escobaPlayers]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [isResetModalVisible, setResetModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiShown, setConfettiShown] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!editing) {
      setPlayerNames([...escobaPlayers]);
    }
  }, [escobaPlayers, editing]);
  
  const MAX_SCORE = 15;
  const winner = escobaScores.find((score) => score.score >= MAX_SCORE);
  
  const { leader, last } = useMemo(() => {
    if (escobaScores.length < 2) return { leader: null, last: null };
    const sorted = [...escobaScores].sort((a, b) => b.score - a.score);
    return {
      leader: sorted[0],
      last: sorted[sorted.length - 1],
    };
  }, [escobaScores]);

  useEffect(() => {
    if (winner && !confettiShown) {
      setModalVisible(false);
      showConfettiAnimation();
      setConfettiShown(true);
      Alert.alert('¡Fin del Juego!', `¡${winner.name} ha ganado la partida!`, [
        { text: 'Nueva Partida', onPress: () => setResetModalVisible(true), style: 'destructive' },
        { text: 'OK', style: 'cancel' },
      ]);
    }
  }, [winner, confettiShown]);

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
    setConfettiShown(false);
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
    if (playerNames.every(name => name.trim())) {
      setEscobaPlayers(playerNames);
      closeEditModal();
    } else {
      Alert.alert('Error', 'Todos los nombres de jugadores deben estar completos');
    }
  };

  const handleOpenModal = (index) => {
    setSelectedPlayerIndex(index);
    setModalVisible(true);
  };
  
  const selectedPlayer = selectedPlayerIndex !== null 
    ? { ...escobaScores[selectedPlayerIndex], index: selectedPlayerIndex } 
    : null;

  const modalButtons = selectedPlayer ? [
    { label: 'Escoba', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Medal size={18} color="#bbff01"/> },
    { label: 'Cartas', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Star size={18} color="#bbff01"/> },
    { label: 'Oros', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Star size={18} color="#bbff01"/> },
    { label: 'Setenta', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Star size={18} color="#bbff01"/> },
    { label: '7 de Oro', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Star size={18} color="#bbff01"/> },
    { label: '-1', onPress: () => addEscobaScore(selectedPlayer.index, -1), icon: null, variant: 'danger', disabled: selectedPlayer.score <= 0 },
  ] : [];

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
            <TouchableOpacity onPress={closeEditModal} style={[styles.closeButton, { backgroundColor: '#232323', borderWidth: 2, borderColor: '#bbff01', borderRadius: 16, padding: 8, alignItems: 'center', justifyContent: 'center' }] }>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalList}>
            <Text style={styles.sectionTitle}>Jugadores</Text>
            {playerNames.map((name, index) => (
              <View key={`player-${index}`} style={styles.playerInputRow}>
                <TextInput
                  key={`input-${index}`}
                  style={styles.playerInput}
                  value={name}
                  onChangeText={(text) => {
                    const newNames = [...playerNames];
                    newNames[index] = text;
                    setPlayerNames(newNames);
                  }}
                  placeholderTextColor="#999"
                  autoCorrect={false}
                  autoCapitalize="words"
                  blurOnSubmit={false}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={() => removeEscobaPlayer(index)} disabled={escobaPlayers.length <= 2} style={{ marginLeft: 12 }}>
                  <Minus size={28} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            <ScoreButton
              label={
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Agregar Jugador</Text>
                </View>
              }
              onPress={() => {
                addEscobaPlayer();
                // Actualizar directamente el estado local
                const newPlayerNames = [...playerNames, `Jugador ${playerNames.length + 1}`];
                setPlayerNames(newPlayerNames);
              }}
              variant="secondary"
              disabled={escobaPlayers.length >= 6}
              style={[styles.addPlayerButton, { paddingVertical: 14, minHeight: 48, borderRadius: 16 }]}
            />
            <ScoreButton label="Guardar Cambios" onPress={handleSave} style={styles.saveButton}/>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

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
            <Text style={styles.title}>Escoba de 15</Text>
            <Text style={styles.subtitle}>A {MAX_SCORE} puntos</Text>
          </View>
          <TouchableOpacity onPress={openEditModal} style={styles.settingsButton}>
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          {escobaScores.map((player, index) => (
            <View key={index} style={{ marginBottom: index !== escobaScores.length - 1 ? 24 : 0 }}>
              <PlayerCard
                name={player.name}
                score={player.score}
                isWinner={winner?.name === player.name}
                isLeading={leader?.name === player.name}
                isLast={last?.name === player.name && escobaScores.length > 1}
                maxScore={MAX_SCORE}
                onPress={() => handleOpenModal(index)}
                gameType="escoba"
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {!editing && (
        <View style={styles.bottomBar}>
          <View style={styles.buttonRow}>
            <ScoreButton 
              label={<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Volver</Text>
              </View>}
              onPress={() => navigation.navigate('Home')}
              variant="black"
              style={[styles.bottomButton, { backgroundColor: '#232323', borderColor: '#bbff01', borderWidth: 2, paddingHorizontal: 28, paddingVertical: 12 }]}
            />
            <ScoreButton 
              label={<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Reiniciar</Text>
              </View>}
              onPress={handleReset}
              variant="danger"
              style={[styles.bottomButton, { paddingHorizontal: 28, paddingVertical: 12 }]}
            />
          </View>
        </View>
      )}

      <ScoringModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        player={selectedPlayer}
        buttons={modalButtons}
      />
      
      <ConfirmationModal
        isVisible={isResetModalVisible}
        onClose={() => setResetModalVisible(false)}
        onConfirm={resetEscobaGame}
        title="Reiniciar Partida"
        message="¿Seguro que quieres empezar de nuevo? Se perderá todo el progreso."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818', // Gris oscuro cálido
  },
  scrollContent: {
    paddingBottom: 120,
    padding: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#FFFFFF', // Blanco
    fontSize: 20,
    fontWeight: '700',
  },
  settingsButton: {
    backgroundColor: '#232323',
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#bbff01', // Borde verde
  },
  editPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#181818', // Gris oscuro cálido
    zIndex: 10,
    padding: 24,
    paddingTop: 48,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  editTitle: {
    color: '#00FF00', // Verde neón
    fontSize: 30,
    fontWeight: '900',
  },
  closeButton: {
    padding: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#FFFFFF', // Blanco
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#181818',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#444',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#7bb420',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 18,
    borderWidth: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#181818',
    padding: 16,
    borderTopWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 24, 0.9)', // Gris oscuro cálido con transparencia
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
  modalList: {
    padding: 24,
  },
  rulesButtonContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  rulesButton: {
    width: 220,
    borderRadius: 0,
    marginTop: 8,
    borderWidth: 3,
    borderColor: '#00FF00', // Verde neón
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
  },
  playerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerInput: {
    backgroundColor: '#181818',
    color: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    fontSize: 18,
    flex: 1,
    borderWidth: 2,
    borderColor: '#bbff01', // Verde lima
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 2,
  },
  addPlayerButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  addPlayerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  progressBar: {
    backgroundColor: '#bbff01',
    height: 18,
    borderRadius: 12,
  },
});

const StackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Escoba"
      component={EscobaScreen}
      options={{ title: '', headerShown: false }}
    />
  </Stack.Navigator>
);