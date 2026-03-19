import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import { Feather } from '@expo/vector-icons';
import TitleHeader from '../../components/header';
import { router } from 'expo-router';
import timestamp_to_date from '../../components/timestamp';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDark } = useTheme();

  const getToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) setToken(JSON.parse(storedToken));
  };

  const getJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/job_post/my_jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response?.data || []);
    } catch (err) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    getToken();
    if (token) getJobs();
  }, [token]);

  const handleRouting = (id) => {
    router.push(`/(pages)/${id}`);
  };

  const StatusBadge = ({ status }) => {
    const isActive = status === 'Active';
    return (
      <View style={{
        backgroundColor: isActive ? colors.greenMuted : colors.redMuted,
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}>
        <Text style={{
          fontSize: 12,
          fontFamily: 'Poppins-SemiBold',
          color: isActive ? colors.green : colors.red,
        }}>
          {status}
        </Text>
      </View>
    );
  };

  const JobCard = ({ job }) => (
    <TouchableOpacity
      onPress={() => handleRouting(job?.id)}
      activeOpacity={0.85}
      style={{
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
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: colors.label }} numberOfLines={1}>
            {job.job_title}
          </Text>
          <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginTop: 2 }} numberOfLines={1}>
            {job.job_description}
          </Text>
        </View>
        <StatusBadge status={job.status} />
      </View>

      <View style={{ height: 1, backgroundColor: colors.separator, marginVertical: 12 }} />

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="map-pin" size={14} color={colors.labelTertiary} />
          <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelSecondary }}>{job.location}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="clock" size={14} color={colors.labelTertiary} />
          <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelSecondary }}>
            {job.shift_start} – {job.shift_end}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="dollar-sign" size={14} color={colors.labelTertiary} />
          <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.primary }}>{job.salary}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name="calendar" size={14} color={colors.labelTertiary} />
            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>Posted</Text>
          </View>
          <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>
            {timestamp_to_date(job.timestamp)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TitleHeader name="Posted Jobs" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {jobs.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Feather name="briefcase" size={52} color={colors.labelTertiary} />
            <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.label, marginTop: 16 }}>
              No job postings yet
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginTop: 6, textAlign: 'center' }}>
              Tap the button below to create your first job posting
            </Text>
          </View>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </ScrollView>

      {/* Post Job Button */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <TouchableOpacity
          onPress={() => router.push('jobPost')}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
            + Post a New Job
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyJobs;
