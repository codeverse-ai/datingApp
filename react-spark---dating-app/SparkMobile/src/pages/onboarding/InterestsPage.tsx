
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { INTERESTS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

type OnboardingStackParamList = {
  Photos: undefined;
};
type InterestsNavigationProp = StackNavigationProp<OnboardingStackParamList>;

const InterestsPage: React.FC = () => {
    const navigation = useNavigation<InterestsNavigationProp>();
    const { user, updateUser } = useAuth();
    const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
    const [loading, setLoading] = useState(false);

    const handleToggleInterest = (interest: string) => {
        setSelectedInterests(prev => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest);
            }
            if (prev.length >= 5) {
                Alert.alert("Maximum 5 interests", "You can select up to 5 interests.");
                return prev;
            }
            return [...prev, interest];
        });
    };

    const handleContinue = async () => {
        if (selectedInterests.length < 3) {
            Alert.alert("Select more interests", "Please select at least 3 interests to continue.");
            return;
        }
        setLoading(true);
        await updateUser({ 
            interests: selectedInterests,
            onboardingStep: 'photos'
        });
        setLoading(false);
        navigation.navigate('Photos');
    };
    
    const canContinue = selectedInterests.length >= 3;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>My hobbies are...</Text>
                <Text style={styles.subtitle}>Select at least 3 to help others get to know you. (Max 5)</Text>

                <ScrollView contentContainerStyle={styles.interestsContainer}>
                    {INTERESTS.map(interest => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                            <TouchableOpacity
                                key={interest}
                                onPress={() => handleToggleInterest(interest)}
                                style={[styles.chip, isSelected && styles.selectedChip]}
                            >
                                <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                                    {interest}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={handleContinue}
                    disabled={!canContinue || loading}
                    style={[styles.button, (!canContinue || loading) && styles.disabledButton]}
                >
                    <LinearGradient
                        colors={canContinue ? ['#f472b6', '#ec4899'] : ['#d1d5db', '#9ca3af']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Saving...' : `Continue (${selectedInterests.length}/5)`}
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
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e5e7eb',
    },
    selectedChip: {
        backgroundColor: '#fce7f3',
        borderColor: '#f472b6',
    },
    chipText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    selectedChipText: {
        color: '#db2777',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    button: {
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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

export default InterestsPage;
