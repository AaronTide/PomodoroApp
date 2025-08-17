import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Zap, Shield, Target, Star, Trophy } from 'lucide-react-native';
import { useCharacterStore } from '@/store/characterStore';

export default function CharacterScreen() {
  const { character, changeClass } = useCharacterStore();

  const getExperienceToNext = () => {
    return character.level * 100;
  };

  const getExperienceProgress = () => {
    const experienceInCurrentLevel = character.experience % (character.level * 100);
    return experienceInCurrentLevel / getExperienceToNext();
  };

  const renderStatBar = (value: number, maxValue: number, color: string) => {
    const percentage = (value / maxValue) * 100;
    return (
      <View style={styles.statBar}>
        <View 
          style={[
            styles.statBarFill, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
    );
  };

  const getCharacterSprite = () => {
    switch (character.class) {
      case 'Warrior':
        return character.level >= 10 ? '⚔️🛡️' : '🗡️';
      case 'Mage':
        return character.level >= 10 ? '🔮✨' : '🧙‍♂️';
      case 'Archer':
        return character.level >= 10 ? '🏹💨' : '🏹';
      default:
        return '🗡️';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>⚔️ CHARACTER CARD ⚔️</Text>
        </View>

        <View style={styles.characterCard}>
          <View style={styles.characterHeader}>
            <Text style={styles.characterSprite}>{getCharacterSprite()}</Text>
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{character.name}</Text>
              <Text style={styles.characterClass}>{character.class}</Text>
              <Text style={styles.characterLevel}>Level {character.level}</Text>
            </View>
          </View>

          <View style={styles.experienceContainer}>
            <Text style={styles.experienceText}>
              XP: {character.experience} / {getExperienceToNext()}
            </Text>
            <View style={styles.experienceBar}>
              <View 
                style={[
                  styles.experienceBarFill, 
                  { width: `${getExperienceProgress() * 100}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Heart size={20} color="#ef4444" />
                <Text style={styles.statLabel}>Health</Text>
                <Text style={styles.statValue}>{character.stats.health}</Text>
                {renderStatBar(character.stats.health, 200, '#ef4444')}
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Zap size={20} color="#fbbf24" />
                <Text style={styles.statLabel}>Attack</Text>
                <Text style={styles.statValue}>{character.stats.attack}</Text>
                {renderStatBar(character.stats.attack, 100, '#fbbf24')}
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Shield size={20} color="#3b82f6" />
                <Text style={styles.statLabel}>Defense</Text>
                <Text style={styles.statValue}>{character.stats.defense}</Text>
                {renderStatBar(character.stats.defense, 100, '#3b82f6')}
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Target size={20} color="#8b5cf6" />
                <Text style={styles.statLabel}>Focus</Text>
                <Text style={styles.statValue}>{character.stats.focus}</Text>
                {renderStatBar(character.stats.focus, 100, '#8b5cf6')}
              </View>
            </View>
          </View>

          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsTitle}>🏆 ACHIEVEMENTS</Text>
            <View style={styles.achievementsList}>
              <View style={styles.achievement}>
                <Star size={16} color="#ffd700" />
                <Text style={styles.achievementText}>Sessions: {character.sessionsCompleted}</Text>
              </View>
              <View style={styles.achievement}>
                <Trophy size={16} color="#ffd700" />
                <Text style={styles.achievementText}>Battles Won: {character.battlesWon}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.classSelection}>
          <Text style={styles.classTitle}>CHANGE CLASS</Text>
          <View style={styles.classButtons}>
            <TouchableOpacity 
              style={[
                styles.classButton, 
                character.class === 'Warrior' && styles.activeClass
              ]}
              onPress={() => changeClass('Warrior')}
            >
              <Text style={styles.classButtonText}>⚔️</Text>
              <Text style={styles.classButtonLabel}>Warrior</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.classButton, 
                character.class === 'Mage' && styles.activeClass
              ]}
              onPress={() => changeClass('Mage')}
            >
              <Text style={styles.classButtonText}>🔮</Text>
              <Text style={styles.classButtonLabel}>Mage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.classButton, 
                character.class === 'Archer' && styles.activeClass
              ]}
              onPress={() => changeClass('Archer')}
            >
              <Text style={styles.classButtonText}>🏹</Text>
              <Text style={styles.classButtonLabel}>Archer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.powerLevel}>
          <Text style={styles.powerLevelTitle}>⚡ POWER LEVEL ⚡</Text>
          <Text style={styles.powerLevelValue}>
            {character.stats.health + character.stats.attack + character.stats.defense + character.stats.focus}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
  },
  characterCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ffd700',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterSprite: {
    fontSize: 64,
    marginRight: 20,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  characterClass: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#ffd700',
    marginTop: 4,
  },
  characterLevel: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#4ade80',
    marginTop: 4,
  },
  experienceContainer: {
    marginBottom: 20,
  },
  experienceText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  experienceBar: {
    height: 12,
    backgroundColor: '#16213e',
    borderRadius: 6,
    overflow: 'hidden',
  },
  experienceBarFill: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statRow: {
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#ffffff',
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffd700',
    marginRight: 12,
  },
  statBar: {
    width: 100,
    height: 8,
    backgroundColor: '#16213e',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
  },
  achievementsContainer: {
    borderTopWidth: 2,
    borderTopColor: '#16213e',
    paddingTop: 16,
  },
  achievementsTitle: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 12,
  },
  achievementsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#ffffff',
    marginLeft: 4,
  },
  classSelection: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  classTitle: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  classButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  classButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
    minWidth: 80,
  },
  activeClass: {
    backgroundColor: '#ffd700',
  },
  classButtonText: {
    fontSize: 24,
    marginBottom: 4,
  },
  classButtonLabel: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  powerLevel: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  powerLevelTitle: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
  },
  powerLevelValue: {
    fontSize: 32,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
  },
});