import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import api from '../../api/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import { ActivityIndicator } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    router.push('/sign-in');
  };
  // Function to send OTP
  const sendOTP = async () => {
    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: email ? 'Invalid email' : 'Email is required',
      });
      return;
    }

    const user = { email };
    await AsyncStorage.setItem('email', email);
    setLoading(true);

    try {
      const response = await api.post(`/users/forgot-otp`, user);
      console.log(response?.data);

      if (response?.data?.status_code === 200) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: response?.data?.message,
        });
        router.push('/forgotOtpVerification');
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: response?.data?.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.response?.data || error.message,
      });
      console.log(error.response?.data || error.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1  px-6">
      <View className="flex-1 justify-center items-center">
      <View className="absolute mt-12 px-4 top-6 left-0 flex flex-row gap-x-4">
        {/* left arrow */}
        <Feather name="arrow-left" size={24} color="black" onPress={goBack} />
       <Text className="text-gray-800 text-lg font-psemibold" onPress={goBack}>Back</Text>
      </View>
        <Text className="text-2xl font-pbold text-gray-800 mb-4">Forgot Password</Text>
        <Text className="text-gray-600 text-center mb-8 font-pregular">
          Enter your email address, and we will send you an OTP to reset your password.
        </Text>

        <View className="w-full bg-white p-6 rounded-lg shadow-md">
          <FormField
            label="Email"
            placeholder="Enter your email address"
            handleChangeText={(e) => setEmail(e)}
          />
          <TouchableOpacity
            onPress={sendOTP}
            className="mt-6 bg-blue-500 py-3  rounded-lg items-center"
          >
            <Text className="text-center text-white text-lg items-center font-psemibold">
                {
                    loading? 
                    <View className="min-h-[60vh] items-center w-full justify-center">

                        <ActivityIndicator size="small" color='#fff' />
                    </View>
                    : "Send OTP"
                }
                
                </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
