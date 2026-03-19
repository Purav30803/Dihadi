import { ActivityIndicator, ScrollView, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import TitleHeader from '../../components/header';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const Profile = () => {
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) setToken(JSON.parse(token));
  };

  const getUser = async () => {
    setLoading(true);
    if (!token) return;
    try {
      const response = await api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
      setUser(response.data);
    } catch (err) {
      console.log(err.response?.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  };

  useEffect(() => { getToken(); getUser(); }, [token]);

  const InfoRow = ({ icon, label, value }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.separator }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
        <MaterialIcons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>{label}</Text>
        <Text style={{ fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.label, marginTop: 2 }}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TitleHeader name="Profile" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar & Name */}
          <View style={{ alignItems: 'center', paddingVertical: 28 }}>
            <View style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.pillBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              borderWidth: 3,
              borderColor: colors.primary,
            }}>
              <Text style={{ fontSize: 32, fontFamily: 'Poppins-Bold', color: colors.primary }}>
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
            <Text style={{ fontSize: 22, fontFamily: 'Poppins-Bold', color: colors.label }}>{user?.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 }}>
              <MaterialIcons name="verified" size={16} color={colors.primary} />
              <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary }}>
                {user?.is_student ? 'Student' : 'Professional'}
              </Text>
            </View>
          </View>

          {/* Personal Info */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingBottom: 4,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0 : 0.05,
            shadowRadius: 8,
            borderWidth: isDark ? 0.5 : 0,
            borderColor: colors.separator,
          }}>
            <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, paddingTop: 16, paddingBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Personal Information
            </Text>
            <InfoRow icon="email" label="Email" value={user?.email} />
            <InfoRow icon="phone" label="Phone" value={user?.phone} />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <MaterialIcons name="location-on" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>Location</Text>
                <Text style={{ fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.label, marginTop: 2 }}>{user?.location || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Skills */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0 : 0.05,
            shadowRadius: 8,
            borderWidth: isDark ? 0.5 : 0,
            borderColor: colors.separator,
          }}>
            <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Skills
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {user?.skills?.split(',').map((skill, i) => (
                <View key={i} style={{ backgroundColor: colors.pillBg, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7 }}>
                  <Text style={{ fontSize: 13, fontFamily: 'Poppins-Medium', color: colors.pillText }}>{skill.trim()}</Text>
                </View>
              )) || <Text style={{ color: colors.labelTertiary }}>No skills listed</Text>}
            </View>
          </View>

          {/* Working Hours */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingBottom: 8,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0 : 0.05,
            shadowRadius: 8,
            borderWidth: isDark ? 0.5 : 0,
            borderColor: colors.separator,
          }}>
            <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, paddingTop: 16, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Working Hours
            </Text>
            {user?.working_hours ? (
              Object.entries(user.working_hours).map(([day, hours], i, arr) => (
                <View key={i} style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: i < arr.length - 1 ? 0.5 : 0,
                  borderBottomColor: colors.separator,
                }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: colors.labelSecondary }}>{day}</Text>
                  <Text style={{ fontSize: 14, fontFamily: 'Poppins-SemiBold', color: hours ? colors.label : colors.labelTertiary }}>
                    {hours || 'Not set'}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: colors.labelTertiary, paddingBottom: 12 }}>No working hours listed</Text>
            )}
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            onPress={() => router.push('/editProfile')}
            activeOpacity={0.85}
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
            <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>Edit Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Profile;
