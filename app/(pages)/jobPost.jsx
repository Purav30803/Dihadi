import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleHeader from '../../components/header'
import FormField from '../../components/FormField'
import { TouchableOpacity } from 'react-native'
import api from '../../api/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import DatePicker from 'react-native-date-picker'

const JobPosting = () => {
    const [token, setToken] = useState()

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
    
    const handleSubmit = async () => {
        const submitForm = {
            job_title:form.jobTitle,
            job_description:form.jobDescription,
            shift_start:form.shiftStart,
            shift_end:form.shiftEnd,
            salary:form.salary,
            location:form.location,
            skills_required:form.skillsRequired,
            status:"Active"
        }

        try {
            const response = await api.get('/job_post/create',{
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            })
            console.log(response)
            console.log(form)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getToken()
      }, [token])

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView>
                <TitleHeader name="Create a job post" />
                <View className="px-4 pb-6">
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Job Title</Text>
                        <FormField title="Job Title" placeholder="Enter Job Title" handleChangeText={(e) => setForm({ ...form, jobTitle: e })} />
                    </View>
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Job Description</Text>
                        <FormField title="Job Description" placeholder="Enter Job Description" handleChangeText={(e) => setForm({ ...form, jobDescription: e })} />
                    </View>
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Shift Starts</Text>
                        {/* <DatePicker date={form.shiftStart} onDateChange={(e) => setForm({ ...form, shiftStart: e })} /> */}
                    </View>
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Shift Ends</Text>
                        {/* <DatePicker date={form.shiftEnd} onDateChange={(e) => setForm({ ...form, shiftEnd: e })} /> */}
                    </View>
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Salary</Text>
                        <FormField title="Salary" placeholder="Enter Salary" handleChangeText={(e) => setForm({ ...form, salary: e })} />
                    </View>
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Location</Text>
                        <FormField title="Location" placeholder="Enter Location" handleChangeText={(e) => setForm({ ...form, location: e })} />
                    </View>
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Skills Required</Text>
                        <FormField title="Skills Required" placeholder="Enter Required Skills" handleChangeText={(e) => setForm({ ...form, skillsRequired: e })} />
                    </View>
                    <TouchableOpacity className="bg-secondary py-3 mx-6 rounded-lg" onPress={handleSubmit} >
                        <Text className="text-white text-center text-lg font-pbold">Publish Job</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default JobPosting
