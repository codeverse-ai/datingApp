
import React from 'react';
import { View, Text, Modal, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Profile } from '../types';
import { XIcon } from './icons/XIcon';
import { LinearGradient } from 'expo-linear-gradient';

interface LikedProfilesModalProps {
    profiles: Profile[];
    onClose: () => void;
    visible: boolean;
}

export const LikedProfilesModal: React.FC<LikedProfilesModalProps> = ({ profiles, onClose, visible }) => {
    const navigation = useNavigation<any>();

    const handleProfileClick = (profileId: string) => {
        onClose();
        navigation.navigate('Chat', { matchId: profileId });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.container}>
                <SafeAreaView style={styles.flex}>
                    <View style={styles.header}>
                        <Text style={styles.title}>People You've Liked</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <XIcon width={24} height={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                    
                    <FlatList
                        data={profiles}
                        numColumns={3}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.profileCard} onPress={() => handleProfileClick(item.id)}>
                                <Image source={{ uri: item.photos[0] }} style={styles.profileImage} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                                    style={styles.profileGradient}
                                />
                                <Text style={styles.profileName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>You haven't liked anyone yet!</Text>
                            </View>
                        }
                    />
                </SafeAreaView>
            </LinearGradient>
        </Modal>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    closeButton: {
        padding: 8,
    },
    listContent: {
        padding: 8,
    },
    profileCard: {
        flex: 1/3,
        aspectRatio: 3/4,
        margin: 4,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#e5e7eb'
    },
    profileImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    profileGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    profileName: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '50%',
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
    }
});
