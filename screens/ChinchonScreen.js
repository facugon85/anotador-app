import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import { useChinchonStore } from '../store/chinchonStore';
import PlayerCard from '../components/PlayerCard';
import ScoreButton from '../components/ScoreButton';
import ScoringModal from '../components/ScoringModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Undo2, RefreshCw, Settings, UserPlus, Minus, Sparkles, X } from 'lucide-react-native';

export default function ChinchonScreen() {
  const {
    jugadores,
    ganador,
    limitePuntos,
    agregarPuntos,
    corte,
    chinchon,
    deshacerUltima,
    reiniciarPartida,
    agregarJugador,
    eliminarJugador,
    cambiarNombreJugador,
    cargarDesdeStorage,
    cambiarLimite,
  } = useChinchonStore();

  const [editing, setEditing] = useState(false);
  const [playerNames, setPlayerNames] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isResetModalVisible, setResetModalVisible] = useState(false);

  useEffect(() => {
    cargarDesdeStorage();
  }, []);

  useEffect(() => {
    setPlayerNames(jugadores.map(j => j.nombre));
  }, [jugadores]);

  const { leader, last } = useMemo(() => {
    if (jugadores.length < 2) return { leader: null, last: null };
    const sorted = [...jugadores].sort((a, b) => a.puntos - b.puntos);
    return {
      leader: sorted[0],
      last: sorted[sorted.length - 1],
    };
  }, [jugadores]);

  useEffect(() => {
    if (ganador && ganador.length > 0) {
      const primerGanador = ganador[0];
      const esChinchon = primerGanador.chinchon;
      const titulo = esChinchon ? '¡CHINCHÓN!' : '¡Fin del Juego!';
      let mensaje;

      if (esChinchon) {
        mensaje = `¡${primerGanador.nombre} ha ganado con Chinchón!`;
      } else if (ganador.length > 1) {
        const nombresGanadores = ganador.map(g => g.nombre).join(' y ');
        mensaje = `¡Empate entre ${nombresGanadores} con ${primerGanador.puntos} puntos!`;
      } else {
        mensaje = `¡${primerGanador.nombre} gana con ${primerGanador.puntos} puntos!`;
      }

      Alert.alert(titulo, mensaje, [
        { text: 'Nueva Partida', onPress: () => setResetModalVisible(true), style: 'destructive' },
        { text: 'OK', style: 'cancel' },
      ]);
    }
  }, [ganador]);

  const handleReset = () => {
    setResetModalVisible(true);
  };

  const handleSave = () => {
    playerNames.forEach((nombre, index) => {
      if (jugadores[index] && jugadores[index].nombre !== nombre) {
        cambiarNombreJugador(jugadores[index].id, nombre);
      }
    });
    setEditing(false);
  };

  const handleOpenModal = (player) => {
    if (ganador && ganador.length > 0) return;
    setSelectedPlayerId(player.id);
    setModalVisible(true);
  };
  
  const selectedPlayer = selectedPlayerId ? jugadores.find(j => j.id === selectedPlayerId) : null;

  const modalButtons = selectedPlayer ? [
    { label: '+1', onPress: () => agregarPuntos(selectedPlayer.id, 1) },
    { label: '+5', onPress: () => agregarPuntos(selectedPlayer.id, 5) },
    { label: '+10', onPress: () => agregarPuntos(selectedPlayer.id, 10) },
    { label: '+20', onPress: () => agregarPuntos(selectedPlayer.id, 20) },
    { label: '-10 (Corte)', onPress: () => corte(selectedPlayer.id), variant: 'secondary' },
    { label: '¡Chinchón!', onPress: () => chinchon(selectedPlayer.id), variant: 'primary', icon: <Sparkles size={18} color="white"/> },
  ].map(btn => ({ ...btn, disabled: !!ganador?.length })) : [];

  const EditPanel = () => (
    <View style={styles.editPanel}>
      <View style={styles.editHeader}>
        <Text style={styles.editTitle}>Editar Partida</Text>
        <TouchableOpacity onPress={() => setEditing(false)} style={styles.closeButton}>
          <X size={30} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        <Text style={styles.sectionTitle}>Jugadores</Text>
        {playerNames.map((name, index) => (
          <View key={jugadores[index].id} style={styles.playerInputRow}>
            <TextInput
              style={styles.playerInput}
              value={name}
              onChangeText={(text) => {
                const newNames = [...playerNames];
                newNames[index] = text;
                setPlayerNames(newNames);
              }}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => eliminarJugador(jugadores[index].id)} disabled={jugadores.length <= 2}>
              <Minus size={28} color={jugadores.length <= 2 ? "#52525b" : "#ef4444"} />
            </TouchableOpacity>
          </View>
        ))}
        <ScoreButton
          label="Agregar Jugador"
          onPress={agregarJugador}
          icon={<UserPlus size={20} color="white"/>}
          variant="secondary"
          disabled={jugadores.length >= 6}
          style={styles.addPlayerButton}
        />
        
        <Text style={styles.sectionTitle}>Límite de Puntos</Text>
        <View style={styles.limiteContainer}>
          {[100, 150, 200].map((limite) => (
            <TouchableOpacity
              key={limite}
              style={[
                styles.limiteButton,
                limitePuntos === limite && styles.limiteButtonActive
              ]}
              onPress={() => cambiarLimite(limite)}
            >
              <Text style={[
                styles.limiteButtonText,
                limitePuntos === limite && styles.limiteButtonTextActive
              ]}>{limite}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScoreButton label="Guardar Cambios" onPress={handleSave} />
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
            <Text style={styles.title}>Chinchón</Text>
            <Text style={styles.subtitle}>Límite: {limitePuntos}</Text>
          </View>
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.settingsButton}>
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          {jugadores.map((jugador) => (
            <PlayerCard
              key={jugador.id}
              name={jugador.nombre}
              score={jugador.puntos}
              isWinner={ganador?.some(g => g.id === jugador.id)}
              isLeading={leader?.id === jugador.id}
              isLast={last?.id === jugador.id && jugadores.length > 1}
              maxScore={limitePuntos}
              onPress={() => handleOpenModal(jugador)}
            />
          ))}
        </View>
      </ScrollView>

      {!editing && (
        <View style={styles.bottomBar}>
          <View style={styles.buttonRow}>
            <ScoreButton label="Deshacer" onPress={deshacerUltima} variant="secondary" icon={<Undo2 size={20} color="white"/>} style={styles.bottomButton} />
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
        onConfirm={reiniciarPartida}
        title="Reiniciar Partida"
        message="¿Estás seguro de que quieres empezar de cero? Se perderá todo el progreso."
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
  sectionTitle: {
    color: '#d4d4d4',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerInput: {
    flex: 1,
    backgroundColor: '#262626',
    color: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    fontSize: 18,
  },
  addPlayerButton: {
    marginTop: 8,
  },
  limiteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  limiteButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#404040',
  },
  limiteButtonActive: {
    backgroundColor: '#84cc16',
    borderColor: '#84cc16',
  },
  limiteButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#d4d4d4',
  },
  limiteButtonTextActive: {
    color: '#ffffff',
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