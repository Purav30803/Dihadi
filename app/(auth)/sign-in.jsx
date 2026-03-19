import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import FormField from '../../components/FormField'
import { Link, router } from 'expo-router'
import api from '../../api/api'
import { Toast, ALERT_TYPE } from 'react-native-alert-notification'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn = () => {
  const [form, setForm] = React.useState({ email: '', password: '' })
  const [loading, setLoading] = React.useState(false)
  const { colors, isDark } = useTheme();

  const getToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) router.push('/home');
  };

  useEffect(() => { getToken() }, [])

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'All fields are required' })
      return
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(form.email)) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Invalid email address' })
      return
    }
    setLoading(true)
    try {
      const response = await api.post('/users/login', form)
      if (response?.data?.status_code == 400) {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: response?.data?.message })
        router.push('/otpVerification')
        await AsyncStorage.setItem('email', form.email)
      }
      if (response?.data?.token) {
        await AsyncStorage.setItem('token', JSON.stringify(response?.data?.token))
        router.push('/home')
      }
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Something went wrong.'
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: message })
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 36 }}>
          <Text style={{ fontSize: 32, fontFamily: 'Poppins-Bold', color: colors.label, marginBottom: 8 }}>
            Welcome back
          </Text>
          <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color: colors.labelSecondary }}>
            Sign in to your Dihadi account
          </Text>
        </View>

        {/* Form Card */}
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
            title="Email"
            placeholder="Enter your email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
          />
          <FormField
            title="Password"
            placeholder="Enter your password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
          />

          {/* Forgot Password */}
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 12 }} onPress={() => router.push('/forgot-password')}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins-Medium', fontSize: 14 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
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
            marginBottom: 24,
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.labelSecondary, fontFamily: 'Poppins-Regular', fontSize: 15 }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins-SemiBold', fontSize: 15 }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
