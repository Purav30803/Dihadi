import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const PageLAyout = () => {
  return (
   <>
      <Stack>
        <Stack.Screen name="profile" options={{
          headerShown: false
        }}/>
        <Stack.Screen name="document" options={{
          headerShown: false
        }}/>
      
      </Stack>

      <StatusBar style='dark' backgroundColor='#161622' />
   </>
  )
}

export default PageLAyout