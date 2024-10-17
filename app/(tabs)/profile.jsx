import { ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api'

const Profile = () => {
  const [token, setToken] = useState()
  const [user, setUser] = useState()

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setToken(JSON.parse(token))
    }
  }

  const getUser = async () => {
    if (!token) {
      return
    }
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setUser(response.data)
  }

  useEffect(() => {
    getToken();
    getUser();
  }, [token])

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle="p-6 flex items-center">
        {/* Profile Heading */}
        <Text className="p-12 text-4xl font-pmedium text-gray-900">Profile</Text>

        {/* User Card */}
        <View className="w-full rounded-lg p-12">
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
