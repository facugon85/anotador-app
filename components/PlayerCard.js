import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Crown, Skull, Flame, Users } from 'lucide-react-native';

const PlayerCard = ({
  name,
  score,
  isWinner,
  isLeading,
  isLast,
  maxScore,
  onPress,
  gameType = 'truco', // 'truco' or 'chinchon'
  playerCount = 2, // Para Truco: 2, 4, 6 jugadores
  isCurrentTurn = false, // Para Truco de 6: indica si es el turno actual
  players = [], // Para Truco de 6: lista de jugadores del equipo
}) => {
  const progress = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
  const isOverLimit = maxScore > 0 && score > maxScore;

  const getTrucoFlameColor = () => {
    if (isLeading) return '#84cc16';
    return '#52525b';
  };

  const getChinchonBarColor = () => {
    if (score >= maxScore * 0.75) return '#f97316'; // Orange
    if (score >= maxScore * 0.5) return '#facc15'; // Yellow
    return '#84cc16'; // Green
  };

  const getProgressDivisions = () => {
    if (gameType === 'truco') {
      return [];
    } else if (gameType === 'chinchon') {
      // Sin divisiones para Chinchón
      return [];
    } else if (gameType === 'escoba') {
      // Sin divisiones para Escoba
      return [];
    }
    return [];
  };

  const getTrucoProgressBars = () => {
    if (gameType !== 'truco') return null;
    const firstBarProgress = Math.min((score / 15) * 100, 100);
    const secondBarProgress = score > 15 ? Math.min(((score - 15) / 15) * 100, 100) : 0;
    return (
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#bdbdbd', fontSize: 13, fontWeight: 'bold', marginBottom: 2 }}>0 a 15 malas</Text>
          <View style={{
            width: '100%',
            height: 14,
            backgroundColor: '#444',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${firstBarProgress}%`,
              height: '100%',
              backgroundColor: '#7bb420',
              borderRadius: 8,
            }} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#bdbdbd', fontSize: 13, fontWeight: 'bold', marginBottom: 2 }}>16 a 30 buenas</Text>
          <View style={{
            width: '100%',
            height: 14,
            backgroundColor: '#444',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${secondBarProgress}%`,
              height: '100%',
              backgroundColor: '#7bb420',
              borderRadius: 8,
            }} />
          </View>
        </View>
      </View>
    );
  };

  const divisions = getProgressDivisions();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.card,
        isCurrentTurn && styles.currentTurnCard
      ]}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          {gameType === 'truco' && <Flame size={22} color={getTrucoFlameColor()} style={styles.icon} />}
          {isOverLimit && <Skull size={20} color="#737373" style={styles.icon} />}
          {isCurrentTurn && <Crown size={20} color="#84cc16" style={styles.icon} />}
        </View>
        <Text
          style={[
            styles.score,
            isWinner && styles.winnerScore,
            isOverLimit && styles.overLimitScore
          ]}
        >
          {score}
        </Text>
      </View>

      {maxScore > 0 && (
        <>
          {gameType === 'truco' ? (
            getTrucoProgressBars()
          ) : (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { 
                    width: `${progress}%`,
                    backgroundColor: gameType === 'chinchon' ? getChinchonBarColor() : styles.progressBar.backgroundColor,
                  },
                  isOverLimit && styles.overLimitProgress
                ]}
              />
            </View>
          )}
        </>
      )}

      {isWinner && (
        <View style={styles.crownContainer}>
          <Crown size={20} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#232323', // Gris oscuro cálido
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 16,
    borderColor: '#bbff01', // Verde lima homogéneo
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    color: '#FFFFFF', // Blanco
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 8,
  },
  score: {
    color: '#bbff01', // Verde lima
    fontSize: 36,
    fontWeight: 'bold',
  },
  winnerScore: {
    color: '#FFFF00', // Amarillo neón para ganador
  },
  overLimitScore: {
    color: '#FF0000', // Rojo neón para límite excedido
  },
  progressContainer: {
    width: '100%',
    backgroundColor: '#444',
    borderRadius: 12,
    height: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: 12,
    backgroundColor: '#bbff01',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  overLimitProgress: {
    backgroundColor: '#FF0000', // Rojo neón
  },
  divisionMarker: {
    position: 'absolute',
    top: -12,
    zIndex: 2,
    alignItems: 'center',
  },
  divisionLine: {
    width: 2,
    height: 20,
    backgroundColor: '#bbff01', // Verde lima homogéneo
    borderRadius: 0,
  },
  divisionText: {
    color: '#bbff01', // Verde lima homogéneo
    fontSize: 10,
    marginTop: 2,
    fontWeight: 'bold',
  },
  crownContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#232323', // Gris oscuro cálido
    borderRadius: 20, // círculo
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFF00', // Amarillo neón
  },
  trucoProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  trucoBarContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  trucoBarLabel: {
    color: '#bbff01', // Verde lima homogéneo
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  trucoBarLabelLeft: {
    color: '#bbff01', // Verde lima homogéneo
    fontSize: 12,
    marginBottom: 4,
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  trucoProgressBar: {
    width: '100%',
    backgroundColor: '#232323', // Gris oscuro cálido
    borderRadius: 0,
    height: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#bbff01', // Verde lima homogéneo
  },
  trucoProgressFill: {
    height: 8,
    borderRadius: 0,
    backgroundColor: '#bbff01', // Verde lima homogéneo
    borderWidth: 1,
    borderColor: '#232323',
  },
});

export default PlayerCard; 