import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleHeader from '../../components/header';
import FormField from '../../components/FormField';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const { colors, isDark } = useTheme();
  const [form, setForm] = useState({
    name: '', phone: '', location: '', skills: '',
    working_hours: { Monday: '', Tuesday: '', Wednesday: '', Thursday: '', Friday: '', Saturday: '', Sunday: '' },
  });

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) setToken(JSON.parse(token));
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const user = response.data;
      setForm({
        name: user.name || '', phone: user.phone || '', location: user.location || '', skills: user.skills || '',
        working_hours: user.working_hours || { Monday: '', Tuesday: '', Wednesday: '', Thursday: '', Friday: '', Saturday: '', Sunday: '' },
      });
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to fetch user details.' });
    }
    setLoading(false);
  };

  useEffect(() => { getToken(); }, []);
  useEffect(() => { if (token) fetchUserDetails(); }, [token]);

  const handleInputChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleWorkingHoursChange = (day, value) => setForm(prev => ({ ...prev, working_hours: { ...prev.working_hours, [day]: value } }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.location || !form.skills) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'All fields are required' });
      return;
    }
    const workingHoursRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] - ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (Object.values(form.working_hours).some(v => v.trim() !== '') && !Object.values(form.working_hours).every(v => v.trim() === '' || workingHoursRegex.test(v))) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Invalid working hours format. Use HH:MM - HH:MM' });
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/me', { ...form }, { headers: { Authorization: `Bearer ${token}` } });
      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Profile Updated Successfully' });
      router.push('/profile');
    } catch (error) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to update profile.' });
    }
    setLoading(false);
  };

  const SectionCard = ({ title, children }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0 : 0.05,
      shadowRadius: 8,
      borderWidth: isDark ? 0.5 : 0,
      borderColor: colors.separator,
    }}>
      <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TitleHeader name="Edit Profile" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SectionCard title="Basic Information">
            <FormField title="Full Name" placeholder="Your full name" value={form.name} handleChangeText={(e) => handleInputChange('name', e)} />
            <FormField title="Phone" placeholder="Phone number" value={form.phone} handleChangeText={(e) => handleInputChange('phone', e)} />
            <FormField title="Location" placeholder="Your city" value={form.location} handleChangeText={(e) => handleInputChange('location', e)} />
            <FormField title="Skills" placeholder="e.g. Cooking, Driving (comma-separated)" value={form.skills} handleChangeText={(e) => handleInputChange('skills', e)} />
          </SectionCard>

          <SectionCard title="Working Hours">
            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary, marginBottom: 12 }}>
              Format: HH:MM - HH:MM (24-hour). Leave blank if unavailable.
            </Text>
            {DAYS.map((day, index) => (
              <View
                key={day}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  borderBottomWidth: index < DAYS.length - 1 ? 0.5 : 0,
                  borderBottomColor: colors.separator,
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: colors.label, width: 90 }}>{day}</Text>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: colors.inputBorder,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                    color: colors.label,
                    backgroundColor: colors.inputBg,
                  }}
                  placeholder="09:00 - 17:00"
                  placeholderTextColor={colors.labelTertiary}
                  value={form.working_hours[day]}
                  onChangeText={(value) => handleWorkingHoursChange(day, value)}
                />
              </View>
            ))}
          </SectionCard>

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
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default EditProfile;
