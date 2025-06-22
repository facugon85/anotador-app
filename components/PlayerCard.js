import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Crown, Skull, Flame } from 'lucide-react-native';

const PlayerCard = ({
  name,
  score,
  isWinner,
  isLeading,
  isLast,
  maxScore,
  onPress,
}) => {
  const progress = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
  const isOverLimit = maxScore > 0 && score > maxScore;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={styles.card}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          {isLeading && !isWinner && <Flame size={22} color="#84cc16" style={styles.icon} />}
          {isLast && !isWinner && <Skull size={20} color="#737373" style={styles.icon} />}
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
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%` },
              isOverLimit && styles.overLimitProgress
            ]}
          />
        </View>
      )}

      {isWinner && (
        <View style={styles.crownContainer}>
          <Crown size={20} color="#171717" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 16,
    borderColor: '#84cc16',
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
  },
  name: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 8,
  },
  score: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  winnerScore: {
    color: '#84cc16',
  },
  overLimitScore: {
    color: '#ef4444',
  },
  progressContainer: {
    width: '100%',
    backgroundColor: '#52525b',
    borderRadius: 50,
    height: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 50,
    backgroundColor: '#84cc16',
  },
  overLimitProgress: {
    backgroundColor: '#ef4444',
  },
  crownContainer: {
    position: 'absolute',
    top: -14,
    right: -14,
    backgroundColor: '#84cc16',
    borderRadius: 50,
    padding: 8,
    borderWidth: 4,
    borderColor: '#262626',
  },
});

export default PlayerCard; 