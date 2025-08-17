import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react-native';
import { useCharacterStore } from '@/store/characterStore';

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { gainExperience, character } = useCharacterStore();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return isBreak ? WORK_TIME : BREAK_TIME;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isBreak]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      // Completed a work session
      setCompletedSessions(prev => prev + 1);
      gainExperience(50); // Gain XP for completing a session
      
      Alert.alert(
        '🎉 Session Complete!',
        `Focus session completed! +50 XP gained!\nTake a 5-minute break.`,
        [
          {
            text: 'Start Break',
            onPress: () => {
              setIsBreak(true);
              setTimeLeft(BREAK_TIME);
              setIsRunning(true);
            },
          },
          {
            text: 'Skip Break',
            onPress: () => {
              setIsBreak(false);
              setTimeLeft(WORK_TIME);
            },
          },
        ]
      );
    } else {
      // Completed a break
      Alert.alert(
        '💪 Break Over!',
        'Break time is over. Ready for another focus session?',
        [
          {
            text: 'Start Session',
            onPress: () => {
              setIsBreak(false);
              setTimeLeft(WORK_TIME);
              setIsRunning(true);
            },
          },
          {
            text: 'Not Yet',
            onPress: () => {
              setIsBreak(false);
              setTimeLeft(WORK_TIME);
            },
          },
        ]
      );
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? (BREAK_TIME - timeLeft) / BREAK_TIME
    : (WORK_TIME - timeLeft) / WORK_TIME;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚔️ FOCUS WARRIOR ⚔️</Text>
        <Text style={styles.subtitle}>Level {character.level} • XP: {character.experience}</Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={[styles.timerCircle, isBreak && styles.breakCircle]}>
          <Text style={[styles.timeText, isBreak && styles.breakText]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={[styles.sessionType, isBreak && styles.breakText]}>
            {isBreak ? 'BREAK' : 'FOCUS'}
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress * 100}%` },
              isBreak && styles.breakProgress
            ]} 
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Zap size={20} color="#ffd700" />
          <Text style={styles.statText}>Sessions: {completedSessions}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statText}>HP: {character.stats.health}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statText}>ATK: {character.stats.attack}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={resetTimer}
        >
          <RotateCcw size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.playButton, isRunning && styles.pauseButton]} 
          onPress={toggleTimer}
        >
          {isRunning ? (
            <Pause size={32} color="#ffffff" />
          ) : (
            <Play size={32} color="#ffffff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={() => {
            setIsBreak(!isBreak);
            setTimeLeft(isBreak ? WORK_TIME : BREAK_TIME);
            setIsRunning(false);
          }}
        >
          <Text style={styles.switchText}>⟲</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.characterPreview}>
        <Text style={styles.characterText}>
          {character.name} • {character.class}
        </Text>
        <Text style={styles.characterEmoji}>
          {character.class === 'Warrior' ? '🗡️' : character.class === 'Mage' ? '🔮' : '🏹'}
        </Text>
      </View>
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
    marginBottom: 40,
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
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  breakCircle: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
  },
  timeText: {
    fontSize: 48,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  breakText: {
    color: '#3b82f6',
  },
  sessionType: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#4ade80',
    marginTop: 8,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  breakProgress: {
    backgroundColor: '#3b82f6',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  statBox: {
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  statText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  pauseButton: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  switchText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  characterPreview: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  characterText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#ffd700',
    fontWeight: 'bold',
  },
  characterEmoji: {
    fontSize: 32,
    marginTop: 8,
  },
});