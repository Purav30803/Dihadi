import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const EditPageLayout = () => {
  return (
   <>
      <Stack>
  
        <Stack.Screen name="[postId]" options={{
          headerShown: false
        }}/>
      
      </Stack>

      <StatusBar style='dark' backgroundColor='#161622' />
   </>
  )
}

export default EditPageLayout