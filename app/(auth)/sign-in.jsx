import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'
import { router } from 'expo-router'
import api from '../../api/api'
import { Toast, ALERT_TYPE } from 'react-native-alert-notification'
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkToken from '../../components/checkToken'
import { ActivityIndicator } from 'react-native-paper'

const SignIn = () => {
  const [form, setForm] = React.useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = React.useState(false)

  const getToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      router.push('/home')
    }
};  

  useEffect(() => {
    getToken()
  }, [])

 
  const handleSubmit = async () => {
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
    setLoading(true)

    try {

      const response = await api.post('/users/login', form)
      console.log(response?.data?.status_code)
      if(response?.data?.status_code == 400){
        // Alert.alert('Account not verified');
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: response?.data?.message,
        })
        router.push('/otpVerification')
        await AsyncStorage.setItem('email', form.email)
      }
      if (response?.data?.token) {
        router.push('/home')
        await AsyncStorage.setItem('token', JSON.stringify(response?.data?.token))
        console.log('token', response?.data?.token)
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
    setLoading(false)

  }
  return (
    <View className="p-6 flex items-center justify-center w-full min-h-screen">
      <View className="w-full px-4">
      {/* <OtpVerfication/> */}
        <Text className="pb-8 pt-12 text-3xl font-pbold">Sign In</Text>
        <View className='gap-y-4 w-full '>
          <FormField title="Email" placeholder="Email" handleChangeText={(e) => setForm({ ...form, email: e })} />
          <FormField title="Password" placeholder="Password" handleChangeText={(e) => setForm({ ...form, password: e })} />
          <TouchableOpacity className="bg-secondary py-3 rounded-lg" onPress={handleSubmit}>
            <Text className="text-white text-center text-lg font-pbold">
              {loading ? <ActivityIndicator size="small" color='#fff' />: 'Sign In'}
            </Text>
          </TouchableOpacity>
          <Link className="text-secondary-200 underline text-sm font-psemibold" href="/forgot-password">Forgot Password?</Link>
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