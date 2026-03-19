import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import api from '../../api/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, isDark } = useTheme();

  const sendOTP = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: email ? 'Invalid email' : 'Email is required' });
      return;
    }
    await AsyncStorage.setItem('email', email);
    setLoading(true);
    try {
      const response = await api.post('/users/forgot-otp', { email });
      if (response?.data?.status_code === 200) {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'OTP Sent', textBody: response?.data?.message });
        router.push('/forgotOtpVerification');
      } else {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: response?.data?.message });
      }
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: error.response?.data || error.message });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.push('/sign-in')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 32,
            width: 100,
          }}
        >
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surfaceSecondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Feather name="arrow-left" size={18} color={colors.label} />
          </View>
          <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', color: colors.label }}>Back</Text>
        </TouchableOpacity>

        {/* Icon */}
        <View style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: colors.pillBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}>
          <Feather name="lock" size={32} color={colors.primary} />
        </View>

        {/* Title */}
        <Text style={{ fontSize: 28, fontFamily: 'Poppins-Bold', color: colors.label, marginBottom: 8 }}>
          Forgot Password?
        </Text>
        <Text style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginBottom: 32, lineHeight: 22 }}>
          Enter your email address and we'll send you an OTP to reset your password.
        </Text>

        {/* Form */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0 : 0.06,
          shadowRadius: 12,
          elevation: isDark ? 0 : 3,
          borderWidth: isDark ? 0.5 : 0,
          borderColor: colors.separator,
          marginBottom: 24,
        }}>
          <FormField
            title="Email Address"
            placeholder="Enter your email"
            value={email}
            handleChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          onPress={sendOTP}
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
            <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
