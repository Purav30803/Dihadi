import { View, Text, BackHandler, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import FormField from '../../components/FormField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const ForgotOtpVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, isDark } = useTheme();

  const getEmail = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    setEmail(storedEmail);
  };

  const writeOtp = (otpValue) => {
    if (otpValue.length === 6) Keyboard.dismiss();
    setOtp(otpValue);
  };

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => { getEmail(); }, []);

  const handleSubmit = async () => {
    if (!otp) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'OTP is required' });
      return;
    }
    if (otp.length < 6) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'OTP must be 6 digits' });
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/users/forgot-password/verify?email=${email}&otp=${otp}`);
      if (response?.data?.status_code === 200) {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'OTP Verified Successfully' });
        await AsyncStorage.setItem('email', email);
        router.push('/reset-password');
      }
    } catch (err) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Invalid OTP. Please try again.' });
    }
    setLoading(false);
  };

  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

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
            <Feather name="mail" size={32} color={colors.primary} />
          </View>
          <Text style={{ fontSize: 26, fontFamily: 'Poppins-Bold', color: colors.label, textAlign: 'center' }}>
            Check Your Email
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
            We sent a 6-digit code to{'\n'}
            <Text style={{ fontFamily: 'Poppins-SemiBold', color: colors.label }}>{maskedEmail}</Text>
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
            title="Verification Code"
            placeholder="Enter 6-digit OTP"
            value={otp}
            handleChangeText={writeOtp}
            keyboardType="numeric"
            maxLength={6}
          />

          <TouchableOpacity
            onPress={handleSubmit}
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
              <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>Verify Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotOtpVerification;
