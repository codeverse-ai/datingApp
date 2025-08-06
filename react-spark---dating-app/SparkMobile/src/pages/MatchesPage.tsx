
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { HeartIcon } from '../components/icons/HeartIcon';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Chat: { matchId: string };
};

type MatchesNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

const MatchesPage: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation<MatchesNavigationProp>();
    const matches = user?.matches || [];

    const handlePressMatch = (matchId: string) => {
        navigation.navigate('Chat', { matchId });
    };

    if (matches.length === 0) {
        return (
            <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.emptyContainer}>
                <SafeAreaView style={styles.safeArea}>
                    <Text style={styles.headerTitle}>Spark</Text>
                    <View style={styles.centered}>
                        <HeartIcon width={100} height={100} color="#e5e7eb" />
                        <Text style={styles.emptyTitle}>No Matches Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Keep swiping to find your spark! When you and another person both like each other, they'll show up here.
                        </Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.headerTitle}>Matches</Text>
                <FlatList
                    data={matches}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.matchCard} onPress={() => handlePressMatch(item.id)}>
                            <Image source={{ uri: item.photos[0] }} style={styles.matchImage} />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.6)']}
                                style={styles.matchGradient}
                            />
                            <Text style={styles.matchName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        color: '#f472b6',
    },
    listContent: {
        paddingHorizontal: 10,
    },
    matchCard: {
        flex: 1/2,
        margin: 8,
        aspectRatio: 3/4,
        borderRadius: 16,
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
        justifyContent: 'flex-end',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    matchImage: {
        ...StyleSheet.absoluteFillObject,
    },
    matchGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    matchName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        padding: 12,
    },
    emptyContainer: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#374151',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 10,
    }
});

export default MatchesPage;
