import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Linking, Dimensions } from 'react-native';
import { X, CheckCircle, Clock, Star, Heart, Smartphone, UserCircle } from 'lucide-react-native';

const RoadmapItem = ({ title, description, status, icon }) => (
  <View style={styles.roadmapItem}>
    <View style={styles.roadmapItemHeader}>
      {icon}
      <Text style={styles.roadmapItemTitle}>{title}</Text>
      <View style={[styles.statusBadge, status === 'completed' ? styles.completedBadge : status === 'pending' ? styles.pendingBadge : null]}>
        <Text style={styles.statusText}>{status === 'completed' ? 'Listo' : 'Próximamente'}</Text>
      </View>
    </View>
    <Text style={styles.roadmapItemDescription}>{description}</Text>
  </View>
);

const RoadmapModal = ({ isVisible, onClose }) => {
  const roadmapItems = [
    {
      title: 'Truco',
      description: 'Juego de cartas tradicional argentino para 2 o 4 jugadores',
      status: 'completed',
      icon: <CheckCircle size={20} color="#84cc16" />
    },
    {
      title: 'Chinchón',
      description: 'Juego de cartas para 2 a 6 jugadores',
      status: 'completed',
      icon: <CheckCircle size={20} color="#84cc16" />
    },
    {
      title: 'Escoba de 15',
      description: 'Juego de cartas para 2 o 4 jugadores',
      status: 'completed',
      icon: <CheckCircle size={20} color="#84cc16" />
    },
    {
      title: 'Generala',
      description: 'El clásico juego de dados para toda la familia',
      status: 'pending',
      icon: <Clock size={20} color="#fbbf24" />
    },
    {
      title: 'Póker',
      description: 'Variantes de póker para múltiples jugadores',
      status: 'pending',
      icon: <Clock size={20} color="#fbbf24" />
    },
    {
      title: 'Burako',
      description: 'Juego de cartas ruso popular en Argentina',
      status: 'pending',
      icon: <Clock size={20} color="#fbbf24" />
    },
    {
      title: 'Temas personalizables',
      description: 'Diferentes colores y estilos para la interfaz',
      status: 'pending',
      icon: <Star size={20} color="#fbbf24" />
    },
    {
      title: 'App para iOS y Android',
      description: 'Mejoras continuas y optimización para ambas plataformas',
      status: 'pending',
      icon: <Smartphone size={20} color="#fbbf24" />
    },
    {
      title: 'Cuentas de Usuario',
      description: 'Guarda tu progreso y estadísticas en la nube para acceder desde cualquier dispositivo.',
      status: 'pending',
      icon: <UserCircle size={20} color="#fbbf24" />
    },
    {
      title: 'Soporte multilenguaje',
      description: 'La app estará disponible en varios idiomas para más jugadores.',
      status: 'pending',
      icon: <Star size={20} color="#fbbf24" />
    }
  ];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Roadmap</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.roadmapList} showsVerticalScrollIndicator={false}>
            <Text style={styles.roadmapSubtitle}>
              Nuevos juegos y mejoras que estamos desarrollando
            </Text>
            {roadmapItems.map((item, index) => (
              <RoadmapItem
                key={index}
                title={item.title}
                description={item.description}
                status={item.status}
                icon={item.icon}
              />
            ))}
            <View style={styles.footerNote}>
              <Heart size={24} color="#ef4444" style={{ marginBottom: 12 }} />
              <Text style={styles.footerNoteText}>
                Esta app es un proyecto personal hecho con mucho cariño. Si te gusta, considerá apoyar el desarrollo para seguir agregando nuevas funciones y juegos.
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.buymeacoffee.com/cufanic')}>
                <Text style={styles.supportLink}>
                  ¡Cada colaboración ayuda a mantener el proyecto vivo!
                </Text>
              </TouchableOpacity>
              <Text style={[styles.footerNoteText, { marginTop: 18, textAlign: 'center', color: '#bdbdbd', fontSize: 15 }]}>¿Tenés feedback o sugerencias? Escribime a:</Text>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:facundonic.gonzalez@gmail.com')}>
                <Text style={{ color: '#7bb420', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 2 }}>
                  facundonic.gonzalez@gmail.com
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const MODAL_BG = '#181818';
const CARD_BG = '#232323';
const BORDER = '#bbff01';
const ICON = '#bbff01';
const TITLE = '#fff';
const SUBTITLE = '#bdbdbd';

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
    backgroundColor: MODAL_BG,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2.5,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    color: TITLE,
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD_BG,
  },
  roadmapList: {
    padding: 0,
    marginTop: 8,
  },
  roadmapSubtitle: {
    color: SUBTITLE,
    fontSize: 16,
    marginBottom: 18,
    lineHeight: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roadmapItem: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 14,
  },
  roadmapItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roadmapItemTitle: {
    color: TITLE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#232323',
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  completedBadge: {
    backgroundColor: '#232323',
  },
  pendingBadge: {
    backgroundColor: '#232323',
  },
  statusText: {
    color: BORDER,
    fontWeight: 'bold',
    fontSize: 12,
  },
  roadmapItemDescription: {
    color: SUBTITLE,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 28,
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  footerNoteText: {
    color: SUBTITLE,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  supportLink: {
    color: BORDER,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default RoadmapModal; 