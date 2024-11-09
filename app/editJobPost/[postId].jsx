import { View, Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleHeader from '../../components/header';
import FormField from '../../components/FormField';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useLocalSearchParams, router } from 'expo-router';

const EditJobPosting = () => {
    const { postId } = useLocalSearchParams();
    const jobId = postId;
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [form, setForm] = useState({
        jobTitle: '',
        jobDescription: '',
        shiftStart: new Date(),
        shiftEnd: new Date(),
        salary: '',
        location: '',
        skillsRequired: ''
    });

    const getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            setToken(JSON.parse(token));
        }
    };

    const fetchJobDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/job_post/job/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const job = response.data;
            setForm({
                jobTitle: job.job_title,
                jobDescription: job.job_description,
                shiftStart: new Date(job.shift_start),
                shiftEnd: new Date(job.shift_end),
                salary: job.salary,
                location: job.location,
                skillsRequired: job.skills_required
            });
        } catch (error) {
            console.error('Error fetching job details:', error.response || error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Failed to fetch job details.'
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        getToken();
    }, []);

    useEffect(() => {
        if (token) {
            fetchJobDetails();
        }
    }, [token]);

    const handleStartDateChange = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setForm(prev => ({ ...prev, shiftStart: selectedDate }));
        }
    };

    const handleEndDateChange = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setForm(prev => ({ ...prev, shiftEnd: selectedDate }));
        }
    };

    const handleSubmit = async () => {
        if (form.jobTitle.length < 1 || form.jobDescription.length < 1 || form.salary.length < 1 || form.location.length < 1 || form.skillsRequired.length < 1) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'All fields are required'
            });
            return;
        }
        setLoading(true);
        try {
            const response = await api.put(`/job_post/job/${jobId}`, {
                job_title: form.jobTitle,
                job_description: form.jobDescription,
                shift_start: form.shiftStart.toISOString(),
                shift_end: form.shiftEnd.toISOString(),
                salary: form.salary,
                location: form.location,
                skills_required: form.skillsRequired,
                status: "Active"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Job Updated Successfully'
            });
            router.push('/home');
        } catch (error) {
            console.error('Error updating job:', error.response || error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Failed to update job.'
            });
        }
        setLoading(false);
    };

    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView>
                <TitleHeader name="Edit Job Post" />
                <View className="px-4 pb-6">
                    {/* Job Title */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Job Title</Text>
                        <FormField
                            title="Job Title"
                            placeholder="Enter Job Title"
                            value={form.jobTitle}
                            handleChangeText={(e) => setForm(prev => ({ ...prev, jobTitle: e }))}
                        />
                    </View>

                    {/* Job Description */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Job Description</Text>
                        <FormField
                            title="Job Description"
                            placeholder="Enter Job Description"
                            value={form.jobDescription}
                            handleChangeText={(e) => setForm(prev => ({ ...prev, jobDescription: e }))}
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
                            value={form.salary}
                            handleChangeText={(e) => setForm(prev => ({ ...prev, salary: e }))}
                        />
                    </View>

                    {/* Location */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Location</Text>
                        <FormField
                            title="Location"
                            placeholder="Enter Location"
                            value={form.location}
                            handleChangeText={(e) => setForm(prev => ({ ...prev, location: e }))}
                        />
                    </View>

                    {/* Skills Required */}
                    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <Text className="text-lg font-bold mb-2">Skills Required</Text>
                        <FormField
                            title="Skills Required"
                            placeholder="Enter Required Skills"
                            value={form.skillsRequired}
                            handleChangeText={(e) => setForm(prev => ({ ...prev, skillsRequired: e }))}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className="bg-secondary py-3 mx-6 rounded-lg"
                        onPress={handleSubmit}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-white text-center text-lg font-pbold">
                                Update Job
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditJobPosting;
