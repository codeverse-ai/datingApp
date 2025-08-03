import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import type { Location as LocationType } from '../types';

interface UseLocationState {
  location: LocationType | null;
  error: string | null;
  loading: boolean;
}

export const useLocation = (): UseLocationState => {
  const [state, setState] = useState<UseLocationState>({
    location: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({
            location: null,
            error: 'Permission to access location was denied',
            loading: false
        });
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setState({
            location: {
                lat: location.coords.latitude,
                lon: location.coords.longitude,
            },
            error: null,
            loading: false
        });
      } catch (error: any) {
         setState({
            location: null,
            error: `Unable to retrieve your location: ${error.message}`,
            loading: false
        });
      }
    })();
  }, []);

  return state;
};
