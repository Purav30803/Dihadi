import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleHeader from '../../components/header';
import { RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import timestamp_to_date from '../../components/timestamp';

const JobPosting = () => {
    const { jobPosting } = useLocalSearchParams();
    const jobId = jobPosting;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [refreshing, setRefreshing] = useState(false)


    const getToken = async () => {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
            setToken(JSON.parse(storedToken));
        }
    };

    const getJob = async () => {
        if (!token) return;
        try {
            const response = await api.get(`/job_post/job/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setJob(response.data);
        } catch (err) {
            console.log(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteJobPost = async (id) => {
        setDeleteLoading(true);
        try {
            const response = await api.delete(`/job_post/job/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {  // Correct status code check
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: 'Job Post Deleted Successfully',
                });
                router.push('/myJobs');
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Failed to delete job post',
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true)
        getJob()
        setRefreshing(false)
    }

    useEffect(() => {
        getToken();
    }, []);

    useEffect(() => {
        if (token) {
            getJob();
        }
    }, [token]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!job) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-gray-500">Job details not available.</Text>
                <Link href="/myJobs" className="text-blue-500">Go back</Link>
            </View>
        );
    }

    return (
        <SafeAreaView className="min-h-screen  bg-gray-50 ">
            <TitleHeader name="Job Details" />
            <ScrollView className="flex-1 p-4"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}

            >
                <View className="flex-row justify-center gap-x-4 pb-12">
                    {/* Edit Button */}
                    <TouchableOpacity
                        onPress={() => router.push(`/editJobPost/${job.id}`)}
                        className="bg-blue-500 flex-1 py-3 rounded-lg flex-row items-center justify-center shadow-md"
                    >
                        <MaterialIcons name="edit" size={20} color="#ffffff" />
                        <Text className="text-white text-lg font-psemibold ml-2">Edit Job</Text>
                    </TouchableOpacity>

                    {/* Delete Button */}
                    <TouchableOpacity
                        onPress={() => deleteJobPost(job.id)}
                        className="bg-red-500 flex-1 py-3 rounded-lg flex-row items-center justify-center shadow-md"
                    >
                        {deleteLoading ? <ActivityIndicator size="small" color="#fff" /> : <><MaterialIcons name="delete" size={20} color="#ffffff" />
                            <Text className="text-white text-lg font-psemibold ml-2">Delete Job</Text></>}
                    </TouchableOpacity>
                </View>


                <View className="bg-white rounded-lg p-6 mb-4">
                    <Text className="text-2xl font-pbold text-gray-900">{job.job_title}</Text>
                    <Text className="text-sm font-pregular text-gray-500 mt-1">{job.status}</Text>
                </View>

                <View className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <Text className="text-lg font-psemibold text-gray-800 mb-2">Job Description</Text>
                    <Text className="text-sm font-pregular text-gray-600">{job.job_description}</Text>
                </View>

                <View className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <Text className="text-lg font-psemibold text-gray-800 mb-2">Job Details</Text>
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="schedule" size={20} color="#6B7280" />
                        <Text className="text-sm font-pregular text-gray-600 ml-2">
                            {job.shift_start} - {job.shift_end}
                        </Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="attach-money" size={20} color="#6B7280" />
                        <Text className="text-sm text-gray-600 font-pregular ml-2">{job.salary}</Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="location-on" size={20} color="#6B7280" />
                        <Text className="text-sm text-gray-600 font-pregular ml-2">{job.location}</Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="calendar-month" size={20} color="#6B7280" />
                        <Text className="text-sm text-gray-600 font-pregular ml-2">{timestamp_to_date(job.timestamp)}</Text>
                    </View>
                </View>

                <View className="bg-white rounded-lg shadow-md p-4">
                    <Text className="text-lg font-psemibold text-gray-800 mb-2">Skills Required</Text>
                    <View className="flex-row flex-wrap">
                        {job.skills_required.split(',').map((skill, index) => (
                            <View key={index} className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2">
                                <Text className="text-blue-600 text-sm font-pmedium">{skill.trim()}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View className="bg-white rounded-lg shadow-md p-4 mt-4 mb-8">

                    <Text className="text-lg font-psemibold text-gray-800 mb-4">Applications ({job?.applications?.length})</Text>
                    {job?.applications?.length > 0 ? (
                        job.applications.map((application, index) => (
                            <Link href={`/users/${application.id}`} key={index} className='mt-4'>
                                <View
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100 w-full"
                                >
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text className="text-md font-psemibold text-gray-800 flex-1">
                                            {application.name}
                                        </Text>
                                        <MaterialIcons name="person" size={20} color="#6B7280" />
                                    </View>
                                    <View className="flex-row items-center mb-1 gap-x-2">
                                        <MaterialIcons name="email" size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-sm font-pregular truncate text-gray-600 flex-1">
                                            {application.email}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center gap-x-2">
                                        <MaterialIcons name="phone" size={16} color="#6B7280" className="mr-2" />
                                        <Text className="text-sm text-gray-600 font-pregular flex-1">
                                            {application.phone}
                                        </Text>
                                    </View>
                                </View>
                            </Link>
                        ))
                    ) : (
                        <View className="bg-gray-50 rounded-lg p-4 items-center">
                            <MaterialIcons name="inbox" size={40} color="#9CA3AF" />
                            <Text className="text-gray-500 text-center mt-2">
                                No applications yet
                            </Text>
                        </View>
                    )}
                </View>

                {/* add edit button */}

            </ScrollView>
        </SafeAreaView>
    );
};

export default JobPosting;
