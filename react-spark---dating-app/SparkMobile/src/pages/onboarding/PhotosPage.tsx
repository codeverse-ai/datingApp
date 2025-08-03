
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

const PhotosPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChoosePhoto = async () => {
        if (photos.length >= 6) {
            Alert.alert("Maximum photos reached", "You can only have up to 6 photos.");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsMultipleSelection: true,
            selectionLimit: 6 - photos.length,
            quality: 1,
        });

        if (!result.canceled) {
            const newPhotos = result.assets.map(asset => asset.uri);
            setPhotos(prev => [...prev, ...newPhotos]);
        }
    };
    
    const handleDeletePhoto = (indexToDelete: number) => {
        setPhotos(photos.filter((_, index) => index !== indexToDelete));
    };

    const handleFinish = async () => {
        if (photos.length < 1) {
            Alert.alert("Add a photo", "Please add at least one photo to continue.");
            return;
        }
        setLoading(true);
        await updateUser({ 
            photos: photos,
            onboardingCompleted: true,
            onboardingStep: 'completed'
        });
        setLoading(false);
        // The navigator in App.tsx will now redirect to the main app
    };
    
    const canContinue = photos.length >= 1;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Add your best photos</Text>
                <Text style={styles.subtitle}>Upload at least one photo to continue. This is how you'll be seen on Spark.</Text>

                <View style={styles.grid}>
                    {Array.from({ length: 6 }).map((_, index) => {
                        const photoUri = photos[index];
                        if (photoUri) {
                            return (
                                <View key={index} style={styles.photoContainer}>
                                    <Image source={{ uri: photoUri }} style={styles.photo} />
                                    <TouchableOpacity onPress={() => handleDeletePhoto(index)} style={styles.deleteButton}>
                                        <Text style={styles.deleteButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                        return (
                            <TouchableOpacity key={index} style={styles.addSlot} onPress={handleChoosePhoto}>
                                <Text style={styles.addText}>+</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={handleFinish}
                    disabled={!canContinue || loading}
                    style={[styles.button, (!canContinue || loading) && styles.disabledButton]}
                >
                    <LinearGradient
                        colors={canContinue ? ['#f472b6', '#ec4899'] : ['#d1d5db', '#9ca3af']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Finishing Profile...' : 'Finish'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 16,
        color: '#4b5563',
        marginTop: 8,
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    photoContainer: {
        width: '30%',
        aspectRatio: 1,
    },
    addSlot: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    deleteButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 18
    },
    addText: {
        fontSize: 40,
        color: '#9ca3af',
        fontWeight: '200',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    button: {
        borderRadius: 50,
    },
    disabledButton: {
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonGradient: {
        padding: 16,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PhotosPage;
