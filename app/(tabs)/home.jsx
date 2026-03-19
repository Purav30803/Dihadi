import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const { colors, isDark } = useTheme();

  const getTokenAndUserId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) setToken(JSON.parse(token));
  };

  const getSearch = async () => {
    try {
      const response = await api.get(`/job_post/jobs?search=${debouncedQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!token) getTokenAndUserId();
    getSearch();
  }, [token]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 800);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (token) getSearch();
  }, [debouncedQuery, token]);

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    try {
      await api.get(`/application/apply?post_id=${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Applied!', textBody: 'Application submitted successfully.' });
    } catch (error) {
      if (error.response?.status === 400) {
        Toast.show({ type: ALERT_TYPE.WARNING, title: 'Already Applied', textBody: 'You already applied for this job.' });
      } else if (error.response?.status === 401) {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Session Expired', textBody: 'Please log in again.' });
      } else {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to apply. Please try again.' });
      }
    }
    setApplyingId(null);
  };

  const JobCard = ({ item }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0 : 0.06,
      shadowRadius: 12,
      elevation: isDark ? 0 : 3,
      borderWidth: isDark ? 0.5 : 0,
      borderColor: colors.separator,
    }}>
      {/* Title & Description */}
      <Text style={{ fontSize: 18, fontFamily: 'Poppins-Bold', color: colors.label, marginBottom: 4 }}>
        {item.job_title}
      </Text>
      <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, lineHeight: 20, marginBottom: 14 }} numberOfLines={2}>
        {item.job_description}
      </Text>

      {/* Meta row */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Feather name="map-pin" size={13} color={colors.labelTertiary} />
          <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>{item.location}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Feather name="clock" size={13} color={colors.labelTertiary} />
          <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>
            {item.shift_start} – {item.shift_end}
          </Text>
        </View>
      </View>

      {/* Salary */}
      <Text style={{ fontSize: 17, fontFamily: 'Poppins-SemiBold', color: colors.primary, marginBottom: 12 }}>
        {item.salary}
      </Text>

      {/* Skills */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {item.skills_required.split(',').map((skill, index) => (
          <View key={index} style={{
            backgroundColor: colors.pillBg,
            borderRadius: 100,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}>
            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.pillText }}>
              {skill.trim()}
            </Text>
          </View>
        ))}
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        onPress={() => handleApply(item?.id)}
        activeOpacity={0.85}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 13,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {applyingId === item?.id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 15 }}>Apply Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 }}>
        <Text style={{ flex: 1, fontSize: 28, fontFamily: 'Heading', color: colors.label }}>Dihadi</Text>
        <Link href="/jobPost" asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 13 }}>Post a Job</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: colors.separator,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0 : 0.04,
          shadowRadius: 4,
        }}>
          <Feather name="search" size={18} color={colors.labelTertiary} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 15,
              fontFamily: 'Poppins-Regular',
              color: colors.label,
            }}
            placeholder="Search jobs, skills, location..."
            placeholderTextColor={colors.labelTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={colors.labelTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Job List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <JobCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Feather name="inbox" size={52} color={colors.labelTertiary} />
            <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.label, marginTop: 16 }}>
              No jobs found
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginTop: 6 }}>
              Try different search terms
            </Text>
          </View>
        }
      />

      {/* Refresh FAB */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 6,
        }}
        onPress={getSearch}
      >
        <Feather name="refresh-cw" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
