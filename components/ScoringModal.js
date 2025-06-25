import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import ScoreButton from './ScoreButton';

const ScoringModal = ({ isVisible, onClose, player, buttons }) => {
  if (!player) return null;

  // Handle both naming conventions (nombre/name and score)
  const playerName = player.nombre || player.name;
  const playerScore = player.score || player.puntos;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{playerName}</Text>
            <Text style={[styles.modalScore, { color: player.color || '#bbff01' }]}>
              {playerScore}
            </Text>
          </View>
          
          <ScrollView contentContainerStyle={styles.buttonsGrid}>
            {buttons.map((button, index) => (
              <View key={index} style={styles.buttonWrapper}>
                <ScoreButton
                  label={button.label}
                  onPress={button.onPress}
                  icon={button.icon}
                  variant={button.variant}
                  disabled={button.disabled}
                  className={button.className}
                />
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.7,
    backgroundColor: '#1E2A3A',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalScore: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonWrapper: {
    margin: 8,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#c0392b',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScoringModal; 