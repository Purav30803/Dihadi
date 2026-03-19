import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleHeader from '../../components/header';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const EditJobPosting = () => {
    const { postId } = useLocalSearchParams();
    const jobId = postId;
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const { colors, isDark } = useTheme();

    const [form, setForm] = useState({
        jobTitle: '',
        jobDescription: '',
        shiftStart: '',
        shiftEnd: '',
        salary: '',
        location: '',
        skillsRequired: ''
    });

    const getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) setToken(JSON.parse(token));
    };

    const fetchJobDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/job_post/job/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
            const job = response.data;
            setForm({
                jobTitle: job.job_title,
                jobDescription: job.job_description,
                shiftStart: job.shift_start,
                shiftEnd: job.shift_end,
                salary: job.salary,
                location: job.location,
                skillsRequired: job.skills_required
            });
        } catch (error) {
            Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to fetch job details.' });
        }
        setLoading(false);
    };

    useEffect(() => { getToken(); }, []);
    useEffect(() => { if (token) fetchJobDetails(); }, [token]);

    const handleSubmit = async () => {
        if (!form.jobTitle || !form.jobDescription || !form.salary || !form.location || !form.skillsRequired) {
            Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'All fields are required' });
            return;
        }
        setLoading(true);
        try {
            await api.put(`/job_post/job/${jobId}`, {
                job_title: form.jobTitle,
                job_description: form.jobDescription,
                shift_start: form.shiftStart,
                shift_end: form.shiftEnd,
                salary: form.salary,
                location: form.location,
                skills_required: form.skillsRequired,
                status: 'Active'
            }, { headers: { Authorization: `Bearer ${token}` } });
            Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: 'Job Updated Successfully' });
            router.push('/home');
        } catch (error) {
            Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to update job.' });
        }
        setLoading(false);
    };

    const cardStyle = {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0 : 0.05,
        shadowRadius: 8,
        borderWidth: isDark ? 0.5 : 0,
        borderColor: colors.separator,
    };

    const inputStyle = {
        backgroundColor: colors.inputBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: colors.label,
        marginTop: 8,
    };

    const labelStyle = {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: colors.labelTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    };

    const sectionTitleStyle = {
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold',
        color: colors.labelTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <TitleHeader name="Edit Job Post" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Title & Description */}
                <View style={cardStyle}>
                    <Text style={sectionTitleStyle}>Job Info</Text>
                    <Text style={labelStyle}>Job Title</Text>
                    <TextInput
                        style={inputStyle}
                        placeholder="e.g. Senior Cashier"
                        placeholderTextColor={colors.labelTertiary}
                        value={form.jobTitle}
                        onChangeText={(e) => setForm(prev => ({ ...prev, jobTitle: e }))}
                    />
                    <Text style={[labelStyle, { marginTop: 14 }]}>Job Description</Text>
                    <TextInput
                        style={[inputStyle, { minHeight: 100, textAlignVertical: 'top' }]}
                        placeholder="Describe the role and responsibilities..."
                        placeholderTextColor={colors.labelTertiary}
                        value={form.jobDescription}
                        onChangeText={(e) => setForm(prev => ({ ...prev, jobDescription: e }))}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                {/* Shift Hours */}
                <View style={cardStyle}>
                    <Text style={sectionTitleStyle}>Shift Hours</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle}>Start Time</Text>
                            <TextInput
                                style={inputStyle}
                                placeholder="e.g. 9:00 AM"
                                placeholderTextColor={colors.labelTertiary}
                                value={form.shiftStart}
                                onChangeText={(e) => setForm(prev => ({ ...prev, shiftStart: e }))}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle}>End Time</Text>
                            <TextInput
                                style={inputStyle}
                                placeholder="e.g. 5:00 PM"
                                placeholderTextColor={colors.labelTertiary}
                                value={form.shiftEnd}
                                onChangeText={(e) => setForm(prev => ({ ...prev, shiftEnd: e }))}
                            />
                        </View>
                    </View>
                </View>

                {/* Salary & Location */}
                <View style={cardStyle}>
                    <Text style={sectionTitleStyle}>Compensation & Location</Text>
                    <Text style={labelStyle}>Salary</Text>
                    <TextInput
                        style={inputStyle}
                        placeholder="e.g. ₹15,000/month"
                        placeholderTextColor={colors.labelTertiary}
                        value={form.salary}
                        onChangeText={(e) => setForm(prev => ({ ...prev, salary: e }))}
                    />
                    <Text style={[labelStyle, { marginTop: 14 }]}>Location</Text>
                    <TextInput
                        style={inputStyle}
                        placeholder="e.g. Mumbai, Maharashtra"
                        placeholderTextColor={colors.labelTertiary}
                        value={form.location}
                        onChangeText={(e) => setForm(prev => ({ ...prev, location: e }))}
                    />
                </View>

                {/* Skills */}
                <View style={cardStyle}>
                    <Text style={sectionTitleStyle}>Skills Required</Text>
                    <Text style={[labelStyle, { textTransform: 'none', letterSpacing: 0, fontSize: 13 }]}>
                        Separate skills with commas
                    </Text>
                    <TextInput
                        style={inputStyle}
                        placeholder="e.g. Customer Service, POS, Cash Handling"
                        placeholderTextColor={colors.labelTertiary}
                        value={form.skillsRequired}
                        onChangeText={(e) => setForm(prev => ({ ...prev, skillsRequired: e }))}
                    />
                </View>

                {/* Submit */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    activeOpacity={0.85}
                    disabled={loading}
                    style={{
                        backgroundColor: colors.primary,
                        height: 56,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 6,
                    }}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditJobPosting;
