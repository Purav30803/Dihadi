import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'

const SignUp = () => {
  const [step, setStep] = React.useState(1)
  return (
    <View className="p-6 flex items-center justify-center w-full min-h-screen">
      <View className="w-full px-4">

        <Text className="pb-8 pt-12 text-2xl font-pbold">Create an Account!</Text>
        <View className='gap-y-4 w-full '>
          {step == 1 && <View>
            <FormField title="Name" placeholder="Name" />
            <FormField title="Email" placeholder="Email" />
            <FormField title="Phone" placeholder="Phone" />
          </View>}

          {step == 2 &&
            <View>
              <FormField title="Retype Password" placeholder="Retype Password" />
              <FormField title="Password" placeholder="Password" />
            </View>
          }
         {step == 3 && <View>

          <TouchableOpacity className="bg-secondary py-3 rounded-lg" >
            <Text className="text-white text-center text-lg font-pbold">Sign up</Text>
          </TouchableOpacity>

          <Link className="text-secondary-200 underline text-sm" href="/">Forgot Password?</Link>
          <View className="flex-row mt-12">
            <Text className="text-black-200 text-sm">Don't have an account?</Text>
            <TouchableOpacity>
              <Link className="text-secondary-200 text-sm ml-2 underline" href="/sign-up">Sign Up</Link>
            </TouchableOpacity>
          </View>
          </View>}
          <View className="flex flex-row justify-between">
            {step !== 1 && <TouchableOpacity onPress={() => setStep(step - 1)} className="bg-secondary py-3 rounded-lg" >
              <Text className="text-white text-center text-lg font-pbold">Back</Text>
            </TouchableOpacity>}
           {step !==3 && <TouchableOpacity onPress={() => setStep(step + 1)} className="bg-secondary py-3 rounded-lg" >
              <Text className="text-white text-center text-lg font-pbold">Next</Text>
            </TouchableOpacity>}
          
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignUp