import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import PlayerCard from '../components/PlayerCard';
import ScoreButton from '../components/ScoreButton';
import ScoringModal from '../components/ScoringModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Undo2, RefreshCw, Settings, Shield, Zap, Plus, X } from 'lucide-react-native';

export default function TrucoScreen() {
  const {
    trucoScores,
    addTrucoScore: addScore,
    undoLastTrucoScore,
    resetTrucoGame,
    setTrucoTeams,
    trucoTeams,
    addFaltaEnvido,
  } = useGameStore();
  
  const [editing, setEditing] = useState(false);
  const [teamNames, setTeamNames] = useState([...trucoTeams]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);
  const [isResetModalVisible, setResetModalVisible] = useState(false);

  useEffect(() => {
    setTeamNames([...trucoTeams]);
  }, [trucoTeams]);

  const MAX_SCORE = 30;
  const winner = trucoScores.find((score) => score.score >= MAX_SCORE);

  const { leader, last } = useMemo(() => {
    if (trucoScores.length < 2) return { leader: null, last: null };
    const sorted = [...trucoScores].sort((a, b) => b.score - a.score);
    return {
      leader: sorted[0],
      last: sorted[sorted.length - 1],
    };
  }, [trucoScores]);
  
  useEffect(() => {
    if (winner) {
      Alert.alert('¡Fin del Juego!', `¡${winner.name} ha ganado la partida!`, [
        { text: 'Nueva Partida', onPress: () => setResetModalVisible(true), style: 'destructive' },
        { text: 'OK', style: 'cancel' },
      ]);
    }
  }, [winner]);

  const handleReset = () => {
    setResetModalVisible(true);
  };

  const handleSave = () => {
    setTrucoTeams(teamNames);
    setEditing(false);
  };

  const handleOpenModal = (index) => {
    if (winner) return;
    setSelectedTeamIndex(index);
    setModalVisible(true);
  };
  
  const selectedTeam = selectedTeamIndex !== null 
    ? { ...trucoScores[selectedTeamIndex], index: selectedTeamIndex } 
    : null;

  const modalButtons = selectedTeam ? [
    { label: 'Envido (2)', onPress: () => addScore(selectedTeam.index, 2), icon: <Shield size={18} color="white"/> },
    { label: 'Real Envido (3)', onPress: () => addScore(selectedTeam.index, 3), icon: <Shield size={18} color="white"/> },
    { label: 'Falta Envido', onPress: () => addFaltaEnvido(selectedTeam.index), icon: <Shield size={18} color="white"/>, variant: 'secondary' },
    { label: 'Truco (2)', onPress: () => addScore(selectedTeam.index, 2), icon: <Zap size={18} color="white"/> },
    { label: 'Retruco (3)', onPress: () => addScore(selectedTeam.index, 3), icon: <Zap size={18} color="white"/> },
    { label: 'Vale Cuatro (4)', onPress: () => addScore(selectedTeam.index, 4), icon: <Zap size={18} color="white"/> },
    { label: '+1 Punto', onPress: () => addScore(selectedTeam.index, 1), variant: 'secondary', icon: <Plus size={18} color="white"/> },
  ].map(btn => ({ ...btn, disabled: !!winner })) : [];

  const EditPanel = () => (
    <View style={styles.editPanel}>
      <View style={styles.editHeader}>
        <Text style={styles.editTitle}>Editar Equipos</Text>
        <TouchableOpacity onPress={() => setEditing(false)} style={styles.closeButton}>
          <X size={30} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {teamNames.map((name, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{index === 0 ? 'Nosotros' : 'Ellos'}</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={(text) => {
                const newNames = [...teamNames];
                newNames[index] = text;
                setTeamNames(newNames);
              }}
              placeholderTextColor="#999"
            />
          </View>
        ))}
        <ScoreButton label="Guardar Cambios" onPress={handleSave} style={styles.saveButton} />
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {editing && <EditPanel />}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Truco</Text>
            <Text style={styles.subtitle}>A {MAX_SCORE} puntos</Text>
          </View>
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.settingsButton}>
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          {trucoScores.map((team, index) => (
            <PlayerCard
              key={index}
              name={team.name}
              score={team.score}
              isWinner={winner?.name === team.name}
              isLeading={leader?.name === team.name}
              isLast={last?.name === team.name && trucoScores.length > 1}
              maxScore={MAX_SCORE}
              onPress={() => handleOpenModal(index)}
            />
          ))}
        </View>
      </ScrollView>

      {!editing && (
        <View style={styles.bottomBar}>
          <View style={styles.buttonRow}>
            <ScoreButton label="Deshacer" onPress={undoLastTrucoScore} variant="secondary" icon={<Undo2 size={20} color="white"/>} style={styles.bottomButton} />
            <ScoreButton label="Reiniciar" onPress={handleReset} variant="danger" icon={<RefreshCw size={20} color="white"/>} style={styles.bottomButton} />
          </View>
        </View>
      )}

      <ScoringModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        player={selectedTeam}
        buttons={modalButtons}
      />

      <ConfirmationModal
        isVisible={isResetModalVisible}
        onClose={() => setResetModalVisible(false)}
        onConfirm={resetTrucoGame}
        title="Reiniciar Partida"
        message="¿Estás seguro de que quieres reiniciar la partida? Se perderá todo el progreso."
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
}); 