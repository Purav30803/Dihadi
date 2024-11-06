import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Interceptor from '../../components/Interseptor'
import TitleHeader from '../../components/header'
import { Link } from 'expo-router'
const Home = () => {

  useEffect(() => {
    Interceptor();
  }, [])
  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center">
        <TitleHeader name="Dihadi" />
        <View className="flex-row gap-x-4 -mt-2">
          <View className="border py-2 px-3 rounded-full"><Text>Find a Job </Text></View>
          <View className="mr-4 border py-2 px-3 rounded-full">
            <Link href="/jobPost">
            <Text>Post a Job</Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home