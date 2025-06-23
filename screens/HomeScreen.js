import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Linking } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Heart, Users, Trophy, ChevronRight, Beer, Map } from 'lucide-react-native';
import RoadmapModal from '../components/RoadmapModal';

const GameCard = ({ icon, title, subtitle, onPress, color }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.gameCard}
    activeOpacity={0.8}
  >
    <View style={styles.cardContent}>
      {icon}
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <ChevronRight size={24} color="#84cc16" />
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const { loadFromStorage } = useGameStore();
  const [isRoadmapModalVisible, setRoadmapModalVisible] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleGameSelect = (game) => {
    navigation.navigate(game);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Anotador
          </Text>
          <Text style={styles.subtitle}>
            Selecciona un juego
          </Text>
        </View>

        <View style={styles.gamesContainer}>
          <GameCard
            title="Truco"
            subtitle="Para 2 o 4 jugadores"
            icon={<Heart size={32} color="#84cc16" />}
            onPress={() => handleGameSelect('Truco')}
          />
          <GameCard
            title="Chinchón"
            subtitle="De 2 a 6 jugadores"
            icon={<Users size={32} color="#84cc16" />}
            onPress={() => handleGameSelect('Chinchon')}
          />
          <GameCard
            title="Escoba de 15"
            subtitle="Para 2 o 4 jugadores"
            icon={<Trophy size={32} color="#84cc16" />}
            onPress={() => handleGameSelect('Escoba')}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.roadmapContainer}
          onPress={() => setRoadmapModalVisible(true)}
        >
          <Map size={24} color="#84cc16" />
          <View style={styles.roadmapTextContainer}>
            <Text style={styles.roadmapTitle}>Roadmap</Text>
            <Text style={styles.roadmapSubtitle}>Nuevos juegos y mejoras en camino. ¡Mirá nuestro plan!</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buyMeABeerButton}
          onPress={() => Linking.openURL('https://www.buymeacoffee.com/cufanic')}
        >
          <Text style={styles.buyMeABeerText}>Buy me a beer 🍺</Text>
        </TouchableOpacity>

        <Text style={styles.footerSignature}>
            Hecho con ❤️ por{' '}
            <Text style={styles.cufaLink} onPress={() => Linking.openURL('https://facugon85.github.io/dev_cv/#')}>
                Cufa
            </Text>
        </Text>
        <Text style={styles.versionText}>v1.2.1</Text>
      </View>

      <RoadmapModal 
        isVisible={isRoadmapModalVisible}
        onClose={() => setRoadmapModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#a3a3a3',
    fontSize: 20,
    marginTop: 8,
  },
  gamesContainer: {
    gap: 20,
  },
  gameCard: {
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#84cc16',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 20,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#a3a3a3',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  roadmapContainer: {
    flexDirection: 'row',
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#84cc16',
  },
  roadmapTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  roadmapTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roadmapSubtitle: {
    color: '#a3a3a3',
    fontSize: 14,
    lineHeight: 20,
  },
  buyMeABeerButton: {
    backgroundColor: '#FFDD00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFDD00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  buyMeABeerText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif', // This will work on web
  },
  footerSignature: {
    color: '#a3a3a3',
    fontSize: 14,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  cufaLink: {
    color: '#84cc16',
    fontWeight: 'bold',
  },
  versionText: {
    color: '#52525b',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
}); 
