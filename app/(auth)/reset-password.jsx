import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FormField from '../../components/FormField';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import CustomButton from '../../components/customButton';
import { router } from 'expo-router';
import { Link } from 'expo-router';

const ResetPassword = () => {
  const [user, setUser] = useState({
    password: '',
    confirmPassword: '',
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch email from AsyncStorage
  const getEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'No Email Found',
          textBody: 'Please log in to reset your password.',
        });

      }
    } catch (error) {
      console.error('Error fetching email:', error);
    }
  };

  // Reset Password Logic
  const resetPassword = async () => {
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
      email,
      password: user.password,
    };



    try {
      const response = await api.put(`/users/password/reset-password`, pass);
      if (response?.data?.status_code === 200) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Password reset successfully. Please log in.',
        });
        await AsyncStorage.removeItem('email');
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

  useEffect(() => {
    getEmail();
  }, []);

  return (
    <View className="flex-1 justify-center items-center px-6">
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
        {
           
        }
        <CustomButton
          title="Reset Password"
          handlePress={resetPassword}
          isLoading={loading}
          containerStyles="mt-6"
          textStyles="text-white"
        />

        <View className="flex flex-row justify-center mt-4">
          <Text className="text-gray-600 text-center font-pregular">
            Remember your password?{' '}
          </Text>
          <TouchableOpacity>
            <Link className="text-secondary font-psemibold text-center underline" href="/sign-in">
              Log In
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ResetPassword;
