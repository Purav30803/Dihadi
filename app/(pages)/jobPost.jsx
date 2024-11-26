import { View, Text, ScrollView, Platform, TouchableOpacity, Modal, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleHeader from '../../components/header'
import FormField from '../../components/FormField'
import api from '../../api/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { router } from 'expo-router'

const JobPosting = () => {
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState()
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)

    const [form, setForm] = useState({
        jobTitle: '',
        jobDescription: '',
        shiftStart: new Date(),
        shiftEnd: new Date(),
        salary: '',
        location: '',
        skillsRequired: ''
    })

    const getToken = async () => {
        const token = await AsyncStorage.getItem('token')
        if (token) {
            setToken(JSON.parse(token))
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    // Simplified date picker handlers
    const handleStartDateChange = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setForm(prev => ({...prev, shiftStart: selectedDate}));
        }
    };

    const handleEndDateChange = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setForm(prev => ({...prev, shiftEnd: selectedDate}));
        }
    };

    const handleSubmit = async () => {
       
        if(form?.jobTitle?.length<1 || form?.jobDescription?.length<1 || form?.salary?.length<1 || form?.location?.length<1 || form?.skillsRequired?.length<1){{
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'All fields are required',
              })
              return
        }
        }

        setLoading(true)

       

        try {
            const response = await api.post('/job_post/create', {
                job_title: form.jobTitle,
                job_description: form.jobDescription,
                shift_start: form.shiftStart.toISOString(),  // Convert to ISO string
                shift_end: form.shiftEnd.toISOString(),      // Convert to ISO string
                salary: form.salary,
                location: form.location,
                skills_required: form.skillsRequired,
                status: "Active"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Success:', response.data);
            if (response.data) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: "Job Posted Successfully",
                  })
                  setForm({
                    jobTitle: '',
                    jobDescription: '',
                    shiftStart: new Date(),
                    shiftEnd: new Date(),
                    salary: '',
                    location: '',
                    skillsRequired: ''
                })
                router.push('/home')
            }

        } catch (error) {
            console.error('Error:', error.response || error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: "Failed to post job",
              })
              setLoading(false)
        }
        setLoading(false)
    }

    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView>
                <TitleHeader name="Create a job post" />
                <View className="px-4 pb-6">
                    {/* Job Title */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Job Title</Text>
                        <FormField 
                            title="Job Title" 
                            placeholder="Enter Job Title" 
                            handleChangeText={(e) => setForm(prev => ({...prev, jobTitle: e}))} 
                        />
                    </View>

                    {/* Job Description */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Job Description</Text>
                        <FormField 
                            title="Job Description" 
                            placeholder="Enter Job Description" 
                            handleChangeText={(e) => setForm(prev => ({...prev, jobDescription: e}))} 
                        />
                    </View>

                    {/* Shift Start */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Shift Starts</Text>
                        <TouchableOpacity 
                            className="border border-gray-300 rounded-lg p-3"
                            onPress={() => setShowStartPicker(true)}
                        >
                            <Text>{formatDate(form.shiftStart)}</Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                            <DateTimePicker
                                testID="startDateTimePicker"
                                value={form.shiftStart}
                                mode="datetime"
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleStartDateChange}
                            />
                        )}
                    </View>

                    {/* Shift End */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Shift Ends</Text>
                        <TouchableOpacity 
                            className="border border-gray-300 rounded-lg p-3"
                            onPress={() => setShowEndPicker(true)}
                        >
                            <Text>{formatDate(form.shiftEnd)}</Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                            <DateTimePicker
                                testID="endDateTimePicker"
                                value={form.shiftEnd}
                                mode="datetime"
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleEndDateChange}
                            />
                        )}
                    </View>

                    {/* Salary */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Salary</Text>
                        <FormField 
                            title="Salary" 
                            placeholder="Enter Salary" 
                            handleChangeText={(e) => setForm(prev => ({...prev, salary: e}))} 
                        />
                    </View>

                    {/* Location */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Location</Text>
                        <FormField 
                            title="Location" 
                            placeholder="Enter Location" 
                            handleChangeText={(e) => setForm(prev => ({...prev, location: e}))} 
                        />
                    </View>

                    {/* Skills Required */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Skills Required</Text>
                        <FormField 
                            title="Skills Required" 
                            placeholder="Enter Required Skills" 
                            handleChangeText={(e) => setForm(prev => ({...prev, skillsRequired: e}))} 
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                        className="bg-blue-700 py-3 mx-6 rounded-full" 
                        onPress={handleSubmit}
                    >
                        {loading?<ActivityIndicator size="small" color="#fff" />:<Text className="text-white text-center text-lg font-pbold">
                            Publish Job
                        </Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default JobPosting