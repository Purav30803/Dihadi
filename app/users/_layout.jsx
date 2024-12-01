import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const UserPageLayout = () => {
  return (
   <>
      <Stack>
  
        <Stack.Screen name="[userId]" options={{
          headerShown: false
        }}/>
      
      </Stack>

      <StatusBar style='dark' backgroundColor='#161622' />
   </>
  )
}

export default UserPageLayout