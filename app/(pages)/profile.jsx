import { ActivityIndicator, ScrollView, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../api/api'
import { router } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { RefreshControl } from 'react-native'
import Loader from '../../components/Loader'
import TitleHeader from '../../components/header'
import { MaterialIcons } from '@expo/vector-icons'

const Profile = () => {
  const [token, setToken] = useState()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState()

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token')
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

  useEffect(() => {
    getToken()
    getUser()
  }, [token])

  const ProfileItem = ({ icon, label, value }) => (
    <View className="flex-row items-center bg-white p-4 rounded-xl mb-4 shadow-sm">
      <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
        <MaterialIcons name={icon} size={24} color="#3b82f6" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-sm font-pmedium text-gray-500">{label}</Text>
        <Text className="text-base font-psemibold text-gray-900 mt-1">
          {value || 'N/A'}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TitleHeader name="Profile" />
      
      {loading ? (
        <Loader />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Profile Header */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-3">
              <Text className="text-2xl font-pbold text-blue-500">
                {user?.name?.charAt(0) || '?'}
              </Text>
            </View>
            <Text className="text-xl font-pbold text-gray-900">{user?.name}</Text>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="verified" size={16} color="#3b82f6" />
              <Text className="text-sm text-gray-500 ml-1 font-pregular">
                {user?.is_student ? 'Student' : 'Professional'}
              </Text>
            </View>
          </View>

          {/* Profile Details */}
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-pbold text-gray-900 mb-4">
              Personal Information
            </Text>
            <ProfileItem icon="email" label="Email" value={user?.email} />
            <ProfileItem icon="phone" label="Phone" value={user?.phone} />
            <ProfileItem icon="location-on" label="Location" value={user?.location} />
          </View>

          {/* Skills Section */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-lg font-pbold text-gray-900 mb-4">Skills</Text>
            <View className="flex-row flex-wrap">
              {user?.skills?.split(',').map((skill, index) => (
                <View
                  key={index}
                  className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  <Text className="text-blue-600 font-medium">{skill.trim()}</Text>
                </View>
              )) || (
                <Text className="text-gray-500">No skills listed</Text>
              )}
            </View>
          </View>

          {/* Edit Profile Button */}
         
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Profile