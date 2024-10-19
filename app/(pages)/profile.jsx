import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api'
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { RefreshControl } from 'react-native'
import Loader from '../../components/Loader';
import TitleHeader from '../../components/header';


const Profile = () => {
  const [token, setToken] = useState()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState()

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setToken(JSON.parse(token))
    }
  }

  const getUser = async () => {
    setLoading(true)
    if (!token) {
      return
    }
    try {
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data)
    }
    catch (err) {
      console.log(err.response.data)
      setLoading(false)
    }
    setLoading(false)
  }
  const onRefresh = async () => {
    setRefreshing(true)
    await getUser()
    setRefreshing(false)
  }

  // Intersep
  useEffect(() => {
    getToken();
    getUser();
  }, [token])

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle="p-6 flex items-center">
        {/* Profile Heading */}
<TitleHeader name="Profile" />
        {/* User Card */}
       {loading?<Loader />: 
       <ScrollView className="w-full rounded-lg pb-12 px-12"  refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
       > 
          <Text className="text-lg font-pbold text-gray-700 mb-2">Name</Text>
          <Text className="text-base font-pregular text-gray-900 mb-6">{user?.name || 'N/A'}</Text>

          <Text className="text-lg font-pbold text-gray-700 mb-2">Email</Text>
          <Text className="text-base font-pregular text-gray-900 mb-6">{user?.email || 'N/A'}</Text>

          <Text className="text-lg font-pbold text-gray-700 mb-2">Phone</Text>
          <Text className="text-base font-pregular text-gray-900 mb-6">{user?.phone || 'N/A'}</Text>

          <Text className="text-lg font-pbold text-gray-700 mb-2">Skills</Text>
          <Text className="text-base font-pregular text-gray-900 mb-6">{user?.skills || 'N/A'}</Text>

          <Text className="text-lg font-pbold text-gray-700 mb-2">Location</Text>
          <Text className="text-base font-pregular text-gray-900 mb-6">{user?.location || 'N/A'}</Text>

          <Text className="text-lg font-pbold text-gray-700 mb-2">Student</Text>
          <Text className="text-base font-pregular text-gray-900">{user?.is_student ? 'Yes' : 'No'}</Text>

         
        </ScrollView>
         } 
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
