import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChinchonPlayerScore({ 
  name, 
  score, 
  isWinner = false, 
  color = '#bbff01',
  maxScore = 100 
}) {
  const isGameOver = score >= maxScore;
  const progress = Math.min((score / maxScore) * 100, 100);

  return (
    <View style={[styles.container, isWinner && styles.winnerContainer]}>
      <View style={styles.header}>
        <Text style={[styles.name, isWinner && styles.winnerText]}>{name}</Text>
        <Text style={[styles.score, { color }, isWinner && styles.winnerText]}>
          {score}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: isGameOver ? '#FFD700' : color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{score}/{maxScore}</Text>
      </View>

      {isWinner && (
        <View style={styles.winnerBadge}>
          <Text style={styles.winnerBadgeText}>¡GANADOR!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E2A3A',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  winnerContainer: {
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#2A3A4A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  winnerText: {
    color: '#FFD700',
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBackground: {
    height: 12,
    backgroundColor: '#051118',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  winnerBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  winnerBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#051118',
  },
}); 