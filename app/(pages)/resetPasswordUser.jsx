import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import FormField from '../../components/FormField';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import CustomButton from '../../components/customButton';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const ResetPasswordUser = () => {
  const [user, setUser] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');


  const goBack = () => {
    router.push('/settings');
  }
  // Biometric Authentication
  const handleBiometricAuth = async () => {
    try {
      const isHardwareAvailable = await LocalAuthentication.hasHardwareAsync();
      if (!isHardwareAvailable) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'No Biometrics',
          textBody: 'Biometric authentication is not available on this device.',
        });
        return;
      }

      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!savedBiometrics) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'No Biometrics Enrolled',
          textBody: 'Please set up biometric authentication on your device.',
        });
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to Reset Password',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        setIsAuthenticated(true);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Authenticated',
          textBody: 'Biometric authentication successful.',
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Authentication Failed',
          textBody: 'Biometric authentication failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Unable to authenticate. Please try again.',
      });
    }
  };

  // Reset Password Logic
  const resetPassword = async () => {
    if (!isAuthenticated) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Unauthorized',
        textBody: 'Please authenticate using biometrics before resetting your password.',
      });
      return;
    }

    setLoading(true);

    // Validation
    if (!user.password || !user.confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'All fields are required.',
      });
      setLoading(false);
      return;
    }

    if (user.password !== user.confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Passwords do not match.',
      });
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(user.password)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody:
          'Password must contain at least one number, one lowercase letter, one uppercase letter, and be 6-20 characters long.',
      });
      setLoading(false);
      return;
    }

    const pass = {
      password: user.password,
    };

    try {
      const response = await api.put(`/users/password/reset-password-user`, pass,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data?.status_code === 200) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Password reset successfully',
        });
        await AsyncStorage.removeItem('token');
        router.push('/sign-in');
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: response?.data?.message || 'Something went wrong.',
        });
      }
    } catch (error) {
      console.error('Password reset error:', error.response?.data || error.message);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Unable to reset password. Please try again.',
      });
    }

    setLoading(false);
  };

  const getToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
        setToken(JSON.parse(storedToken));
    }
};

  useEffect(() => {
    getToken();
    handleBiometricAuth(); // Trigger biometric authentication on component mount
  }, []);

  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="absolute mt-12 px-4 top-6 left-6 flex flex-row gap-x-4">
        {/* left arrow */}
        <Feather name="arrow-left" size={24} color="black" onPress={goBack} />
       <Text className="text-gray-800 text-lg font-psemibold" onPress={goBack}>Back</Text>
      </View>
      <Text className="text-2xl font-pbold text-gray-800 mb-6">Reset Password</Text>
      <View className="bg-white w-full p-6 rounded-lg shadow-md">
        <FormField
          label="New Password"
          title="Password"
          placeholder="Enter your new password"
          value={user.password}
          handleChangeText={(e) => setUser({ ...user, password: e })}
          secureTextEntry
        />
        <FormField
          label="Confirm Password"
          placeholder="Confirm your new password"
          title="Retype Password"
          value={user.confirmPassword}
          handleChangeText={(e) => setUser({ ...user, confirmPassword: e })}
          secureTextEntry
        />
        <CustomButton
          title="Reset Password"
          handlePress={resetPassword}
          isLoading={loading}
          containerStyles="mt-6"
          textStyles="text-white"
        />
       
      </View>
    </View>
  );
};

export default ResetPasswordUser;
