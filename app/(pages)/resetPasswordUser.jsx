import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import FormField from '../../components/FormField';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleHeader from '../../components/header';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const ResetPasswordUser = () => {
  const [user, setUser] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const { colors, isDark } = useTheme();

  const handleBiometricAuth = async () => {
    try {
      const isHardwareAvailable = await LocalAuthentication.hasHardwareAsync();
      if (!isHardwareAvailable) {
        Toast.show({ type: ALERT_TYPE.WARNING, title: 'No Biometrics', textBody: 'Biometric authentication is not available on this device.' });
        return;
      }
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!savedBiometrics) {
        Toast.show({ type: ALERT_TYPE.WARNING, title: 'No Biometrics Enrolled', textBody: 'Please set up biometric authentication on your device.' });
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to Reset Password',
        fallbackLabel: 'Use Passcode',
      });
      if (result.success) {
        setIsAuthenticated(true);
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Authenticated', textBody: 'Biometric authentication successful.' });
      } else {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Authentication Failed', textBody: 'Biometric authentication failed. Please try again.' });
      }
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Unable to authenticate. Please try again.' });
    }
  };

  const resetPassword = async () => {
    if (!isAuthenticated) {
      Toast.show({ type: ALERT_TYPE.WARNING, title: 'Unauthorized', textBody: 'Please authenticate using biometrics before resetting your password.' });
      return;
    }
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
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Password must contain at least one number, one lowercase and uppercase letter, and be 6-20 characters.' });
      setLoading(false);
      return;
    }
    try {
      const response = await api.put('/users/password/reset-password-user', { password: user.password }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data?.status_code === 200) {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Password reset successfully.' });
        await AsyncStorage.removeItem('token');
        router.push('/sign-in');
      } else {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: response?.data?.message || 'Something went wrong.' });
      }
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Unable to reset password. Please try again.' });
    }
    setLoading(false);
  };

  const getToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) setToken(JSON.parse(storedToken));
  };

  useEffect(() => {
    getToken();
    handleBiometricAuth();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TitleHeader name="Reset Password" />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
        {/* Biometric status banner */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isAuthenticated ? colors.greenMuted : colors.primaryMuted,
          borderRadius: 14,
          padding: 14,
          marginBottom: 20,
          gap: 10,
        }}>
          <Feather
            name={isAuthenticated ? 'check-circle' : 'shield'}
            size={20}
            color={isAuthenticated ? colors.green : colors.primary}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: isAuthenticated ? colors.green : colors.primary }}>
              {isAuthenticated ? 'Identity Verified' : 'Biometric Required'}
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: colors.labelSecondary, marginTop: 1 }}>
              {isAuthenticated ? 'You can now set a new password' : 'Authenticate to proceed'}
            </Text>
          </View>
          {!isAuthenticated && (
            <TouchableOpacity onPress={handleBiometricAuth} activeOpacity={0.7}>
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: colors.primary }}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Card */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0 : 0.06,
          shadowRadius: 12,
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
            disabled={loading || !isAuthenticated}
            style={{
              backgroundColor: isAuthenticated ? colors.primary : colors.separator,
              height: 56,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: isAuthenticated ? 0.3 : 0,
              shadowRadius: 12,
              elevation: isAuthenticated ? 6 : 0,
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordUser;
