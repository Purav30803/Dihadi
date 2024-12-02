import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Keyboard } from 'react-native'
import React from 'react'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import api from '../../api/api'
import { router } from 'expo-router'
import { Toast, ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { Checkbox, RadioButton } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'


const SignUp = () => {
  const [step, setStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    thumbnail: null,
    thumbnailBase64: null,
    name: '',
    email: '',
    phone: '',
    password: '',
    retypePassword: '',
    age: '',
    skills: '',
    location: '',
    is_student: '',
    workingHours: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
  }); // State for managing form 
  const [selectedValue, setSelectedValue] = React.useState('option1');
  const [originalWorkingHours, setOriginalWorkingHours] = React.useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: '',
  });

  const mediaUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 3]

    })
    if (!result.canceled) {
      setForm({ ...form, thumbnail: result.assets[0] })

    }
  }

  const convertToBase64 = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setForm(prevForm => ({ ...prevForm, thumbnailBase64: base64String }));
    };

    reader.readAsDataURL(file); // This triggers the `onload`
  }

  const handleWorkingHoursChange = (day, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      workingHours: { ...prevForm.workingHours, [day]: value },
    }));
  }; // Function to handle changes in working hours
  
  const handleConvert = async (image) => {
    if (image) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      convertToBase64(blob); // Call to convert the blob to Base64
    }
  }

  const files = form.thumbnail ? [form.thumbnail] : []
  const finalImage = handleConvert(files[0])

  const updatePhone = (phone) => {
    if (phone.length === 10) {
      Keyboard.dismiss();
    }
    setForm({ ...form, phone })
   
  }
  const handleSubmit = async () => {
    const submitForm = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      age: form.age,
      skills: form.skills,
      location: form.location,
      is_student: selectedValue === 'yes' ? true : false,
      id_proof: form.thumbnailBase64,
      working_hours: form.workingHours,
      applied_jobs: []
    }

    console.log(form.name, 'form.name', form.email, 'form.email', form.phone, 'form.phone', form.password, 'form.password', form.age, 'form.age', form.skills, 'form.skills', form.location, 'form.location', selectedValue)

    if (!submitForm.name || !submitForm.email || !submitForm.phone || !submitForm.password || !submitForm.age || !submitForm.skills || !submitForm.location || !submitForm.id_proof) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'All fields are required',
        button: 'Ok',
      })
      setStep(1)
      return
    }

    // working hours validation


    // check the format of the working hours
    const workingHoursRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] - ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

