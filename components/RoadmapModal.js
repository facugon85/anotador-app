import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { X, CheckCircle, Clock, Star, Heart, Smartphone } from 'lucide-react-native';

const RoadmapItem = ({ title, description, status, icon }) => (
  <View style={styles.roadmapItem}>
    <View style={styles.roadmapItemHeader}>
      {icon}
      <Text style={styles.roadmapItemTitle}>{title}</Text>
      <View style={[styles.statusBadge, status === 'completed' ? styles.completedBadge : styles.pendingBadge]}>
        <Text style={styles.statusText}>
          {status === 'completed' ? 'Completado' : 'En desarrollo'}
        </Text>
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
      title: 'Estadísticas avanzadas',
      description: 'Historial de partidas, gráficos y análisis de rendimiento',
      status: 'pending',
      icon: <Star size={20} color="#fbbf24" />
    },
    {
      title: 'Modo offline mejorado',
      description: 'Sincronización automática cuando hay conexión',
      status: 'pending',
      icon: <Star size={20} color="#fbbf24" />
    },
    {
      title: 'Temas personalizables',
      description: 'Diferentes colores y estilos para la interfaz',
      status: 'pending',
      icon: <Star size={20} color="#fbbf24" />
    },
    {
      title: 'Versión Web (PWA)',
      description: 'Instala la app en cualquier dispositivo desde el navegador',
      status: 'pending',
      icon: <Star size={20} color="#fbbf24" />
    },
    {
      title: 'App para iOS y Android',
      description: 'Mejoras continuas y optimización para ambas plataformas',
      status: 'pending',
      icon: <Smartphone size={20} color="#fbbf24" />
    }
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Roadmap</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#84cc16" />
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
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#171717',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
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
  closeButton: {
    padding: 4,
  },
  roadmapList: {
    padding: 24,
  },
  roadmapSubtitle: {
    color: '#a3a3a3',
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  roadmapItem: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  roadmapItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roadmapItemTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedBadge: {
    backgroundColor: '#84cc16',
  },
  pendingBadge: {
    backgroundColor: '#fbbf24',
  },
  statusText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  roadmapItemDescription: {
    color: '#a3a3a3',
    fontSize: 14,
    lineHeight: 20,
  },
  footerNote: {
    marginTop: 16,
    padding: 20,
    backgroundColor: '#262626',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerNoteText: {
    color: '#a3a3a3',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  supportLink: {
    color: '#84cc16',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default RoadmapModal; 