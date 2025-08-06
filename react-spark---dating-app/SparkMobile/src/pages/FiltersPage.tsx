
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useFilters } from '../hooks/useFilters';
import type { FilterState, NamedLocation } from '../types';
import { INTERESTS, PREDEFINED_LOCATIONS } from '../constants';
import { XIcon } from '../components/icons/XIcon';
// A simple picker for this example. A better UX would use a custom modal picker.
import { Picker } from '@react-native-picker/picker'; 

const DEFAULT_FILTERS: FilterState = {
  ageRange: [18, 55],
  distance: 5000,
  requiredInterests: [],
  mustHaveBio: false,
  searchLocation: null,
};

const FiltersPage: React.FC = () => {
  const navigation = useNavigation();
  const { filters, setFilters } = useFilters();
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleAgeChange = (values: number[]) => {
    setLocalFilters(prev => ({ ...prev, ageRange: [Math.round(values[0]), Math.round(values[1])] }));
  };
  
  const handleInterestToggle = (interest: string) => {
    setLocalFilters(prev => {
        const newInterests = prev.requiredInterests.includes(interest)
            ? prev.requiredInterests.filter(i => i !== interest)
            : [...prev.requiredInterests, interest];
        return { ...prev, requiredInterests: newInterests };
    });
  };

  const handleApply = () => {
    setFilters(localFilters);
    navigation.goBack();
  };
  
  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReset}><Text style={styles.headerButton}>Reset</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}><XIcon width={24} height={24} color="#374151" /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={localFilters.searchLocation?.name || 'current'}
              onValueChange={(itemValue) => {
                const selectedLocation = PREDEFINED_LOCATIONS.find(loc => loc.name === itemValue);
                setLocalFilters(prev => ({...prev, searchLocation: selectedLocation || null}))
              }}
            >
              <Picker.Item label="My Current Location" value="current" />
              {PREDEFINED_LOCATIONS.map(loc => (
                  <Picker.Item key={loc.name} label={loc.name} value={loc.name} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.section}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>Age Range</Text>
                <Text style={styles.valueText}>{localFilters.ageRange[0]} - {localFilters.ageRange[1]}</Text>
            </View>
            <Slider
                style={{width: '100%', height: 40}}
                minimumValue={18}
                maximumValue={99}
                step={1}
                value={localFilters.ageRange[0]}
                onSlidingComplete={value => handleAgeChange([value, localFilters.ageRange[1] > value ? localFilters.ageRange[1] : value])}
                minimumTrackTintColor="#f472b6"
                maximumTrackTintColor="#d1d5db"
                thumbTintColor="#f472b6"
            />
             <Slider
                style={{width: '100%', height: 40, marginTop: -30}}
                minimumValue={18}
                maximumValue={99}
                step={1}
                value={localFilters.ageRange[1]}
                onSlidingComplete={value => handleAgeChange([localFilters.ageRange[0] < value ? localFilters.ageRange[0] : value, value])}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="#f472b6"
            />
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Maximum Distance</Text>
            <Text style={styles.valueText}>{Math.round(localFilters.maxDistance)} mi.</Text>
          </View>
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={localFilters.distance}
            onValueChange={value => setLocalFilters(prev => ({...prev, maxDistance: value}))}
            minimumTrackTintColor="#f472b6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#f472b6"
          />
        </View>

        <View style={[styles.section, styles.switchRow]}>
           <Text style={styles.label}>Must have a bio</Text>
           <Switch
                trackColor={{ false: "#e5e7eb", true: "#f9a8d4" }}
                thumbColor={localFilters.mustHaveBio ? "#f472b6" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setLocalFilters(prev => ({...prev, mustHaveBio: !prev.mustHaveBio}))}
                value={localFilters.mustHaveBio}
            />
        </View>

        <View style={styles.section}>
            <Text style={styles.label}>Filter by interests</Text>
            <View style={styles.interestsContainer}>
                {INTERESTS.map(interest => (
                    <TouchableOpacity
                        key={interest}
                        onPress={() => handleInterestToggle(interest)}
                        style={[
                            styles.interestChip,
                            localFilters.requiredInterests.includes(interest) && styles.activeInterestChip
                        ]}
                    >
                        <Text style={[
                            styles.interestText,
                            localFilters.requiredInterests.includes(interest) && styles.activeInterestText
                        ]}>{interest}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerButton: {
    fontSize: 16,
    color: '#64748b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },
  valueText: {
    fontSize: 16,
    color: '#64748b',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  activeInterestChip: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  interestText: {
    color: '#475569',
    fontWeight: '600',
  },
  activeInterestText: {
    color: 'white',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  applyButton: {
    backgroundColor: '#f472b6',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FiltersPage;
