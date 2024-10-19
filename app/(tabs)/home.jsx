import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Interceptor from '../../components/Interseptor'
const Home = () => {


  useEffect(() => {
    Interceptor();
  },[])
    return (
    <SafeAreaView>
      <View>
        <Text className="p-12 font-pregular">Home</Text>
      </View>
    </SafeAreaView>
  )
}

export default Home