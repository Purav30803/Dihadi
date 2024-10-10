import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { RadioButton } from 'react-native-paper';

const SignUp = () => {
  const [step, setStep] = React.useState(1)
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
    is_student:''
  })
  const [selectedValue, setSelectedValue] = React.useState('option1');

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

  const handleConvert = async (image) => {
    if (image) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      convertToBase64(blob); // Call to convert the blob to Base64
    }
  }

  const files = form.thumbnail ? [form.thumbnail] : []
  const finalImage =  handleConvert(files[0])

  const handleSubmit = () => {
    const submitForm = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      age: form.age,
      skills: form.skills,
      location: form.location,
      is_student: selectedValue==='yes' ? true : false,
      id_proof: form.thumbnailBase64,
    }

    if (!submitForm.name || !submitForm.email || !submitForm.phone || !submitForm.password || !submitForm.age || !submitForm.skills || !submitForm.location || !submitForm.is_student || !submitForm.id_proof) {
      alert('All fields are required')
      return
    }
    // Check the phone number for canadians
    if (submitForm.phone.startsWith('+1')) {
      submitForm.phone = submitForm.phone.substring(2)
    }
    // phone number validation
    if (submitForm.phone.length !== 10) {
      alert('Phone number must be 10 digits')
      return
    }

    // email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(submitForm.email)) {
      alert('Invalid email')
      return
    }

    // password validation
    if (submitForm.password !== form.retypePassword) {
      alert('Passwords do not match')
      return
    }

    // password validation regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    if (!passwordRegex.test(submitForm.password)) {
      alert('Password must be 6-20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter')
      return
    }

    // age validation
    if (submitForm.age < 18) {
      alert('You must be 18 years or older to sign up')
      return
    }

    // skills validation
    if (submitForm.skills.length < 3) {
      alert('Skills must be at least 3 characters long')
      return
    }

    if(!form.thumbnailBase64){
      alert('Please upload your ID proof')
      return
    }

  
    // console.log(form)
  }

  return (
    <View className="p-6 flex items-c enter justify-center w-full min-h-screen">
      <View className="w-full px-4">

        <Text className="pb-8 pt-12 text-2xl font-pbold">
          {(step === 1 || step === 2) && "Create an Account!"}
          {(step === 3 || step === 4) && "Tell us more about you!"}

        </Text>
        <View className='gap-y-4 w-full '>
          {step == 1 && <View>
            <FormField title="Name" placeholder="Name" value={form.name} handleChangeText={(e) => setForm({ ...form, name: e })}/>
            <FormField title="Email" placeholder="Email" value={form.email} handleChangeText={(e) => setForm({...form, email:e})}/>
            <FormField title="Phone" placeholder="Phone" value={form.phone} handleChangeText={(e) => setForm({...form,phone:e})}/>
          </View>}

          {step == 2 &&
            <View>
              <FormField title="Password" placeholder="Password" value={form.password} handleChangeText={(e)=>setForm({...form,password:e})}/>
              <FormField title="Retype Password" placeholder="Retype Password" value={form.retypePassword} handleChangeText={(e) => setForm({...form,retypePassword:e})}/>
            </View>
          }
          {step == 4 && <View>
            <FormField title="Age" placeholder="Age" value={form.age} handleChangeText={(e)=>setForm({...form,age:e})} />
            <FormField title="Skills" placeholder="Skills" value={form.skills} handleChangeText={(e)=>setForm({...form,skills:e})} />
            <Text className="text-black-200 mt-4 text-lg p-2 font-pmedium">
              Where do you live?
            </Text>
            <FormField title="City" placeholder="City" otherStyles="-mt-4" value={form.location} handleChangeText={(e)=>setForm({...form,location:e})}/>
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
              <Text className="text-white text-center text-lg font-pbold" onPress={handleSubmit}>Sign up</Text>
            </TouchableOpacity>

          </View>
          }
          {
            step == 3 && <View>
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
          <View className="flex flex-row justify-between pt-4">
            {step !== 1 && <TouchableOpacity onPress={() => setStep(step - 1)} className="bg-blue-500 py-2 px-8 rounded-lg" >
              <Text className="text-white text-center text-[14px] font-pmedium">Back</Text>
            </TouchableOpacity>}
            {step !== 4 && <TouchableOpacity onPress={() => setStep(step + 1)} className="bg-primary px-8 py-2 rounded-lg" >
              <Text className="text-white text-center text-[14px] font-pmedium">Next</Text>
            </TouchableOpacity>}

          </View>
          <View className="flex-row mt-12">
            <Text className="text-black-200 text-sm">Already have an account ?</Text>
            <TouchableOpacity>
              <Link className="text-secondary-200 text-sm ml-2 underline" href="/sign-in">Login</Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignUp