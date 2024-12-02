import { View, Text, BackHandler, Keyboard, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import FormField from '../../components/FormField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { ActivityIndicator } from 'react-native-paper';

const ForgotOtpVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch email from AsyncStorage
  const getEmail = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    setEmail(storedEmail);
  };

  // Close the keyboard if OTP length is 6
  const writeOtp = (otpValue) => {
    if (otpValue.length === 6) {
      Keyboard.dismiss();
    }
    setOtp(otpValue);
  };

  // Prevent going back
  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    getEmail();
  }, []);



  // Handle OTP submission
  const handleSubmit = async () => {
    if (!otp) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'OTP is required',
      });
      return;
    }
    if (otp.length < 6) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'OTP must be 6 digits',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/users/forgot-password/verify?email=${email}&otp=${otp}`);
      if (response?.data?.status_code === 200) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'OTP Verified Successfully',
        });
        await AsyncStorage.setItem('email', email)

        router.push('/reset-password');
      }
    } catch (err) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Invalid OTP. Please try again.',
      });
    }
    setLoading(false);
  };

  return (
    <View className="w-full flex-1 bg-gray-50 px-6 justify-center">
      <View className="bg-white rounded-xl shadow-md p-6">
        <Text className="text-xl font-pbold text-gray-900 text-center">
          Verify Your Account
        </Text>
        <Text className="text-sm text-gray-600 text-center mt-2">
          Enter the 6-digit OTP sent to <Text className="font-psemibold">{email}</Text>.
        </Text>

        <View className="mt-6">
          <FormField
            title="OTP"
            placeholder="Enter OTP"
            value={otp}
            handleChangeText={(e) => writeOtp(e)}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-lg mt-6"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center text-lg font-pbold">
          {
              loading ? <ActivityIndicator size="small" color='#fff'/> : 'Verify'
            }
          </Text>
        </TouchableOpacity>
      </View>

    
    </View>
  );
};

export default ForgotOtpVerification;
