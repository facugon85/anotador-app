import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Linking } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Heart, Users, Trophy, ChevronRight, Map } from 'lucide-react-native';
import RoadmapModal from '../components/RoadmapModal';

const CARD_BG = '#232323';
const BORDER = '#bbff01';
const ICON = '#bbff01';
const TITLE = '#fff';
const SUBTITLE = '#bdbdbd';
const BUTTON_YELLOW = '#ffe600';
const BUTTON_TEXT = '#111';
const BG = '#181818';

const GameCard = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.gameCard}
    activeOpacity={0.85}
  >
    <View style={styles.cardContent}>
      {icon}
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <ChevronRight size={24} color={ICON} />
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
        <Text style={styles.title}>Anotador</Text>
        <Text style={styles.subtitle}>Selecciona un juego</Text>
        <View style={styles.gamesContainer}>
          <GameCard
            title="Truco"
            subtitle="Para 2, 4 o 6 jugadores"
            icon={<Heart size={28} color={ICON} style={styles.icon} />}
            onPress={() => handleGameSelect('Truco')}
          />
          <GameCard
            title="Chinchón"
            subtitle="De 2 a 6 jugadores"
            icon={<Users size={28} color={ICON} style={styles.icon} />}
            onPress={() => handleGameSelect('Chinchon')}
          />
          <GameCard
            title="Escoba de 15"
            subtitle="De 2 a 6 jugadores"
            icon={<Trophy size={28} color={ICON} style={styles.icon} />}
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
        <Text style={styles.versionText}>v1.2.0</Text>
      </View>
      <RoadmapModal isVisible={isRoadmapModalVisible} onClose={() => setRoadmapModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: TITLE,
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: SUBTITLE,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 36,
  },
  gamesContainer: {
    width: '100%',
    marginBottom: 18,
  },
  gameCard: {
    backgroundColor: CARD_BG,
    borderWidth: 2.5,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardText: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    color: TITLE,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: BORDER,
    fontSize: 15,
    fontWeight: '600',
  },
  icon: {
    marginRight: 4,
  },
  roadmapCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderWidth: 2.5,
    borderColor: BORDER,
    borderRadius: 16,
    marginBottom: 18,
    padding: 14,
  },
  roadmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roadmapTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  roadmapTitle: {
    color: TITLE,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  roadmapSubtitle: {
    color: BORDER,
    fontSize: 13,
    fontWeight: '600',
  },
  buyMeABeerButton: {
    backgroundColor: BUTTON_YELLOW,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  buyMeABeerText: {
    color: BUTTON_TEXT,
    fontWeight: 'bold',
    fontSize: 20,
  },
  footerSignature: {
    color: SUBTITLE,
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cufaLink: {
    color: BORDER,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  versionText: {
    color: SUBTITLE,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: 'bold',
  },
  bottomContent: {
    width: '100%',
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: 16,
  },
}); 