if (
  Object.values(submitForm.working_hours).some((value) => value.trim() !== "") && // Check if any value is non-empty
  !Object.values(submitForm.working_hours).every((value) => value.trim() === "" || workingHoursRegex.test(value)) // Validate only non-empty values
) {
  Dialog.show({
    type: ALERT_TYPE.DANGER,
    title: 'Error',
    textBody: 'Invalid working hours format',
    button: 'Ok',
  });
  setStep(3);
  return;
}

    // email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(submitForm.email)) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Invalid email',
        button: 'Ok',

      })
      setStep(1)
      return
    }

    // Check the phone number for canadians
    if (submitForm.phone.startsWith('+1')) {
      submitForm.phone = submitForm.phone.substring(2)
    }
    // phone number validation
    if (submitForm.phone.length !== 10) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Phone number must be 10 digits',
        button: 'Ok',

      })
      setStep(1)
      return
    }

    // password validation
    if (submitForm.password !== form.retypePassword) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Passwords do not match',
        button: 'Ok',

      })
      setStep(2)
      return
    }

    // password validation regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    if (!passwordRegex.test(submitForm.password)) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Password must be 6-20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter',
        button: 'Ok',

      })
      setStep(2)
      return
    }

    // age validation
    if (submitForm.age < 18) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'You must be 18 years or older to sign up',
        button: 'Ok',

      })
      return
    }

    // skills validation
    if (submitForm.skills.length < 3) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Skills must be at least 3 characters long',
        button: 'Ok',

      })
      return
    }

    if (!form.thumbnailBase64) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please upload your ID proof',
        button: 'Ok',

      })
      return
    }

    // console.log(submitForm)
    setLoading(true)

    try {
      const response = await api.post('/users/signup', JSON.stringify(submitForm))
      // console.log(api)
      console.log(response.data)

      // chnage response to res

      if (response.data.status_code === 201) {
        // alert('Account created successfully')
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Account Created Successfully',
        })

        // set email in local storage
        await AsyncStorage.setItem('email', form.email)

        router.push(`/otpVerification?email=${form.email}`)
      }
      else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: response.data.message,
        })
        console.log(response.data)
      }
      // go back to login page
    }
    catch (e) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: e.response.data.detail,
      })
      setLoading(false)
    }
    setLoading(false)

    // console.log(form)
  }

  const makeAllDaysSame = () => {
    const isSame = Object.values(form.workingHours).every(
      (val) => val === Object.values(form.workingHours)[0]
    );
  
    if (!isSame) {
      // Save original working hours if not already saved
      setOriginalWorkingHours({ ...form.workingHours });
  
      // Set all days to the same value (default: Monday's hours or empty)
      const workingHours = form.workingHours.Monday || '';
      setForm((prevForm) => ({
        ...prevForm,
        workingHours: Object.keys(prevForm.workingHours).reduce(
          (acc, day) => ({
            ...acc,
            [day]: workingHours,
          }),
          {}
        ),
      }));
    } else {
      // Restore original working hours when unchecked
      setForm((prevForm) => ({
        ...prevForm,
        workingHours: { ...originalWorkingHours },
      }));
    }
  };

  return (
    <View className="p-6 flex items-c enter justify-center w-full min-h-screen">
      <View className="w-full px-4">

        <Text className="pb-8 pt-12 text-2xl font-pbold">
          {(step === 1 || step === 2) && "Create an Account!"}
          {(step === 3 || step === 4) && "Tell us more about you!"}

        </Text>
        <View className='gap-y-4 w-full '>
          {step == 1 && <View>
            <FormField title="Name" placeholder="Name" value={form.name} handleChangeText={(e) => setForm({ ...form, name: e })} />
            <FormField title="Email" placeholder="Email" value={form.email} handleChangeText={(e) => setForm({ ...form, email: e })} />
            <FormField title="Phone" placeholder="Phone" value={form.phone} handleChangeText={(e) => updatePhone(e)} />
          </View>}

          {step == 2 &&
            <View>
              <FormField title="Password" placeholder="Password" value={form.password} handleChangeText={(e) => setForm({ ...form, password: e })} />
              <FormField title="Retype Password" placeholder="Retype Password" value={form.retypePassword} handleChangeText={(e) => setForm({ ...form, retypePassword: e })} />
            </View>
          }
          {step == 5 && <View>
            <FormField title="Age" placeholder="Age" value={form.age} handleChangeText={(e) => setForm({ ...form, age: e })} />
            <FormField title="Skills" placeholder="Skills" value={form.skills} handleChangeText={(e) => setForm({ ...form, skills: e })} />
            <Text className="text-black-200 mt-4 text-lg p-2 font-pmedium">
              Where do you live?
            </Text>
            <FormField title="City" placeholder="City" otherStyles="-mt-4" value={form.location} handleChangeText={(e) => setForm({ ...form, location: e })} />
            <Text className="text-black-200 mt-4 text-lg p-2 font-pmedium">
              Are you a student?
            </Text>
            <View className="flex-row items-center pb-4 gap-x-4">
              <View className="flex-row items-center">
                <RadioButton.Android
                  value="yes"
                  status={selectedValue === 'yes' ?
                    'checked' : 'unchecked'}
                  onPress={() => setSelectedValue('yes')}
                  color="#007BFF"
                />
                <Text>Yes</Text>
              </View>
              <View className="flex-row items-center">

                <RadioButton.Android

                  value="no"
                  status={selectedValue === 'no' ?
                    'checked' : 'unchecked'}
                  onPress={() => setSelectedValue('no')}
                  color="#007BFF"
                />
                <Text>No</Text>
              </View>

            </View>
            <TouchableOpacity className="bg-secondary py-3 rounded-lg" >
              {loading ? <View className="flex items-center justify-center py-1 w-full">

                <ActivityIndicator size="small" color="#fff" />
              </View> :
                <Text className="text-white text-center text-lg font-pbold" onPress={handleSubmit}>Sign Up
                </Text>
              }
            </TouchableOpacity>

          </View>
          }
          {
            step == 4 && <View>
              <Text className="text-black-200 mt-4 text-lg p-2 font-pmedium">
                Upload your ID Proof              </Text>

              {form.thumbnail ? <View className="w-full h-60 ">
                <Image source={{ uri: form.thumbnail.uri }} className="w-full h-full rounded-lg" />
              </View>
                : <View className="w-full h-60 bg-gray-200 flex justify-center items-center">
                  <Text className="text-black-200 text-sm">No image selected</Text>
                </View>
              }



              <TouchableOpacity className="bg-secondary py-3 rounded-lg mt-4"
                onPress={mediaUpload}
              >
                <Text className="text-white text-center text-lg font-pbold"

                >Upload</Text>
              </TouchableOpacity>
            </View>
          }

{step === 3 && (
  <View className="space-y-4">
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-lg font-psemibold text-primary">Working Hours</Text>
      <TouchableOpacity 
        onPress={makeAllDaysSame} 
        className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg"
      >
        <Checkbox.Android
          value="same-hours"
          status={Object.values(form.workingHours).every(val => val === Object.values(form.workingHours)[0]) ? 'checked' : 'unchecked'}
          onPress={makeAllDaysSame}
          color="#007BFF"
        />
        <Text className="text-blue-600 ml-2">Same for all days</Text>
      </TouchableOpacity>
      
    </View>
    
    <View className="bg-white rounded-lg shadow-sm border border-gray-100">
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
        <View 
          key={day} 
          className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0"
        >
          <Text className="text-base font-pmedium text-gray-700">{day}</Text>
          <View className="flex-row items-center">
            <TextInput
              className="border border-gray-200 px-3 py-2 rounded-lg w-48 text-black"
              placeholder="e.g., 9:00 - 17:00"
              value={form.workingHours[day]}
              onChangeText={(value) => handleWorkingHoursChange(day, value)}
            />
          </View>
        </View>
      ))}
    </View>
    
    <View className="bg-blue-50 p-3 rounded-lg">
      <Text className="text-blue-700 text-sm font-pregular">
        ⓘ Format: Start time - End time (24-hour format, e.g., 09:00 - 17:00)
      </Text>
    </View>
  </View>
)}
          <View className="flex flex-row justify-between pt-4 items-center">
            {step !== 1 && <TouchableOpacity onPress={() => setStep(step - 1)} className="border py-2 px-8 rounded-lg" >
              <Text className="text-black text-[14px] font-pmedium">Back</Text>
            </TouchableOpacity>}
            {step !== 5 && <TouchableOpacity onPress={() => setStep(step + 1)} className="bg-blue-500 px-8 py-2 rounded-lg" >
              <Text className="text-white text-[14px] font-pmedium">Next</Text>
            </TouchableOpacity>}

          </View>
          <View className="flex-row mt-12 ">
            <Text className="text-black-200 text-sm font-pregular">Already have an account ?</Text>
            <TouchableOpacity>
              <Link className="text-secondary-200 text-sm ml-2 underline font-psemibold" href="/sign-in">Login</Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignUp