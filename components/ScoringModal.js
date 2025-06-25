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
                  style={{...button.style, ...styles.squareButton}}
                />
              </View>
            ))}
          </ScrollView>

          <ScoreButton
            label="Confirmar"
            onPress={onClose}
            style={styles.closeButton}
            variant="lime"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 24, 0.96)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width * 0.92,
    maxHeight: Dimensions.get('window').height * 0.88,
    backgroundColor: '#181818',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#444',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalScore: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffe600',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 340,
  },
  buttonWrapper: {
    margin: 8,
    width: 120,
    height: 120,
  },
  squareButton: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#232323',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 2,
  },
  closeButton: {
    marginTop: 18,
    backgroundColor: '#7bb420',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default ScoringModal; 