import { View, Text, TouchableOpacity, Image, ActivityIndicator, Keyboard, ScrollView, TextInput } from 'react-native'
import React from 'react'
import FormField from '../../components/FormField'
import { Link, router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import api from '../../api/api'
import { Toast, ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { Checkbox, RadioButton } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const STEP_LABELS = ['Personal Info', 'Password', 'Working Hours', 'ID Proof', 'Details'];

const SignUp = () => {
  const [step, setStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const { colors, isDark } = useTheme();
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
    workingHours: { Monday: '', Tuesday: '', Wednesday: '', Thursday: '', Friday: '', Saturday: '', Sunday: '' },
  });
  const [selectedValue, setSelectedValue] = React.useState('option1');
  const [originalWorkingHours, setOriginalWorkingHours] = React.useState({
    Monday: '', Tuesday: '', Wednesday: '', Thursday: '', Friday: '', Saturday: '', Sunday: '',
  });

  const mediaUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 3],
    })
    if (!result.canceled) setForm({ ...form, thumbnail: result.assets[0] })
  }

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, thumbnailBase64: reader.result }));
    reader.readAsDataURL(file);
  }

  const handleWorkingHoursChange = (day, value) => {
    setForm(prev => ({ ...prev, workingHours: { ...prev.workingHours, [day]: value } }));
  };

  const handleConvert = async (image) => {
    if (image) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      convertToBase64(blob);
    }
  }

  const files = form.thumbnail ? [form.thumbnail] : []
  handleConvert(files[0])

  const updatePhone = (phone) => {
    if (phone.length === 10) Keyboard.dismiss();
    setForm({ ...form, phone })
  }

  const handleSubmit = async () => {
    const submitForm = {
      name: form.name, email: form.email, phone: form.phone, password: form.password,
      age: form.age, skills: form.skills, location: form.location,
      is_student: selectedValue === 'yes', id_proof: form.thumbnailBase64,
      working_hours: form.workingHours, applied_jobs: []
    }

    if (!submitForm.name || !submitForm.email || !submitForm.phone || !submitForm.password || !submitForm.age || !submitForm.skills || !submitForm.location || !submitForm.id_proof) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'All fields are required', button: 'Ok' })
      setStep(1); return
    }

    const workingHoursRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] - ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (Object.values(submitForm.working_hours).some(v => v.trim() !== '') && !Object.values(submitForm.working_hours).every(v => v.trim() === '' || workingHoursRegex.test(v))) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Invalid working hours format', button: 'Ok' })
      setStep(3); return
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(submitForm.email)) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Invalid email', button: 'Ok' })
      setStep(1); return
    }
    if (submitForm.phone.startsWith('+1')) submitForm.phone = submitForm.phone.substring(2)
    if (submitForm.phone.length !== 10) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Phone number must be 10 digits', button: 'Ok' })
      setStep(1); return
    }
    if (submitForm.password !== form.retypePassword) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Passwords do not match', button: 'Ok' })
      setStep(2); return
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    if (!passwordRegex.test(submitForm.password)) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Password must be 6-20 chars with uppercase, lowercase & number', button: 'Ok' })
      setStep(2); return
    }
    if (submitForm.age < 18) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'You must be 18+ to sign up', button: 'Ok' })
      return
    }
    if (!form.thumbnailBase64) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Please upload your ID proof', button: 'Ok' })
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/users/signup', JSON.stringify(submitForm))
      if (response.data.status_code === 201) {
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Account Created Successfully' })
        await AsyncStorage.setItem('email', form.email)
        router.push(`/otpVerification?email=${form.email}`)
      } else {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: response.data.message })
      }
    } catch (e) {
      const message = e?.response?.data?.detail || e?.response?.data?.message || e?.message || 'Something went wrong.'
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: message })
    }
    setLoading(false)
  }

  const makeAllDaysSame = () => {
    const isSame = Object.values(form.workingHours).every(val => val === Object.values(form.workingHours)[0]);
    if (!isSame) {
      setOriginalWorkingHours({ ...form.workingHours });
      const workingHours = form.workingHours.Monday || '';
      setForm(prev => ({ ...prev, workingHours: DAYS.reduce((acc, day) => ({ ...acc, [day]: workingHours }), {}) }));
    } else {
      setForm(prev => ({ ...prev, workingHours: { ...originalWorkingHours } }));
    }
  };

  const stepTitles = ['Personal Info', 'Set Password', 'Working Hours', 'ID Verification', 'Final Details'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step Progress */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 28 }}>
          {STEP_LABELS.map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i + 1 <= step ? colors.primary : colors.separator,
              }}
            />
          ))}
        </View>

        {/* Title */}
        <Text style={{ fontSize: 26, fontFamily: 'Poppins-Bold', color: colors.label, marginBottom: 4 }}>
          {step <= 2 ? 'Create Account' : 'Tell Us About You'}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginBottom: 24 }}>
          Step {step} of 5 — {stepTitles[step - 1]}
        </Text>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <View>
            <FormField title="Full Name" placeholder="Your full name" value={form.name} handleChangeText={(e) => setForm({ ...form, name: e })} />
            <FormField title="Email" placeholder="Email address" value={form.email} handleChangeText={(e) => setForm({ ...form, email: e })} />
            <FormField title="Phone" placeholder="10-digit phone number" value={form.phone} handleChangeText={updatePhone} />
          </View>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <View>
            <FormField title="Password" placeholder="Create a password" value={form.password} handleChangeText={(e) => setForm({ ...form, password: e })} />
            <FormField title="Retype Password" placeholder="Confirm your password" value={form.retypePassword} handleChangeText={(e) => setForm({ ...form, retypePassword: e })} />
            <View style={{ backgroundColor: colors.pillBg, borderRadius: 12, padding: 12, marginTop: 16 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelSecondary }}>
                Password must be 6-20 characters with at least one uppercase letter, lowercase letter, and number.
              </Text>
            </View>
          </View>
        )}

        {/* Step 3: Working Hours */}
        {step === 3 && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Poppins-SemiBold', color: colors.label }}>Availability</Text>
              <TouchableOpacity
                onPress={makeAllDaysSame}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.pillBg,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 10,
                }}
              >
                <Checkbox.Android
                  value="same-hours"
                  status={Object.values(form.workingHours).every(val => val === Object.values(form.workingHours)[0]) ? 'checked' : 'unchecked'}
                  onPress={makeAllDaysSame}
                  color={colors.primary}
                />
                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Medium', color: colors.primary, marginLeft: 4 }}>Same all days</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden', borderWidth: isDark ? 0.5 : 0, borderColor: colors.separator }}>
              {DAYS.map((day, index) => (
                <View
                  key={day}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: index < DAYS.length - 1 ? 0.5 : 0,
                    borderBottomColor: colors.separator,
                  }}
                >
                  <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: colors.label, width: 90 }}>{day}</Text>
                  <TextInput
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: colors.inputBorder,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      fontSize: 13,
                      fontFamily: 'Poppins-Regular',
                      color: colors.label,
                      backgroundColor: colors.inputBg,
                    }}
                    placeholder="09:00 - 17:00"
                    placeholderTextColor={colors.labelTertiary}
                    value={form.workingHours[day]}
                    onChangeText={(value) => handleWorkingHoursChange(day, value)}
                  />
                </View>
              ))}
            </View>

            <View style={{ backgroundColor: colors.pillBg, borderRadius: 12, padding: 12, marginTop: 16 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelSecondary }}>
                Format: HH:MM - HH:MM (24-hour). Leave blank if unavailable.
              </Text>
            </View>
          </View>
        )}

        {/* Step 4: ID Proof */}
        {step === 4 && (
          <View>
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', color: colors.labelSecondary, marginBottom: 16 }}>
              Upload a government-issued ID for verification
            </Text>
            <View style={{
              width: '100%',
              height: 220,
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: form.thumbnail ? colors.primary : colors.separator,
              borderStyle: form.thumbnail ? 'solid' : 'dashed',
              marginBottom: 16,
            }}>
              {form.thumbnail ? (
                <Image source={{ uri: form.thumbnail.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name="upload" size={36} color={colors.labelTertiary} />
                  <Text style={{ color: colors.labelTertiary, fontFamily: 'Poppins-Regular', fontSize: 14, marginTop: 12 }}>
                    Tap below to upload
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={mediaUpload}
              activeOpacity={0.85}
              style={{
                borderWidth: 1.5,
                borderColor: colors.primary,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.primary, fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
                {form.thumbnail ? 'Change Image' : 'Upload ID Proof'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 5: Final Details */}
        {step === 5 && (
          <View>
            <FormField title="Age" placeholder="Your age" value={form.age} handleChangeText={(e) => setForm({ ...form, age: e })} />
            <FormField title="Skills" placeholder="e.g. Cooking, Driving, Cleaning" value={form.skills} handleChangeText={(e) => setForm({ ...form, skills: e })} />
            <FormField title="City" placeholder="Your city" value={form.location} handleChangeText={(e) => setForm({ ...form, location: e })} />

            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', color: colors.label, marginTop: 20, marginBottom: 12 }}>
              Are you a student?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {['yes', 'no'].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSelectedValue(option)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedValue === option ? colors.primary : colors.separator,
                    backgroundColor: selectedValue === option ? colors.pillBg : colors.surface,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 15,
                    color: selectedValue === option ? colors.primary : colors.labelSecondary,
                  }}>
                    {option === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={loading}
              style={{
                backgroundColor: colors.primary,
                height: 56,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 28,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: colors.separator,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: colors.label }}>Back</Text>
            </TouchableOpacity>
          )}
          {step < 5 && (
            <TouchableOpacity
              onPress={() => setStep(step + 1)}
              activeOpacity={0.85}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 14,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, color: '#fff' }}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Already have account */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 }}>
          <Text style={{ color: colors.labelSecondary, fontFamily: 'Poppins-Regular', fontSize: 15 }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/sign-in')}>
            <Text style={{ color: colors.primary, fontFamily: 'Poppins-SemiBold', fontSize: 15 }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
