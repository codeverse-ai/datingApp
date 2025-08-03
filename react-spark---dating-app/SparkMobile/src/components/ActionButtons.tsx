
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { RewindIcon } from './icons/RewindIcon';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';
import { HeartIcon } from './icons/HeartIcon';
import { BoostIcon } from './icons/BoostIcon';
import { LinearGradient } from 'expo-linear-gradient';


interface ActionButtonsProps {
  onRewind: () => void;
  onDislike: () => void;
  onSuperLike: () => void;
  onLike: () => void;
  onBoost: () => void;
  canRewind: boolean;
  hasProfiles: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onRewind, onDislike, onSuperLike, onLike, onBoost, canRewind, hasProfiles }) => {
  const smallButtonSize = 56;
  const largeButtonSize = 64;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onRewind} 
        disabled={!canRewind} 
        style={[styles.buttonBase, {width: smallButtonSize, height: smallButtonSize, opacity: canRewind ? 1 : 0.5 }]}
        activeOpacity={0.7}
      >
        <RewindIcon width={28} height={28} color="#9ca3af" />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={onDislike} 
        disabled={!hasProfiles} 
        style={[styles.buttonBase, {width: largeButtonSize, height: largeButtonSize, opacity: hasProfiles ? 1 : 0.5}]}
        activeOpacity={0.7}
      >
        <XIcon width={36} height={36} color="#F06292" />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={onSuperLike} 
        disabled={!hasProfiles} 
        style={[styles.buttonBase, {width: smallButtonSize, height: smallButtonSize, opacity: hasProfiles ? 1 : 0.5}]}
        activeOpacity={0.7}
      >
        <StarIcon width={28} height={28} color="#FFC107" />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={onLike} 
        disabled={!hasProfiles} 
        style={[styles.buttonBase, {width: largeButtonSize, height: largeButtonSize, opacity: hasProfiles ? 1 : 0.5}]}
        activeOpacity={0.7}
      >
        <HeartIcon width={36} height={36} color="#F06292" />
      </TouchableOpacity>
       <TouchableOpacity 
        onPress={onBoost} 
        disabled={!hasProfiles} 
        style={{width: smallButtonSize, height: smallButtonSize, opacity: hasProfiles ? 1 : 0.5}}
        activeOpacity={0.7}
      >
        <LinearGradient
            colors={['#facc15', '#f97316']}
            style={[styles.buttonBase, {width: smallButtonSize, height: smallButtonSize}]}
        >
            <BoostIcon width={28} height={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    buttonBase: {
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
})
