// create a function to check if there is a token in the local storage
import AsyncStorage from '@react-native-async-storage/async-storage';
const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token?.length>1) {
        console.log(token)
        return JSON.stringify(token);
    } else {
        return false;
    }
}
export default checkToken;