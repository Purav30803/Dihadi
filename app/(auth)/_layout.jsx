import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
   <>
      <Stack>
        <Stack.Screen name="sign-in" options={{
          headerShown: false
        }}/>
        <Stack.Screen name="sign-up" options={{
          headerShown: false
        }}/>
        <Stack.Screen name="otpVerification" options={{
          headerShown: false
        }}/>
      </Stack>

      <StatusBar style='dark' backgroundColor='#161622' />
   </>
  )
}

export default AuthLayout