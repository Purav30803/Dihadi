import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleHeader from '../../components/header'
import FormField from '../../components/FormField'
import api from '../../api/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { router } from 'expo-router'
import { useTheme } from '../../context/ThemeContext'
import { StatusBar } from 'expo-status-bar'

const JobPosting = () => {
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState()
    const { colors, isDark } = useTheme();
    const [form, setForm] = useState({
        jobTitle: '', jobDescription: '', shiftStart: '', shiftEnd: '', salary: '', location: '', skillsRequired: ''
    })

    const getToken = async () => {
        const token = await AsyncStorage.getItem('token')
        if (token) setToken(JSON.parse(token))
    }

    useEffect(() => { getToken() }, [])

    const handleSubmit = async () => {
        if (!form.jobTitle || !form.jobDescription || !form.salary || !form.location || !form.skillsRequired) {
            Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'All fields are required' })
            return
        }
        setLoading(true)
        try {
            const response = await api.post('/job_post/create', {
                job_title: form.jobTitle, job_description: form.jobDescription,
                shift_start: form.shiftStart, shift_end: form.shiftEnd,
                salary: form.salary, location: form.location,
                skills_required: form.skillsRequired, status: 'Active'
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data) {
                Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Job Posted Successfully' })
                setForm({ jobTitle: '', jobDescription: '', shiftStart: '', shiftEnd: '', salary: '', location: '', skillsRequired: '' })
                router.push('/home')
            }
        } catch (error) {
            Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to post job' })
        }
        setLoading(false)
    }

    const FormSection = ({ children }) => (
        <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0 : 0.05,
            shadowRadius: 8,
            borderWidth: isDark ? 0.5 : 0,
            borderColor: colors.separator,
        }}>
            {children}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <TitleHeader name="Post a Job" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <FormSection>
                    <FormField
                        title="Job Title"
                        placeholder="e.g. Kitchen Helper, Delivery Driver"
                        value={form.jobTitle}
                        handleChangeText={(e) => setForm(prev => ({ ...prev, jobTitle: e }))}
                    />
                    <FormField
                        title="Job Description"
                        placeholder="Describe the role and responsibilities"
                        value={form.jobDescription}
                        handleChangeText={(e) => setForm(prev => ({ ...prev, jobDescription: e }))}
                    />
                </FormSection>

                <FormSection>
                    <FormField
                        title="Shift Start"
                        placeholder="e.g. 09:00 AM"
                        value={form.shiftStart}
                        handleChangeText={(e) => setForm(prev => ({ ...prev, shiftStart: e }))}
                    />
                    <FormField
                        title="Shift End"
                        placeholder="e.g. 05:00 PM"
                        value={form.shiftEnd}
                        handleChangeText={(e) => setForm(prev => ({ ...prev, shiftEnd: e }))}
                    />
                </FormSection>

                <FormSection>
                    <FormField
                        title="Salary"
                        placeholder="e.g. $15/hr, $500/week"
                        value={form.salary}
                        handleChangeText={(e) => setForm(prev => ({ ...prev, salary: e }))}
                    />
                    <FormField
                        title="Location"
                        placeholder="Job location or city"
                        value={form.location}
                        handleChangeText={(e) => setForm(prev => ({ ...prev, location: e }))}
                    />
                </FormSection>

                <FormSection>
                    <FormField
                        title="Skills Required"
                        placeholder="e.g. Cooking, Communication, Driving"
                        value={form.skillsRequired}
                        handleChangeText={(e) => setForm(prev => ({ ...prev, skillsRequired: e }))}
                    />
                    <View style={{ backgroundColor: colors.pillBg, borderRadius: 10, padding: 10, marginTop: 12 }}>
                        <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelSecondary }}>
                            Separate skills with commas for better matching
                        </Text>
                    </View>
                </FormSection>

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
                        <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Publish Job</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default JobPosting
