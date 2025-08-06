import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import { EXPLORE_CATEGORIES, MOCK_PROFILES } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useFilters } from '../hooks/useFilters';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance } from '../utils/location';
import type { Profile, ProfileWithDistance } from '../types';
import { ProfileDetailModal } from '../components/ProfileDetailModal';
import { LinearGradient } from 'expo-linear-gradient';

const ExplorePage: React.FC = () => {
    const { user } = useAuth();
    const { location: userLocation } = useLocation();
    const { filters } = useFilters();
    const [activeCategory, setActiveCategory] = useState(EXPLORE_CATEGORIES[0].name);
    const [profiles] = useState<Profile[]>(MOCK_PROFILES);
    const [viewingProfile, setViewingProfile] = useState<ProfileWithDistance | null>(null);
    const [showGlobalProfiles, setShowGlobalProfiles] = useState(false);

    // Step 1: Filter by category and user filters (except distance)
    const baseFiltered: ProfileWithDistance[] = useMemo(() => {
        if (!user) return [];
        const currentCategory = EXPLORE_CATEGORIES.find(c => c.name === activeCategory);
        const interestsToFilter = currentCategory?.interests || [];
        return profiles
            .filter(p => p.id !== user.id)
            .filter(p => {
                const inCategory = interestsToFilter.length === 0 || interestsToFilter.some(interest => p.interests.includes(interest));
                if (!inCategory) return false;
                const withinAge = p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1];
                const hasBio = !filters.mustHaveBio || (p.bio && p.bio.trim().length > 0);
                const hasRequiredInterests = filters.requiredInterests.length === 0 || filters.requiredInterests.every(interest => p.interests.includes(interest));
                return withinAge && hasBio && hasRequiredInterests;
            })
            .map(profile => ({
                ...profile,
                distance: userLocation ? calculateDistance(userLocation, profile.location) : 9999,
            }));
    }, [user, userLocation, filters, profiles, activeCategory]);

    // Step 2: Apply distance filter if not showing global
    const filteredProfiles = useMemo(() => {
        if (showGlobalProfiles) return baseFiltered.sort(() => Math.random() - 0.5);
        return baseFiltered.filter(p => p.distance <= filters.distance).sort(() => Math.random() - 0.5);
    }, [baseFiltered, showGlobalProfiles, filters.distance]);

    // Modal action handlers
    const handleLike = (profile: ProfileWithDistance) => setViewingProfile(null);
    const handleNope = (profile: ProfileWithDistance) => setViewingProfile(null);
    const handleSuperlike = (profile: ProfileWithDistance) => setViewingProfile(null);

    // Reset global switch when changing category
    React.useEffect(() => {
        setShowGlobalProfiles(false);
    }, [activeCategory]);

    return (
        <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.container}>
            <SafeAreaView style={styles.flex}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Spark</Text>
                </View>
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryScrollView}
                    >
                        {EXPLORE_CATEGORIES.map(category => (
                            <TouchableOpacity
                                key={category.name}
                                onPress={() => setActiveCategory(category.name)}
                                style={[
                                    styles.categoryButton,
                                    activeCategory === category.name && styles.activeCategoryButton
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    activeCategory === category.name && styles.activeCategoryText
                                ]}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                {filteredProfiles.length > 0 ? (
                    <FlatList
                        data={filteredProfiles}
                        numColumns={2}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.profileList}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.profileCard} onPress={() => setViewingProfile(item)}>
                                <Image source={{ uri: item.photos[0] }} style={styles.profileImage} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                                    style={styles.profileGradient}
                                />
                                <View style={styles.profileInfo}>
                                    <Text style={styles.profileName}>{item.name}, {item.age}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyTitle}>
                            {showGlobalProfiles
                                ? "No one matches that vibe."
                                : "No nearby profiles found in this category."}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {showGlobalProfiles
                                ? "Try a different category or adjust your main filters!"
                                : "You can try searching globally."}
                        </Text>
                        {!showGlobalProfiles && (
                            <TouchableOpacity
                                onPress={() => setShowGlobalProfiles(true)}
                                style={{
                                    marginTop: 16,
                                    padding: 12,
                                    backgroundColor: '#F06292',
                                    borderRadius: 20
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Show Global Profiles</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </SafeAreaView>

            {viewingProfile && (
                <ProfileDetailModal
                    profile={viewingProfile}
                    visible={!!viewingProfile}
                    onClose={() => setViewingProfile(null)}
                    onLike={handleLike}
                    onNope={handleNope}
                    onSuperlike={handleSuperlike}
                />
            )}
        </LinearGradient>
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
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#f472b6',
    },
    categoryScrollView: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
        marginRight: 10,
    },
    activeCategoryButton: {
        backgroundColor: '#f472b6',
    },
    categoryText: {
        color: '#374151',
        fontWeight: '600',
    },
    activeCategoryText: {
        color: 'white',
    },
    profileList: {
        padding: 8,
    },
    profileCard: {
        flex: 1/2,
        aspectRatio: 3/4,
        margin: 8,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#e5e7eb'
    },
    profileImage: {
        ...StyleSheet.absoluteFillObject,
    },
    profileGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },
    profileInfo: {
        padding: 12,
    },
    profileName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#374151',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default ExplorePage;