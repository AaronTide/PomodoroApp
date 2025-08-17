import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Character {
  id: string;
  name: string;
  class: 'Warrior' | 'Mage' | 'Archer';
  level: number;
  experience: number;
  stats: {
    health: number;
    attack: number;
    defense: number;
    focus: number;
  };
  sessionsCompleted: number;
  battlesWon: number;
}

interface CharacterStore {
  character: Character;
  gainExperience: (amount: number) => void;
  changeClass: (newClass: Character['class']) => void;
  incrementSessionsCompleted: () => void;
  incrementBattlesWon: () => void;
  resetCharacter: () => void;
}

const createInitialCharacter = (): Character => ({
  id: 'player_1',
  name: 'FocusHero',
  class: 'Warrior',
  level: 1,
  experience: 0,
  stats: {
    health: 50,
    attack: 20,
    defense: 15,
    focus: 10,
  },
  sessionsCompleted: 0,
  battlesWon: 0,
});

const getStatGrowth = (characterClass: Character['class']) => {
  switch (characterClass) {
    case 'Warrior':
      return { health: 8, attack: 4, defense: 3, focus: 1 };
    case 'Mage':
      return { health: 4, attack: 6, defense: 2, focus: 4 };
    case 'Archer':
      return { health: 6, attack: 5, defense: 2, focus: 3 };
    default:
      return { health: 5, attack: 3, defense: 2, focus: 2 };
  }
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      character: createInitialCharacter(),
      
      gainExperience: (amount: number) => {
        set((state) => {
          const newExperience = state.character.experience + amount;
          const currentLevel = state.character.level;
          const experienceForNextLevel = currentLevel * 100;
          
          if (newExperience >= experienceForNextLevel) {
            // Level up!
            const newLevel = currentLevel + 1;
            const statGrowth = getStatGrowth(state.character.class);
            
            return {
              character: {
                ...state.character,
                level: newLevel,
                experience: newExperience,
                stats: {
                  health: state.character.stats.health + statGrowth.health,
                  attack: state.character.stats.attack + statGrowth.attack,
                  defense: state.character.stats.defense + statGrowth.defense,
                  focus: state.character.stats.focus + statGrowth.focus,
                },
              },
            };
          }
          
          return {
            character: {
              ...state.character,
              experience: newExperience,
            },
          };
        });
      },
      
      changeClass: (newClass: Character['class']) => {
        set((state) => {
          // Recalculate stats based on new class and current level
          const baseStats = { health: 50, attack: 20, defense: 15, focus: 10 };
          const statGrowth = getStatGrowth(newClass);
          const levelBonus = state.character.level - 1;
          
          return {
            character: {
              ...state.character,
              class: newClass,
              stats: {
                health: baseStats.health + (statGrowth.health * levelBonus),
                attack: baseStats.attack + (statGrowth.attack * levelBonus),
                defense: baseStats.defense + (statGrowth.defense * levelBonus),
                focus: baseStats.focus + (statGrowth.focus * levelBonus),
              },
            },
          };
        });
      },
      
      incrementSessionsCompleted: () => {
        set((state) => ({
          character: {
            ...state.character,
            sessionsCompleted: state.character.sessionsCompleted + 1,
          },
        }));
      },
      
      incrementBattlesWon: () => {
        set((state) => ({
          character: {
            ...state.character,
            battlesWon: state.character.battlesWon + 1,
          },
        }));
      },
      
      resetCharacter: () => {
        set({ character: createInitialCharacter() });
      },
    }),
    {
      name: 'character-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);