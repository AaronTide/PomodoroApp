import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sword, Shield, Heart, Zap, Target, Trophy } from 'lucide-react-native';
import { useCharacterStore } from '@/store/characterStore';

const OPPONENT_CHARACTERS = [
  {
    id: 1,
    name: 'DragonSlayer',
    class: 'Warrior',
    level: 5,
    stats: { health: 80, attack: 35, defense: 25, focus: 20 },
  },
  {
    id: 2,
    name: 'MysticWizard',
    class: 'Mage',
    level: 7,
    stats: { health: 60, attack: 45, defense: 15, focus: 40 },
  },
  {
    id: 3,
    name: 'ShadowHunter',
    class: 'Archer',
    level: 6,
    stats: { health: 70, attack: 40, defense: 20, focus: 35 },
  },
  {
    id: 4,
    name: 'FocusMaster',
    class: 'Mage',
    level: 10,
    stats: { health: 100, attack: 55, defense: 30, focus: 60 },
  },
  {
    id: 5,
    name: 'IronGuard',
    class: 'Warrior',
    level: 8,
    stats: { health: 120, attack: 40, defense: 40, focus: 25 },
  },
];

export default function BattleScreen() {
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [battleInProgress, setBattleInProgress] = useState(false);
  const { character, gainExperience, incrementBattlesWon } = useCharacterStore();

  const calculatePowerLevel = (stats) => {
    return stats.health + stats.attack + stats.defense + stats.focus;
  };

  const simulateBattle = (playerChar, opponent) => {
    const playerPower = calculatePowerLevel(playerChar.stats);
    const opponentPower = calculatePowerLevel(opponent.stats);
    
    // Add some randomness to make battles more interesting
    const playerRoll = Math.random() * 0.4 + 0.8; // 0.8 to 1.2 multiplier
    const opponentRoll = Math.random() * 0.4 + 0.8;
    
    const playerFinalPower = playerPower * playerRoll;
    const opponentFinalPower = opponentPower * opponentRoll;
    
    const powerDifference = Math.abs(playerFinalPower - opponentFinalPower);
    const winner = playerFinalPower > opponentFinalPower ? 'player' : 'opponent';
    
    // Calculate damage dealt and received
    const damageDealt = Math.floor(playerChar.stats.attack * playerRoll);
    const damageReceived = Math.floor(opponent.stats.attack * opponentRoll);
    
    return {
      winner,
      powerDifference,
      damageDealt,
      damageReceived,
      playerPower: Math.floor(playerFinalPower),
      opponentPower: Math.floor(opponentFinalPower),
    };
  };

  const startBattle = (opponent) => {
    setBattleInProgress(true);
    setSelectedOpponent(opponent);
    
    // Simulate battle delay for dramatic effect
    setTimeout(() => {
      const result = simulateBattle(character, opponent);
      setBattleResult(result);
      
      if (result.winner === 'player') {
        const xpGained = Math.floor(opponent.level * 25 + result.powerDifference);
        gainExperience(xpGained);
        incrementBattlesWon();
        
        Alert.alert(
          '🎉 Victory!',
          `You defeated ${opponent.name}!\n+${xpGained} XP gained!`
        );
      } else {
        Alert.alert(
          '💀 Defeat!',
          `${opponent.name} was too strong!\nTrain harder and try again!`
        );
      }
      
      setBattleInProgress(false);
    }, 2000);
  };

  const resetBattle = () => {
    setSelectedOpponent(null);
    setBattleResult(null);
    setBattleInProgress(false);
  };

  const getCharacterSprite = (charClass, level = 1) => {
    switch (charClass) {
      case 'Warrior':
        return level >= 10 ? '⚔️🛡️' : '🗡️';
      case 'Mage':
        return level >= 10 ? '🔮✨' : '🧙‍♂️';
      case 'Archer':
        return level >= 10 ? '🏹💨' : '🏹';
      default:
        return '🗡️';
    }
  };

  if (selectedOpponent && !battleResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.battleArena}>
          <Text style={styles.battleTitle}>⚔️ BATTLE ARENA ⚔️</Text>
          
          <View style={styles.battleField}>
            <View style={styles.fighterCard}>
              <Text style={styles.fighterSprite}>
                {getCharacterSprite(character.class, character.level)}
              </Text>
              <Text style={styles.fighterName}>{character.name}</Text>
              <Text style={styles.fighterLevel}>Level {character.level}</Text>
              <Text style={styles.powerLevel}>
                Power: {calculatePowerLevel(character.stats)}
              </Text>
            </View>
            
            <Text style={styles.vsText}>VS</Text>
            
            <View style={styles.fighterCard}>
              <Text style={styles.fighterSprite}>
                {getCharacterSprite(selectedOpponent.class, selectedOpponent.level)}
              </Text>
              <Text style={styles.fighterName}>{selectedOpponent.name}</Text>
              <Text style={styles.fighterLevel}>Level {selectedOpponent.level}</Text>
              <Text style={styles.powerLevel}>
                Power: {calculatePowerLevel(selectedOpponent.stats)}
              </Text>
            </View>
          </View>
          
          {battleInProgress ? (
            <View style={styles.battleAnimation}>
              <Text style={styles.battleAnimationText}>⚔️ FIGHTING! ⚔️</Text>
              <Text style={styles.battleStatus}>Battle in progress...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.fightButton}
              onPress={() => startBattle(selectedOpponent)}
            >
              <Text style={styles.fightButtonText}>START BATTLE!</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.backButton} onPress={resetBattle}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (battleResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultScreen}>
          <Text style={styles.resultTitle}>
            {battleResult.winner === 'player' ? '🏆 VICTORY!' : '💀 DEFEAT!'}
          </Text>
          
          <View style={styles.battleSummary}>
            <Text style={styles.summaryText}>
              Your Power: {battleResult.playerPower}
            </Text>
            <Text style={styles.summaryText}>
              Enemy Power: {battleResult.opponentPower}
            </Text>
            <Text style={styles.summaryText}>
              Damage Dealt: {battleResult.damageDealt}
            </Text>
            <Text style={styles.summaryText}>
              Damage Received: {battleResult.damageReceived}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.continueButton} onPress={resetBattle}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>⚔️ BATTLE MODE ⚔️</Text>
          <Text style={styles.subtitle}>Choose your opponent!</Text>
        </View>

        <View style={styles.playerCard}>
          <View style={styles.playerInfo}>
            <Text style={styles.playerSprite}>
              {getCharacterSprite(character.class, character.level)}
            </Text>
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>{character.name}</Text>
              <Text style={styles.playerClass}>{character.class}</Text>
              <Text style={styles.playerLevel}>Level {character.level}</Text>
            </View>
          </View>
          <View style={styles.playerStats}>
            <Text style={styles.playerPower}>
              Power Level: {calculatePowerLevel(character.stats)}
            </Text>
          </View>
        </View>

        <Text style={styles.opponentTitle}>SELECT OPPONENT:</Text>

        {OPPONENT_CHARACTERS.map((opponent) => (
          <TouchableOpacity
            key={opponent.id}
            style={styles.opponentCard}
            onPress={() => setSelectedOpponent(opponent)}
          >
            <View style={styles.opponentInfo}>
              <Text style={styles.opponentSprite}>
                {getCharacterSprite(opponent.class, opponent.level)}
              </Text>
              <View style={styles.opponentDetails}>
                <Text style={styles.opponentName}>{opponent.name}</Text>
                <Text style={styles.opponentClass}>{opponent.class}</Text>
                <Text style={styles.opponentLevel}>Level {opponent.level}</Text>
              </View>
            </View>
            
            <View style={styles.opponentStats}>
              <View style={styles.statRow}>
                <Heart size={14} color="#ef4444" />
                <Text style={styles.statText}>{opponent.stats.health}</Text>
              </View>
              <View style={styles.statRow}>
                <Sword size={14} color="#fbbf24" />
                <Text style={styles.statText}>{opponent.stats.attack}</Text>
              </View>
              <View style={styles.statRow}>
                <Shield size={14} color="#3b82f6" />
                <Text style={styles.statText}>{opponent.stats.defense}</Text>
              </View>
              <View style={styles.statRow}>
                <Target size={14} color="#8b5cf6" />
                <Text style={styles.statText}>{opponent.stats.focus}</Text>
              </View>
            </View>
            
            <View style={styles.powerLevelContainer}>
              <Text style={styles.opponentPower}>
                {calculatePowerLevel(opponent.stats)}
              </Text>
              <Text style={styles.powerLabel}>Power</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.battleStats}>
          <View style={styles.battleStatItem}>
            <Trophy size={24} color="#ffd700" />
            <Text style={styles.battleStatText}>Battles Won</Text>
            <Text style={styles.battleStatValue}>{character.battlesWon}</Text>
          </View>
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#ffffff',
    marginTop: 8,
  },
  playerCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerSprite: {
    fontSize: 48,
    marginRight: 16,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playerClass: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#4ade80',
  },
  playerLevel: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#ffd700',
  },
  playerStats: {
    alignItems: 'center',
  },
  playerPower: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffd700',
  },
  opponentTitle: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  opponentCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#1a1a2e',
    flexDirection: 'row',
    alignItems: 'center',
  },
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  opponentSprite: {
    fontSize: 32,
    marginRight: 12,
  },
  opponentDetails: {
    flex: 1,
  },
  opponentName: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  opponentClass: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ffd700',
  },
  opponentLevel: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#4ade80',
  },
  opponentStats: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ffffff',
    marginLeft: 4,
    width: 30,
  },
  powerLevelContainer: {
    alignItems: 'center',
  },
  opponentPower: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffd700',
  },
  powerLabel: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#ffffff',
  },
  battleArena: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleTitle: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 40,
  },
  battleField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  fighterCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd700',
    minWidth: 120,
  },
  fighterSprite: {
    fontSize: 48,
    marginBottom: 8,
  },
  fighterName: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  fighterLevel: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#4ade80',
    marginTop: 4,
  },
  powerLevel: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ffd700',
    marginTop: 4,
  },
  vsText: {
    fontSize: 32,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ef4444',
    marginHorizontal: 30,
  },
  battleAnimation: {
    alignItems: 'center',
    marginBottom: 40,
  },
  battleAnimationText: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 16,
  },
  battleStatus: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#ffffff',
  },
  fightButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  fightButtonText: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backButton: {
    backgroundColor: '#16213e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#ffffff',
  },
  resultScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 32,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 40,
    textAlign: 'center',
  },
  battleSummary: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 24,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#ffd700',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  battleStats: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  battleStatItem: {
    alignItems: 'center',
  },
  battleStatText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#ffffff',
    marginTop: 8,
  },
  battleStatValue: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffd700',
    marginTop: 4,
  },
});