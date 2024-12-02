import { View, Text ,TouchableOpacity, ScrollView,RefreshControl} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import TitleHeader from '../../components/header';
import { ActivityIndicator } from 'react-native';
import Loader from '../../components/Loader';
import timestamp_to_date from '../../components/timestamp';

const AppliedJobs = () => {

    const [token, setToken] = useState();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [jobs, setJobs] = useState();
    const router = useRouter();

    const getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            setToken(JSON.parse(token));
        }
    };



    const fetchJobs = async () => {

        setLoading(true);
        try {
            const response = await api.get('/users/jobs/applied', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.jobs+"applied jobs");
            setJobs(response.data.jobs);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
        setLoading(false);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchJobs();
        setRefreshing(false);
      };


    useEffect(() => {
        fetchJobs();
        getToken();
    }, [token]);

    const JobCard = ({ job }) => (
        <TouchableOpacity
          className="bg-white rounded-2xl shadow-2xl border p-6 mb-4 border-gray-100"
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-pbold text-gray-900 truncate "numberOfLines={1}>{job.job_title}</Text>
              <Text className="text-base text-gray-500 mt-1 font-pregular leading-5 truncate max-w-full" numberOfLines={1} >
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
          <View className="mt-3 flex-row items-center">
            <Feather name="calendar" size={16} color="#6B7280" />
            <Text className="text-gray-600 font-pregular ml-2">{timestamp_to_date(job.timestamp)}</Text>
          </View>
        </TouchableOpacity>
      );
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
    <TitleHeader name="Applied Jobs" />
   
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      
      {jobs?.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Feather name="briefcase" size={48} color="#9CA3AF" />
          <Text className="text-center text-xl text-gray-500 mt-4">You didn't Applied anywhere</Text>
        </View>
      ) : (
       
        jobs?.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </ScrollView>

   
  </SafeAreaView>
  )
}

export default AppliedJobs