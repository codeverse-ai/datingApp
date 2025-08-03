
import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';
import { RewindIcon } from './icons/RewindIcon';
import { BoostIcon } from './icons/BoostIcon';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumModalProps {
    visible: boolean;
    onClose: () => void;
}

const Plan: React.FC<{ duration: string; price: string; popular?: boolean }> = ({ duration, price, popular }) => (
    <View style={[styles.planBase, popular && styles.popularPlan]}>
        {popular && <View style={styles.popularBadge}><Text style={styles.popularText}>MOST POPULAR</Text></View>}
        <Text style={styles.planDuration}>{duration}</Text>
        <Text style={styles.planPrice}>{price}</Text>
    </View>
);

export const PremiumModal: React.FC<PremiumModalProps> = ({ visible, onClose }) => {
    const navigation = useNavigation<any>();
    
    const handleUpgrade = () => {
        onClose();
        navigation.navigate('Payment');
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <XIcon width={20} height={20} color="#6b7280" />
                    </TouchableOpacity>

                    <View style={styles.iconsContainer}>
                        <StarIcon width={32} height={32} color="#facc15" />
                        <RewindIcon width={32} height={32} color="#9ca3af" />
                        <BoostIcon width={32} height={32} color="#f97316" />
                    </View>
                    
                    <Text style={styles.title}>Get Spark Premium</Text>
                    <Text style={styles.subtitle}>Unlock Rewinds, Boosts, Super Likes, and more!</Text>

                    <View style={styles.plansContainer}>
                        <Plan duration="12 Months" price="$8.33/mo" popular />
                        <Plan duration="6 Months" price="$11.99/mo" />
                        <Plan duration="1 Month" price="$19.99/mo" />
                    </View>
                    
                    <TouchableOpacity onPress={handleUpgrade} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#f472b6', '#2dd4bf']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.upgradeButton}
                        >
                            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 4,
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f472b6',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 24,
    },
    plansContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 24,
    },
    planBase: {
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 16,
        width: '100%',
    },
    popularPlan: {
        borderColor: '#f472b6',
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
        backgroundColor: '#f472b6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    planDuration: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    planPrice: {
        fontSize: 14,
        color: '#4b5563',
    },
    upgradeButton: {
        width: '100%',
        padding: 16,
        borderRadius: 50,
        alignItems: 'center',
    },
    upgradeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
