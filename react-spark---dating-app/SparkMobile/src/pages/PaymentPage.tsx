
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { XIcon } from '../components/icons/XIcon';
import { LinearGradient } from 'expo-linear-gradient';

const PaymentPage: React.FC = () => {
    const navigation = useNavigation();
    const { upgradeToPremium, user } = useAuth();
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        await new Promise(res => setTimeout(res, 2000));
        await upgradeToPremium();
        setProcessing(false);
        setPaymentSuccess(true);
        setTimeout(() => {
            navigation.goBack();
        }, 2500);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.flex}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <XIcon width={24} height={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {paymentSuccess ? (
                        <View style={styles.successContainer}>
                            <View style={styles.successIconCircle}>
                                <Text style={styles.successIcon}>✓</Text>
                            </View>
                            <Text style={styles.successTitle}>Payment Successful!</Text>
                            <Text style={styles.successSubtitle}>Welcome to Spark Premium, {user?.name}!</Text>
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Secure Payment</Text>
                            <Text style={styles.formSubtitle}>This is a simulated payment form for demonstration.</Text>
                            
                            <Text style={styles.inputLabel}>Card Number</Text>
                            <TextInput style={styles.input} placeholder="**** **** **** 4242" defaultValue="4242 4242 4242 4242" placeholderTextColor="#9ca3af" />
                            
                            <View style={styles.row}>
                                <View style={styles.flex}>
                                    <Text style={styles.inputLabel}>Expiry Date</Text>
                                    <TextInput style={styles.input} placeholder="MM/YY" defaultValue="12/28" placeholderTextColor="#9ca3af" />
                                </View>
                                <View style={{ width: 16 }} />
                                <View style={styles.flex}>
                                    <Text style={styles.inputLabel}>CVC</Text>
                                    <TextInput style={styles.input} placeholder="123" defaultValue="123" placeholderTextColor="#9ca3af" keyboardType="numeric" />
                                </View>
                            </View>
                            
                            <TouchableOpacity onPress={handlePayment} disabled={processing} style={styles.payButton}>
                                <LinearGradient colors={['#f472b6', '#2dd4bf']} style={styles.payButtonGradient}>
                                    {processing ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.payButtonText}>Pay $8.33</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    closeButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
    },
    payButton: {
        marginTop: 16,
        borderRadius: 50,
        overflow: 'hidden',
    },
    payButtonGradient: {
        padding: 16,
        alignItems: 'center',
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    successContainer: {
        alignItems: 'center',
    },
    successIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#dcfce7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successIcon: {
        fontSize: 50,
        color: '#22c55e',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
});

export default PaymentPage;
