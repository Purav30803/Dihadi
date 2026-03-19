import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import FormField from '../../components/FormField';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const ResetPassword = () => {
  const [user, setUser] = useState({ password: '', confirmPassword: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, isDark } = useTheme();

  const getEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        Toast.show({ type: ALERT_TYPE.WARNING, title: 'No Email Found', textBody: 'Please log in to reset your password.' });
      }
    } catch (error) {
      console.error('Error fetching email:', error);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    if (!user.password || !user.confirmPassword) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'All fields are required.' });
      setLoading(false);
      return;
    }
    if (user.password !== user.confirmPassword) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Passwords do not match.' });
      setLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(user.password)) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Password must contain at least one number, one lowercase and uppercase letter, and be 6–20 characters.' });
      setLoading(false);
      return;
    }
    try {
      const response = await api.put('/users/password/reset-password', { email, password: user.password });
      if (response?.data?.status_code === 200) {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Password reset successfully. Please log in.' });
        await AsyncStorage.removeItem('email');
        router.push('/sign-in');
      } else {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: response?.data?.message || 'Something went wrong.' });
      }
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Unable to reset password. Please try again.' });
    }
    setLoading(false);
  };

  useEffect(() => { getEmail(); }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        {/* Icon */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Feather name="lock" size={32} color={colors.primary} />
          </View>
          <Text style={{ fontSize: 26, fontFamily: 'Poppins-Bold', color: colors.label, textAlign: 'center' }}>
            New Password
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, textAlign: 'center', marginTop: 8 }}>
            Create a strong password for your account
          </Text>
        </View>

        {/* Card */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0 : 0.08,
          shadowRadius: 16,
          borderWidth: isDark ? 0.5 : 0,
          borderColor: colors.separator,
        }}>
          <FormField
            title="New Password"
            placeholder="Enter your new password"
            value={user.password}
            handleChangeText={(e) => setUser({ ...user, password: e })}
            secureTextEntry
          />
          <View style={{ marginTop: 12 }}>
            <FormField
              title="Confirm Password"
              placeholder="Confirm your new password"
              value={user.confirmPassword}
              handleChangeText={(e) => setUser({ ...user, confirmPassword: e })}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={resetPassword}
            activeOpacity={0.85}
            disabled={loading}
            style={{
              backgroundColor: colors.primary,
              height: 56,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.labelSecondary }}>
            Remember your password?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/sign-in')}>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: colors.primary }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
