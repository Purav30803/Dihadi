import { View, Text, BackHandler, Keyboard, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import FormField from '../../components/FormField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

const OtpVerification = () => {
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
      const response = await api.get(`/users/verify?email=${email}&otp=${otp}`);
      if (response?.data?.status_code === 200) {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Verified', textBody: 'Email verified successfully' });
        router.push('/sign-in');
      }
    } catch (err) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Invalid OTP. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: colors.pillBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Feather name="mail" size={36} color={colors.primary} />
          </View>
          <Text style={{ fontSize: 26, fontFamily: 'Poppins-Bold', color: colors.label, textAlign: 'center' }}>
            Verify Your Email
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20 }}>
            We sent a 6-digit code to{'\n'}
            <Text style={{ fontFamily: 'Poppins-SemiBold', color: colors.label }}>{email}</Text>
          </Text>
        </View>

        {/* OTP Card */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0 : 0.08,
          shadowRadius: 16,
          elevation: isDark ? 0 : 4,
          borderWidth: isDark ? 0.5 : 0,
          borderColor: colors.separator,
          marginBottom: 24,
        }}>
          <FormField
            title="OTP Code"
            placeholder="Enter 6-digit code"
            value={otp}
            handleChangeText={writeOtp}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            height: 56,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
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
            <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Verify Email</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpVerification;
