import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'
import { router } from 'expo-router'
import api from '../../api/api'
import { Toast, ALERT_TYPE } from 'react-native-alert-notification'
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkToken from '../../components/checkToken'

const SignIn = () => {
  const [form, setForm] = React.useState({
    email: '',
    password: ''
  })

  const token = checkToken(); 
  console.log(token)
  if(token?.length>1){
     router.push('/home')
  }

 
  const handleSubmit = async () => {
    console.log(form)
    if (!form.email || !form.password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'All fields are required',
      })
      return
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(form.email)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Invalid email',
      })
      setStep(1)
      return
    }
    try {

      const response = await api.post('/users/login', form)
      console.log(response.data)

      if (response?.data?.token) {
        router.push('/home')
        await AsyncStorage.setItem('token', JSON.stringify(response.data.token))
        console.log('token', response.data.token)
      }

    }
    catch (err) {
      console.log(err.response.data)
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: err.response.data.detail,
      })
    }


  }
  return (
    <View className="p-6 flex items-center justify-center w-full min-h-screen">
      <View className="w-full px-4">

        <Text className="pb-8 pt-12 text-3xl font-pbold">Sign In</Text>
        <View className='gap-y-4 w-full '>
          <FormField title="Email" placeholder="Email" handleChangeText={(e) => setForm({ ...form, email: e })} />
          <FormField title="Password" placeholder="Password" handleChangeText={(e) => setForm({ ...form, password: e })} />
          <TouchableOpacity className="bg-secondary py-3 rounded-lg" onPress={handleSubmit}>
            <Text className="text-white text-center text-lg font-pbold">Login</Text>
          </TouchableOpacity>
          <Link className="text-secondary-200 underline text-sm font-psemibold" href="/">Forgot Password?</Link>
          <View className="flex-row mt-12">
            <Text className="text-black-200 text-sm font-pregular">Don't have an account?</Text>
            <TouchableOpacity>
              <Link className="text-secondary font-psemibold text-sm ml-2 underline" href="/sign-up">Sign Up</Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignIn