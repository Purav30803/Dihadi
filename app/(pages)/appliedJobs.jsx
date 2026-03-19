import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import TitleHeader from '../../components/header';
import timestamp_to_date from '../../components/timestamp';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const AppliedJobs = () => {
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const { colors, isDark } = useTheme();

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) setToken(JSON.parse(token));
  };

  const fetchJobs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await api.get('/users/jobs/applied', { headers: { Authorization: `Bearer ${token}` } });
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  useEffect(() => { getToken(); }, []);
  useEffect(() => { fetchJobs(); }, [token]);

  const StatusBadge = ({ status }) => {
    const isActive = status === 'active';
    return (
      <View style={{
        backgroundColor: isActive ? colors.greenMuted : colors.redMuted,
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}>
        <Text style={{ fontSize: 12, fontFamily: 'Poppins-SemiBold', color: isActive ? colors.green : colors.red, textTransform: 'capitalize' }}>
          {status}
        </Text>
      </View>
    );
  };

  const JobCard = ({ job }) => (
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: colors.label }} numberOfLines={1}>{job.title}</Text>
          <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginTop: 2 }} numberOfLines={2}>{job.description}</Text>
        </View>
        <StatusBadge status={job.status} />
      </View>

      <View style={{ height: 0.5, backgroundColor: colors.separator, marginBottom: 12 }} />

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="calendar" size={14} color={colors.labelTertiary} />
          <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>
            Applied {timestamp_to_date(job.applied_at)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TitleHeader name="Applied Jobs" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : jobs?.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Feather name="briefcase" size={52} color={colors.labelTertiary} />
            <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.label, marginTop: 16 }}>
              No applications yet
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginTop: 6, textAlign: 'center' }}>
              Start exploring jobs and apply to get started
            </Text>
          </View>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppliedJobs;
