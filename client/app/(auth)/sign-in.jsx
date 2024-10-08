import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'

const SignIn = () => {
  return (
    <View className="p-6 flex items-center justify-center w-full min-h-screen">
      <View className="w-full px-4">

        <Text className="pb-8 pt-12 text-3xl font-pbold">Sign In</Text>
        <View className='gap-y-4 w-full '>
          <FormField title="Email" placeholder="Email" />
          <FormField title="Password" placeholder="Password" />
          <TouchableOpacity className="bg-secondary py-3 rounded-lg" >
            <Text className="text-white text-center text-lg font-pbold">Login</Text>
          </TouchableOpacity>
          <Link className="text-secondary-200 underline text-sm" href="/">Forgot Password?</Link>
          <View className="flex-row mt-12">
            <Text className="text-black-200 text-sm">Don't have an account?</Text>
            <TouchableOpacity>
              <Link className="text-secondary-200 text-sm ml-2 underline" href="/sign-up">Sign Up</Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignIn