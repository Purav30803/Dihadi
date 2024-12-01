import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'
import { router } from 'expo-router'
import TitleHeader from '../../components/header'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Settings = () => {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <TitleHeader name="Settings" />
            
            <ScrollView className="flex-1 px-4">
                <View className="bg-white rounded-2xl shadow-sm mb-6">
                    {/* Account Section */}
                    <View className="px-4 py-3 border-b border-gray-100">
                        <Text className="text-sm font-pmedium text-gray-500">
                            Account Settings
                        </Text>
                    </View>
                    
                    <MenuItem 
                        title="Profile" 
                        icon="person" 
                        redirect="/profile"
                        description="View and edit your profile"
                    />
                    <MenuItem 
                        title="Document" 
                        icon="file" 
                        redirect="/document"
                        description="Manage your documents"
                    />
                    <MenuItem 
                        title="Applied Jobs" 
                        icon="briefcase"
                        redirect="/appliedJobs"
                        description="View your applied jobs"
                    />
                </View>

                {/* System Section */}
                <View className="bg-white rounded-2xl shadow-sm">
                    <View className="px-4 py-3 border-b border-gray-100">
                        <Text className="text-sm font-medium text-gray-500">
                            System
                        </Text>
                    </View>
                    
                    <MenuItem 
                        title="Logout" 
                        icon="sign-out" 
                        redirect="logout"
                        isDestructive={true}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const MenuItem = ({ icon, title, redirect, description, isDestructive = false }) => {
    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('token')
                        router.push('/sign-in')
                    },
                },
            ],
            { cancelable: true }
        )
    }

    const handlePress = () => {
        if (redirect === 'logout') {
            handleLogout()
        } else {
            router.push(redirect)
        }
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={`flex-row items-center px-4 py-3.5 ${
                isDestructive ? 'bg-red-50' : 'bg-white'
            }`}
            style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(229, 231, 235, 0.5)'
            }}
        >
            <View className={`w-10 h-10 rounded-full ${
                isDestructive ? 'bg-red-100' : 'bg-blue-50'
            } items-center justify-center mr-4`}>
                <Icon 
                    name={icon} 
                    size={20} 
                    color={isDestructive ? '#ef4444' : '#3b82f6'}
                />
            </View>
            
            <View className="flex-1">
                <Text className={`font-pmedium ${
                    isDestructive ? 'text-red-600' : 'text-gray-900'
                }`}>
                    {title}
                </Text>
                {description && (
                    <Text className="text-sm font-pregular text-gray-500 mt-0.5">
                        {description}
                    </Text>
                )}
            </View>

            {!isDestructive && (
                <Icon 
                    name="chevron-right" 
                    size={20} 
                    color="#9CA3AF"
                    style={{ marginLeft: 8 }}
                />
            )}
        </TouchableOpacity>
    )
}

export default Settings