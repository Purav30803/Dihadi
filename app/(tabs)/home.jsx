import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import TitleHeader from '../../components/header';
import { Link } from 'expo-router';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const getTokenAndUserId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setToken(JSON.parse(token));
    }
   
  };

  const getSearch = async () => {
    try {
      const response = await api.get(`/job_post/jobs?search=${debouncedQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (token) getSearch();
  }, [debouncedQuery, token]);

  console.log('Posts:', posts);
  // Function to handle Apply button
  const handleApply = async (jobId) => {
    try {
      const response = await api.get(
        `/application/apply?post_id=${jobId}`, // API endpoint to apply for a job
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the user's token
          },
        }
      );
  
      console.log('Apply response:', response.data);
  
      // Show success notification
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'You have successfully applied for the job.',
      });
    } catch (error) {
      console.error('Apply error:', error.response || error.message);
  
      // Handle specific errors and show appropriate alerts
      if (error.response?.status === 400) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Duplicate Application',
          textBody: 'You have already applied for this job.',
        });
      } else if (error.response?.status === 401) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Authentication Failed',
          textBody: 'Your session has expired. Please log in again.',
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Failed to apply for the job. Please try again.',
        });
      }
    }
  };

  const renderJobCard = ({ item }) => (
    <View className="bg-white rounded-2xl shadow-2xl border p-6 mb-4 border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-pbold text-gray-900">{item.job_title}</Text>
          <Text className="text-base text-gray-500 mt-1 font-pregular leading-5" numberOfLines={2}>
            {item.job_description}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center">
        <View className="items-center flex-row flex-1">
          <Feather name="map-pin" size={16} color="#6B7280" />
          <Text className="text-gray-600 font-pregular ml-2">{item.location}</Text>
        </View>
      </View>
      <View className="mt-4 flex-row items-center">
        <Text className="text-blue-600 font-psemibold"> {item.salary}</Text>
      </View>

      <View className="mt-3 pt-3 border-t border-gray-100">
        <Text className="text-gray-600 text-sm mb-2 font-pregular">Required Skills:</Text>
        <View className="flex-row flex-wrap">
          {item.skills_required.split(',').map((skill, index) => (
            <View key={index} className="bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2">
              <Text className="text-xs text-blue-500 font-pregular">{skill.trim()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-3 flex-row items-center">
        <Feather name="clock" size={16} color="#6B7280" />
        <Text className="text-gray-600 text-sm ml-2 font-pregular">
          {item.shift_start} {'-'} {item.shift_end}
        </Text>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
        onPress={() => handleApply(item?.id)}
      >
        <Text className="text-white text-center font-pbold">Apply</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center">
        <TitleHeader name="Dihadi" />
        <View className="flex-row gap-x-4 -mt-2">
          <View className="mr-4 border py-2 px-3 rounded-full">
            <Link href="/jobPost">
              <Text>Post a Job</Text>
            </Link>
          </View>
        </View>
      </View>
      <View className="px-4 shadow-sm">
        <View className="flex-row items-center border border-gray-100 rounded-xl px-4 py-2">
          <Feather name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search jobs..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-10">
            <Feather name="inbox" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4 text-lg">No jobs found</Text>
            <Text className="text-gray-400 text-sm mt-1">Try adjusting your search</Text>
          </View>
        }
      />

      <TouchableOpacity
        className="absolute bottom-10 right-10 bg-blue-600 rounded-full p-4 shadow-lg"
        onPress={getSearch}
      >
        <Feather name="refresh-cw" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
