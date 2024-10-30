import { View, Text, Alert, BackHandler, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../api/api';
import FormField from '../../components/FormField';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Toast } from 'react-native-alert-notification';

const OtpVerification = () => {
  const [email, setEmail] = useState('');
  const getEmail = async () => {
    const email = await AsyncStorage.getItem('email');
    setEmail(email);
  }

  const writeOtp =  (otp) => {
    // close keyboard if otp is 6 digits
    if(otp.length === 6){
      Keyboard.dismiss();
    }
    setOtp(otp);
  }
  // stop user from going back
  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  
  useEffect(() => {
    getEmail();
  }, [])
  const [otp, setOtp] = useState('');
  const handleSubmit = async () => {
    try{
      const response = await api.get(`/users/verify?email=${email}&otp=${otp}`);
      console.log(response?.data?.status_code);
      if(response?.data?.status_code === 200){
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: "OTP Verfied Successfully",
        })
        router.push('/sign-in');
      }
    }
    catch(err){
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: "Invalid OTP",
      })
    }
  }
  return (
    <View className="w-full flex px-12 justify-center min-h-screen">
      <Text>Enter your OTP</Text>
      <FormField title="OTP" placeholder="OTP" value={otp} handleChangeText={(e) => writeOtp(e)} />
      <TouchableOpacity className="bg-secondary py-3 rounded-lg mt-3" onPress={handleSubmit}>
            <Text className="text-white text-center text-lg font-pbold">Verify</Text>
          </TouchableOpacity>
    </View>
  )
}

export default OtpVerification