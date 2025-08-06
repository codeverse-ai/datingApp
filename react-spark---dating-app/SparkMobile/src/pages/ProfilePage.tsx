import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput, Switch, Alert, SafeAreaView, Modal, Dimensions } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon } from '../components/icons/LogoutIcon';
import { BoostIcon } from '../components/icons/BoostIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { PremiumModal } from '../components/PremiumModal';
import { LikedProfilesModal } from '../components/LikedProfilesModal';
import { SuperLikedProfilesModal } from '../components/SuperLikedProfilesModal';
import { VIBES } from '../constants';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayCircleIcon } from '../components/icons/MediaIcons';
import { XIcon } from '../components/icons/XIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateUser, logout, toggleZenMode } = useAuth();

  // Editable fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoIntro, setVideoIntro] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLikedProfiles, setShowLikedProfiles] = useState(false);
  const [showSuperLikedProfiles, setShowSuperLikedProfiles] = useState(false);
  const [showFullPhoto, setShowFullPhoto] = useState(false);

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
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setOccupation(user.occupation);
      setPhotos(user.photos);
    }
    setIsEditing(false);
  };

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

  const handleChooseVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'videos',
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setVideoIntro(result.assets[0].uri);
    }
  };

  if (!user) return null;

  return (
    <LinearGradient colors={['#fdf6f0', '#f0f9ff']} style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Bar: Like/Match counts and Logout */}
          <View style={styles.topBar}>
            <View style={styles.statsRow}>
              <TouchableOpacity onPress={() => setShowFullPhoto(true)} activeOpacity={0.8}>
              <Image source={{ uri: photos[0] }} style={styles.mainPhoto} />
            </TouchableOpacity>
             {/* <TouchableOpacity style={styles.statCircle} onPress={() => user.likedProfiles.length > 0 && setShowLikedProfiles(true)}>
                <Text style={styles.statNumber}>{user.likedProfiles.length}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statCircle} onPress={() => user.superLikedProfiles.length > 0 && setShowSuperLikedProfiles(true)}>
                <Text style={styles.statNumber}>{user.superLikedProfiles.length}</Text>
                <Text style={styles.statLabel}>Super Likes</Text>
              </TouchableOpacity>  */}
               <View style={styles.badgesCol}></View>
               <TouchableOpacity style={styles.iconBadge} onPress={() => user.likedProfiles.length > 0 && setShowLikedProfiles(true)}>
                <BoostIcon width={22} height={22} color="#f472b6" />
                <Text style={styles.iconBadgeText}>{user.likedProfiles.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBadge} onPress={() => user.superLikedProfiles.length > 0 && setShowSuperLikedProfiles(true)}>
                <StarIcon width={22} height={22} color="#38bdf8" />
                <Text style={styles.iconBadgeText}>{user.superLikedProfiles.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <LogoutIcon width={24} height={24} color="#6b7280" />
            </TouchableOpacity>
            </View>
            
            
          </View>

  
          {/* Main Info Row */}
          <View style={styles.mainInfoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.name}>{user.name}, {user.age}</Text>
              <Text style={styles.occupation}>{user.occupation}</Text>
                <View style={styles.statsRow}>
            </View>
            
              <View style={styles.vibeRow}>
                {user.vibe && <Text style={styles.vibe}>{user.vibe}</Text>}
                {user.zodiac && <Text style={styles.zodiac}>{user.zodiac.split(' ')[0]}</Text>}
              </View>
            </View>
          </View>

          {/* Video Intro */}
          <View style={styles.videoIntroSection}>
            <Text style={styles.sectionTitle}>Video Intro</Text>
            {videoIntro ? (
              <TouchableOpacity style={styles.videoThumb} onPress={() => Alert.alert('Play video', 'Implement video player here!')}>
                <Image source={{ uri: photos[0] }} style={styles.videoThumbImg} />
                <View style={styles.videoPlayOverlay}>
                  <PlayCircleIcon width={48} height={48} color="#f472b6" />
                </View>
              </TouchableOpacity>
            ) : isEditing ? (
              <TouchableOpacity style={styles.addVideoBtn} onPress={handleChooseVideo}>
                <PlayCircleIcon width={36} height={36} color="#f472b6" />
                <Text style={styles.addVideoText}>Add Video Intro</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noVideoText}>No video intro yet.</Text>
            )}
          </View>

         

          <View style={styles.photoGrid}>
  {photos.slice(1, 6).map((photoUri, index) => (
    <View key={index} style={styles.photoContainer}>
      {photoUri ? (
        <>
          <TouchableOpacity onPress={() => setShowFullPhoto(true)} activeOpacity={0.9}>
            <Image source={{ uri: photoUri }} style={styles.mainPhoto} />
          </TouchableOpacity>
          
          {isEditing && (
            <TouchableOpacity
              onPress={() => handleDeletePhoto(index + 1)}
              style={styles.deletePhotoBtn}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        isEditing && (
          <TouchableOpacity onPress={handleChoosePhoto} style={styles.addPhotoBtn}>
            <Text style={styles.addPhotoText}>+</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  ))}
  {/* Show "+" if less than 6 photos (excluding main) */}
  {isEditing && photos.length - 1 < 5 && (
    <View style={styles.photoContainer}>
      <TouchableOpacity onPress={handleChoosePhoto} style={styles.addPhotoBtn}>
        <Text style={styles.addPhotoText}>+</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <Text style={styles.sectionTitle}>About Me</Text>
            {isEditing ? (
              <TextInput
                value={bio}
                onChangeText={setBio}
                multiline
                style={[styles.bio, styles.input, { height: 100 }]}
                placeholder="Tell something interesting about yourself..."
              />
            ) : (
              <Text style={styles.bio}>{user.bio || "No bio yet."}</Text>
            )}
          </View>

          {/* Edit/Save Buttons */}
          <View style={styles.editButtons}>
            {isEditing ? (
              <>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={isSaving}>
                  <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Settings */}
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

          {/* Premium Actions */}
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

        {/* Modals */}
        <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
        <LikedProfilesModal profiles={user.likedProfiles} visible={showLikedProfiles} onClose={() => setShowLikedProfiles(false)} />
        <SuperLikedProfilesModal profiles={user.superLikedProfiles} visible={showSuperLikedProfiles} onClose={() => setShowSuperLikedProfiles(false)} />

        {/* Full Screen Photo Modal */}
        <Modal visible={showFullPhoto} transparent animationType="fade">
          <View style={styles.fullPhotoModal}>
            <Image source={{ uri: photos[0] }} style={styles.fullPhotoImg} />
            <TouchableOpacity style={styles.fullPhotoClose} onPress={() => setShowFullPhoto(false)}>
              <XIcon width={36} height={36} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff7fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: "#f472b6",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#f472b6' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  logoutButton: { padding: 8 },
  mainInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 18,
    gap: 18,
  },
  mainPhoto: {
    width: 100,
    height: 130,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#f472b6',
    shadowColor: "#f472b6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  name: { fontSize: 26, fontWeight: 'bold', color: '#1f2937' },
  occupation: { fontSize: 16, color: '#6b7280', marginTop: 2 },
  vibeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  vibe: {
    backgroundColor: '#fce7f3',
    color: '#be185d',
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
  },
  zodiac: {
    fontSize: 18,
    color: '#f472b6',
    fontWeight: 'bold',
  },
  videoIntroSection: {
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  videoThumb: {
    width: 180,
    height: 240,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  videoThumbImg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  videoPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
    iconBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7fb',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
    shadowColor: "#f472b6",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  iconBadgeText: {
    color: '#f472b6',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  addVideoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  addVideoText: {
    color: '#f472b6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noVideoText: {
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 10,
  },
  photoGridSection: {
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  photoContainer: {
    width: 70,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    position: 'relative',
  },
  photo: { width: '100%', height: '100%', borderRadius: 14 },
  addPhotoBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  addPhotoText: { fontSize: 30, color: '#9ca3af' },
  deletePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  bioSection: {
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 24,
  },
  bio: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
  },
  badgesCol: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
    marginLeft: 12,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    marginTop: 4,
  },
  inputName: { fontSize: 26, fontWeight: 'bold' },
  editButtons: { flexDirection: 'row', marginTop: 16, gap: 10, justifyContent: 'center' },
  button: { flex: 1, paddingVertical: 12, borderRadius: 20, alignItems: 'center' },
  editButton: { backgroundColor: '#e5e7eb' },
  editButtonText: { color: '#374151', fontWeight: '600' },
  saveButton: { backgroundColor: '#f472b6' },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#e5e7eb' },
  cancelButtonText: { color: '#4b5563', fontWeight: '600' },
  settingsContainer: { margin: 20, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { fontSize: 16, color: '#374151' },
  premiumActions: { flexDirection: 'row', gap: 16, marginHorizontal: 20, marginTop: 16 },
  premiumBox: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  premiumGradient: { padding: 20, alignItems: 'center', gap: 8 },
  premiumText: { color: 'white', fontWeight: 'bold' },
  fullPhotoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.97)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullPhotoImg: {
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  fullPhotoClose: {
    position: 'absolute',
    top: 48,
    right: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    padding: 6,
  },
});

export default ProfilePage;