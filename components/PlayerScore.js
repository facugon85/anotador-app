import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

export default function PlayerScore({ 
  name, 
  score, 
  isWinner = false, 
  color = '#007AFF',
  maxScore = 15 
}) {
  const isGameOver = score >= maxScore;
  const isTrucoGame = maxScore === 30;

  const malasScore = Math.min(score, 15);
  const buenasScore = Math.max(score - 15, 0);
  const malasProgress = (malasScore / 15) * 100;
  const buenasProgress = (buenasScore / 15) * 100;
  const singleProgress = (score / maxScore) * 100;

  return (
    <View style={[styles.container, isWinner && styles.winnerContainer]}>
      <View style={styles.header}>
        <Text style={[styles.name, isWinner && styles.winnerText]}>{name}</Text>
        <Text style={[styles.score, isWinner && { color }, isWinner && styles.winnerText]}>
          {score}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        {isTrucoGame ? (
          <View style={styles.trucoProgress}>
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Malas</Text>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${malasProgress}%`, backgroundColor: color },
                  ]}
                />
              </View>
            </View>
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Buenas</Text>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${buenasProgress}%`,
                      backgroundColor: isGameOver ? '#FFD700' : '#28a745',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${singleProgress}%`,
                  backgroundColor: isGameOver ? '#FFD700' : color,
                },
              ]}
            />
          </View>
        )}
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  winnerContainer: {
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#FFF8DC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  winnerText: {
    color: '#FF6B35',
  },
  progressContainer: {
    marginTop: 4,
  },
  trucoProgress: {
    flexDirection: 'row',
    gap: 10,
  },
  progressSection: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  winnerBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winnerBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
}); 