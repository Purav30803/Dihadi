// create a function to check if there is a token in the local storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
const Interceptor = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
        return JSON.parse(token);
    } else if (!token) {
        router.push('/sign-in');
    }
}
export default Interceptor;