import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SparkIcon } from './icons/SparkIcon';
import type { Profile } from '../types';

interface ChatHeaderProps {
  profile: Profile;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ profile }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>
      <View style={styles.headerProfile}>
        <Image source={{ uri: profile.photos[0] }} style={styles.headerAvatar} />
        <Text style={styles.headerName}>{profile.name}</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Explore' as never)}>
        <SparkIcon width={30} height={30} color="#f472b6" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#f472b6',
    fontSize: 16,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
