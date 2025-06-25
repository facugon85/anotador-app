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
import { Undo2, RefreshCw, Settings, Trophy, Star, Medal, GitBranch, X } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function EscobaScreen() {
  const {
    escobaScores,
    addEscobaScore,
    undoLastEscobaScore,
    resetEscobaGame,
    setEscobaPlayers,
    escobaPlayers,
  } = useGameStore();

  const [editing, setEditing] = useState(false);
  const [playerNames, setPlayerNames] = useState([...escobaPlayers]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [isResetModalVisible, setResetModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setPlayerNames([...escobaPlayers]);
  }, [escobaPlayers]);
  
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
    if (playerNames[0].trim() && playerNames[1].trim()) {
      setPlayerNames(playerNames);
      closeEditModal();
    } else {
      Alert.alert('Error', 'Los nombres de los jugadores no pueden estar vacíos');
    }
  };

  const handleOpenModal = (index) => {
    if (winner) return;
    setSelectedPlayerIndex(index);
    setModalVisible(true);
  };
  
  const selectedPlayer = selectedPlayerIndex !== null 
    ? { ...escobaScores[selectedPlayerIndex], index: selectedPlayerIndex } 
    : null;

  const modalButtons = selectedPlayer ? [
    { label: 'Escoba', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Trophy size={18} color="white"/> },
    { label: 'Cartas', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <GitBranch size={18} color="white"/> },
    { label: 'Oros', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Star size={18} color="white"/> },
    { label: 'Setenta', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Star size={18} color="white"/> },
    { label: '7 de Oro', onPress: () => addEscobaScore(selectedPlayer.index, 1), icon: <Medal size={18} color="white"/> },
  ].map(btn => ({ ...btn, disabled: !!winner })) : [];

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
            <Text style={styles.modalTitle}>Editar Jugadores</Text>
            <TouchableOpacity onPress={closeEditModal} style={styles.closeButton}>
              <X size={24} color="#84cc16" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalList}>
            {playerNames.map((name, index) => (
              <View key={index} style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{index === 0 ? 'Nosotros' : 'Ellos'}</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={(text) => {
                    const newNames = [...playerNames];
                    newNames[index] = text;
                    setPlayerNames(newNames);
                  }}
                  placeholderTextColor="#999"
                />
              </View>
            ))}
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
            <PlayerCard
              key={index}
              name={player.name}
              score={player.score}
              isWinner={winner?.name === player.name}
              isLeading={leader?.name === player.name}
              isLast={last?.name === player.name && escobaScores.length > 1}
              maxScore={MAX_SCORE}
              onPress={() => handleOpenModal(index)}
            />
          ))}
        </View>
      </ScrollView>

      {!editing && (
        <View style={styles.bottomBar}>
          <View style={styles.buttonRow}>
            <ScoreButton label="Deshacer" onPress={undoLastEscobaScore} variant="secondary" icon={<Undo2 size={20} color="white"/>} style={styles.bottomButton} />
            <ScoreButton label="Reiniciar" onPress={handleReset} variant="danger" icon={<RefreshCw size={20} color="white"/>} style={styles.bottomButton} />
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
    backgroundColor: '#171717',
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
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#a3a3a3',
    fontSize: 20,
  },
  settingsButton: {
    backgroundColor: '#262626',
    padding: 12,
    borderRadius: 50,
  },
  editPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#171717',
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
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#d4d4d4',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#262626',
    color: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
  },
  saveButton: {
    marginTop: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(23, 23, 23, 0.8)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#262626',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#171717',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    marginTop: 'auto',
    marginBottom: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalList: {
    padding: 24,
  },
});