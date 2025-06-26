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

const ScoringModal = ({ isVisible, onClose, player, buttons, chinchonButton }) => {
  if (!player) return null;

  // Handle both naming conventions (nombre/name and score)
  const playerName = player.nombre || player.name;
  const playerScore = player.score || player.puntos;

  return (
    <Modal
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
              {typeof playerScore === 'number' ? playerScore : 0}
            </Text>
          </View>
          
          <ScrollView contentContainerStyle={styles.buttonsGrid}>
            {buttons.map((button, index) => (
              <View key={index} style={styles.buttonWrapper}>
                <ScoreButton
                  label={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                      {button.icon && (
                        <View style={{ marginBottom: 8 }}>{button.icon}</View>
                      )}
                      <Text style={{ color: button.labelStyle?.color || '#fff', fontSize: button.label === '-1 pts' ? 32 : 18, fontWeight: button.labelStyle?.fontWeight || 'bold', textAlign: 'center' }}>{button.label}</Text>
                    </View>
                  }
                  onPress={button.onPress}
                  icon={undefined}
                  variant={button.variant}
                  disabled={button.disabled}
                  style={{...button.style, ...styles.squareButton}}
                />
              </View>
            ))}
          </ScrollView>

          {chinchonButton && (
            <ScoreButton
              {...chinchonButton}
            />
          )}

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
    borderColor: '#bbff01',
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
    alignItems: 'center',
    maxWidth: 340,
  },
  buttonWrapper: {
    margin: 8,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareButton: {
    width: 120,
    height: 120,
    borderRadius: 18,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 2,
    borderColor: '#bbff01',
    backgroundColor: '#232323',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 2,
    transitionProperty: 'none',
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