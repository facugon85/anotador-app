import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ScoreButton from './ScoreButton';

const ConfirmationModal = ({ isVisible, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            <ScoreButton
              label="Cancelar"
              onPress={onClose}
              variant="secondary"
              style={styles.button}
            />
            <ScoreButton
              label="Confirmar"
              onPress={() => {
                onConfirm();
                onClose();
              }}
              variant="danger"
              style={styles.button}
            />
          </View>
        </View>
      </View>
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
    width: Dimensions.get('window').width * 0.88,
    backgroundColor: '#181818',
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: '#bdbdbd',
    fontSize: 17,
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default ConfirmationModal; 