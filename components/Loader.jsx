import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'

const Loader = () => {
  return (
    <View className="min-h-[60vh] items-center w-full justify-center"><ActivityIndicator size="medium" color='#FF9C01' /></View>
  )
}

export default Loader