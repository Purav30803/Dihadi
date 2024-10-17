import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
    return (
    <SafeAreaView>
      <View>
        <Text className="p-12 font-pregular">Home</Text>
      </View>
    </SafeAreaView>
  )
}

export default Home