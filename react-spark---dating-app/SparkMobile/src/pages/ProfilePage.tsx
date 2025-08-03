
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput, Switch, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon } from '../components/icons/LogoutIcon';
import { BoostIcon } from '../components/icons/BoostIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { PremiumModal } from '../components/PremiumModal';
import { LikedProfilesModal } from '../components/LikedProfilesModal';
import { SuperLikedProfilesModal } from '../components/SuperLikedProfilesModal';
import { VIBES, ZODIAC_SIGNS } from '../constants';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateUser, logout, toggleZenMode } = useAuth();
  
  // Editable fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLikedProfiles, setShowLikedProfiles] = useState(false);
  const [showSuperLikedProfiles, setShowSuperLikedProfiles] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setOccupation(user.occupation);
      setPhotos(user.photos);
    }
  }, [user]);
  
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    await updateUser({ name, bio, occupation, photos });
    setIsSaving(false);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    if(user) {
        setName(user.name);
        setBio(user.bio);
        setOccupation(user.occupation);
        setPhotos(user.photos);
    }
    setIsEditing(false);
  }

  const handleChoosePhoto = async () => {
    if (photos.length >= 6) {
      Alert.alert("Maximum photos reached", "You can only have up to 6 photos.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    if (photos.length > 1) {
        setPhotos(photos.filter((_, index) => index !== indexToDelete));
    } else {
        Alert.alert("Cannot remove", "You must have at least one photo.");
    }
  };

  if (!user) return null;

  return (
    <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Profile</Text>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <LogoutIcon width={24} height={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.photoGrid}>
                {Array.from({ length: 6 }).map((_, index) => {
                  const photoUri = photos[index];
                  return (
                    <View key={index} style={styles.photoContainer}>
                      {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.photo} />
                      ) : (
                        isEditing && <TouchableOpacity onPress={handleChoosePhoto} style={styles.addPhotoBtn}><Text style={styles.addPhotoText}>+</Text></TouchableOpacity>
                      )}
                      {isEditing && photoUri && (
                        <TouchableOpacity onPress={() => handleDeletePhoto(index)} style={styles.deletePhotoBtn}><Text style={styles.deletePhotoText}>×</Text></TouchableOpacity>
                      )}
                       {index === 0 && photoUri && <View style={styles.mainPhotoBadge}><Text style={styles.mainPhotoText}>Main</Text></View>}
                    </View>
                  )
                })}
              </View>
              
              <View style={styles.infoSection}>
                {isEditing ? (
                  <>
                    <TextInput value={name} onChangeText={setName} style={[styles.name, styles.input, styles.inputName]} placeholder="Name"/>
                    <TextInput value={occupation} onChangeText={setOccupation} style={[styles.occupation, styles.input]} placeholder="Occupation"/>
                    <TextInput value={bio} onChangeText={setBio} multiline style={[styles.bio, styles.input, {height: 100}]} placeholder="About me"/>
                  </>
                ) : (
                  <>
                    <Text style={styles.name}>{user.name}, {user.age}</Text>
                    <Text style={styles.occupation}>{user.occupation}</Text>
                    <Text style={styles.bio}>{user.bio || "No bio yet."}</Text>
                  </>
                )}
              </View>

              <View style={styles.editButtons}>
                {isEditing ? (
                  <>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={isSaving}><Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text></TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}><Text style={styles.editButtonText}>Edit Profile</Text></TouchableOpacity>
                )}
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statBox} onPress={() => user.likedProfiles.length > 0 && setShowLikedProfiles(true)}>
                <Text style={styles.statNumber}>{user.likedProfiles.length}</Text>
                <Text style={styles.statLabel}>Likes Sent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statBox} onPress={() => user.superLikedProfiles.length > 0 && setShowSuperLikedProfiles(true)}>
                <Text style={styles.statNumber}>{user.superLikedProfiles.length}</Text>
                <Text style={styles.statLabel}>Super Likes</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingsContainer}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Zen Mode</Text>
                    <Switch
                        trackColor={{ false: "#e5e7eb", true: "#f9a8d4" }}
                        thumbColor={user.zenMode.enabled ? "#f472b6" : "#f4f3f4"}
                        onValueChange={toggleZenMode}
                        value={user.zenMode.enabled}
                    />
                </View>
            </View>

            <View style={styles.premiumActions}>
                <TouchableOpacity style={styles.premiumBox} onPress={() => setShowPremiumModal(true)}>
                    <LinearGradient colors={['#fde047', '#f97316']} style={styles.premiumGradient}>
                        <BoostIcon width={32} height={32} color="white" />
                        <Text style={styles.premiumText}>Get Boosts</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.premiumBox} onPress={() => setShowPremiumModal(true)}>
                     <LinearGradient colors={['#38bdf8', '#3b82f6']} style={styles.premiumGradient}>
                        <StarIcon width={32} height={32} color="white" />
                        <Text style={styles.premiumText}>Get Super Likes</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
        <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
        <LikedProfilesModal profiles={user.likedProfiles} visible={showLikedProfiles} onClose={() => setShowLikedProfiles(false)} />
        <SuperLikedProfilesModal profiles={user.superLikedProfiles} visible={showSuperLikedProfiles} onClose={() => setShowSuperLikedProfiles(false)} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: { fontSize: 34, fontWeight: 'bold', color: '#f472b6' },
  logoutButton: { padding: 8 },
  profileContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    margin: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  photoContainer: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.66%',
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  photo: { width: '100%', height: '100%', borderRadius: 10 },
  addPhotoBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  addPhotoText: { fontSize: 30, color: '#9ca3af' },
  deletePhotoBtn: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  deletePhotoText: { color: 'white', fontWeight: 'bold' },
  mainPhotoBadge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  mainPhotoText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  infoSection: { alignItems: 'center', paddingHorizontal: 10 },
  name: { fontSize: 26, fontWeight: 'bold', color: '#1f2937' },
  occupation: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  bio: { fontSize: 16, color: '#4b5563', textAlign: 'center', marginTop: 12 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 10, width: '100%', textAlign: 'center' },
  inputName: { fontSize: 26, fontWeight: 'bold' },
  editButtons: { flexDirection: 'row', marginTop: 20, gap: 10 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 20, alignItems: 'center' },
  editButton: { backgroundColor: '#e5e7eb' },
  editButtonText: { color: '#374151', fontWeight: '600' },
  saveButton: { backgroundColor: '#f472b6' },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#e5e7eb' },
  cancelButtonText: { color: '#4b5563', fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, gap: 16 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: 16, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#f472b6' },
  statLabel: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  settingsContainer: { margin: 20, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { fontSize: 16, color: '#374151' },
  premiumActions: { flexDirection: 'row', gap: 16, marginHorizontal: 20, marginTop: 16 },
  premiumBox: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  premiumGradient: { padding: 20, alignItems: 'center', gap: 8 },
  premiumText: { color: 'white', fontWeight: 'bold' },
});

export default ProfilePage;
