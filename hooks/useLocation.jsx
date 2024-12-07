import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [readableLocation, setReadableLocation] = useState('');

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setErrorMsg('Permission to location was not granted');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setLatitude(latitude);
        setLongitude(longitude);

        console.log('Lat and Long is:', latitude, longitude);

        const response = await Location.reverseGeocodeAsync({ latitude, longitude });
        console.log(response[0].city)
        // const data1=await response.json()
        setReadableLocation(response[0]); // Readable location set kar rahe hain
        console.log('USER LOCATION IS:', response[0]);
      } catch (error) {
        setErrorMsg(error.message || 'Something went wrong');
      }
    };

    getLocation();
  }, []); // Empty dependency array means it runs once after component mounts.

  return { latitude, longitude, errorMsg, readableLocation };
};

export default useLocation;
