import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TitleHeader from '../../components/header';
import { router } from 'expo-router';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const getToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      setToken(JSON.parse(storedToken));
    }
  };

  const getJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/job_post/my_jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    if (token) {
      getJobs();
    }
  }, [token]);

  const handleRouting = (id) => {
    router.push(`/(pages)/${id}`);
  };

  const JobCard = ({ job }) => (
    <TouchableOpacity
      onPress={() => handleRouting(job?.id)}
      className="bg-white rounded-2xl shadow-2xl border p-6 mb-4 border-gray-100"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-pbold text-gray-900">{job.job_title}</Text>
          <Text className="text-base text-gray-500 mt-1 font-pregular leading-5" numberOfLines={2}>
            {job.job_description}
          </Text>
        </View>
        <View className={`rounded-full px-3 py-1 ${job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <Text className="text-xs font-medium">{job.status}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center">
        <Feather name="map-pin" size={16} color="#6B7280" />
        <Text className="text-gray-600 font-pregular ml-2">{job.location}</Text>
      </View>

      <View className="mt-3 flex-row items-center">
        <Feather name="clock" size={16} color="#6B7280" />
        <Text className="text-gray-600 text-sm ml-2 font-pregular">
          {job.shift_start} 
          {' - '}
          {job.shift_end}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center">
        <Feather name="dollar-sign" size={16} color="#6B7280" />
        <Text className="text-gray-600 font-pregular ml-2">{job.salary}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TitleHeader name="Posted Jobs" />

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {jobs.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-10">
            <Feather name="briefcase" size={48} color="#9CA3AF" />
            <Text className="text-center text-xl text-gray-500 mt-4">You have no job postings.</Text>
          </View>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push('jobPost')}
        className="bg-blue-600 py-3 rounded-full mx-4 mb-6"
      >
        <Text className="text-center text-white text-lg font-psemibold">Post a New Job</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyJobs;
