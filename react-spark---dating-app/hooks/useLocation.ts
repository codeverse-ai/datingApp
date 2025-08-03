import { useState, useEffect } from 'react';
import type { Location } from '../types';

interface UseLocationState {
  location: Location | null;
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
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: "Geolocation is not supported by your browser.",
        loading: false,
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        location: null,
        error: `Unable to retrieve your location: ${error.message}`,
        loading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

  }, []);

  return state;
};
