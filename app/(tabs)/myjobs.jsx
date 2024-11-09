import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import { MaterialIcons } from '@expo/vector-icons';
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
      if(response?.data) {
        setJobs(response?.data || []);
      }
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
    console.log(id);
    router.push(`/(pages)/${id}`);
  };

  const JobCard = ({ job }) => (
    <TouchableOpacity
      onPress={()=>handleRouting(job?.id)} // Change to navigation
      className="bg-white rounded-lg p-4 shadow-md mb-4"
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold text-gray-800">{job.job_title}</Text>
        <Text className={`text-sm font-medium ${job.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
          {job.status}
        </Text>
      </View>
      <Text className="text-sm text-gray-600 mt-2">{job.job_description}</Text>
      <View className="flex-row items-center mt-2">
        <MaterialIcons name="schedule" size={16} color="#6B7280" />
        <Text className="text-sm text-gray-500 ml-1">
          {new Date(job.shift_start).toLocaleString()} - {new Date(job.shift_end).toLocaleString()}
        </Text>
      </View>
      <View className="flex-row items-center mt-2">
        <MaterialIcons name="location-on" size={16} color="#6B7280" />
        <Text className="text-sm text-gray-500 ml-1">{job.location}</Text>
      </View>
      <View className="flex-row items-center mt-2">
        <MaterialIcons name="attach-money" size={16} color="#6B7280" />
        <Text className="text-sm text-gray-500 ml-1">{job.salary}</Text>
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
    <SafeAreaView className="flex-1  bg-gray-50">
      <TitleHeader name="Posted Jobs" />
      
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {jobs.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-10">
            <MaterialIcons name="work-off" size={60} color="#9CA3AF" />
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
        <Text className="text-center text-white text-lg font-semibold">Post a New Job</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyJobs;
