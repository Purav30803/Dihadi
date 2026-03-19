import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleHeader from '../../components/header';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import timestamp_to_date from '../../components/timestamp';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const JobPosting = () => {
    const { jobPosting } = useLocalSearchParams();
    const jobId = jobPosting;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { colors, isDark } = useTheme();

    const getToken = async () => {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) setToken(JSON.parse(storedToken));
    };

    const getJob = async () => {
        if (!token) return;
        try {
            const response = await api.get(`/job_post/job/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
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
            const response = await api.delete(`/job_post/job/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (response.status === 200) {
                Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Deleted', textBody: 'Job post deleted successfully' });
                router.push('/myjobs');
            }
        } catch (err) {
            Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to delete job post' });
        } finally {
            setDeleteLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await getJob();
        setRefreshing(false);
    };

    useEffect(() => { getToken(); }, []);
    useEffect(() => { if (token) getJob(); }, [token]);

    const InfoRow = ({ icon, label, value }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.separator }}>
            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <MaterialIcons name={icon} size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>{label}</Text>
                <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: colors.label, marginTop: 1 }}>{value}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    if (!job) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color: colors.labelSecondary }}>Job details not available.</Text>
                <TouchableOpacity onPress={() => router.push('/myjobs')} style={{ marginTop: 16 }}>
                    <Text style={{ color: colors.primary, fontFamily: 'Poppins-SemiBold' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <TitleHeader name="Job Details" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={() => router.push(`/editJobPost/${job.id}`)}
                        activeOpacity={0.85}
                        style={{
                            flex: 1,
                            height: 48,
                            backgroundColor: colors.primary,
                            borderRadius: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        <MaterialIcons name="edit" size={18} color="#fff" />
                        <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 15 }}>Edit Job</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => deleteJobPost(job.id)}
                        activeOpacity={0.85}
                        style={{
                            flex: 1,
                            height: 48,
                            backgroundColor: colors.red,
                            borderRadius: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        {deleteLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <MaterialIcons name="delete" size={18} color="#fff" />
                                <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 15 }}>Delete</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Job Title Card */}
                <View style={cardStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 22, fontFamily: 'Poppins-Bold', color: colors.label, flex: 1 }}>{job.job_title}</Text>
                        <View style={{
                            backgroundColor: job.status === 'Active' ? colors.greenMuted : colors.redMuted,
                            borderRadius: 100,
                            paddingHorizontal: 12,
                            paddingVertical: 5,
                        }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Poppins-SemiBold', color: job.status === 'Active' ? colors.green : colors.red }}>
                                {job.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={cardStyle}>
                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Description
                    </Text>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, lineHeight: 22 }}>
                        {job.job_description}
                    </Text>
                </View>

                {/* Job Details */}
                <View style={cardStyle}>
                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Details
                    </Text>
                    <InfoRow icon="schedule" label="Shift Hours" value={`${job.shift_start} – ${job.shift_end}`} />
                    <InfoRow icon="attach-money" label="Salary" value={job.salary} />
                    <InfoRow icon="location-on" label="Location" value={job.location} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                            <MaterialIcons name="calendar-month" size={16} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>Posted</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: colors.label, marginTop: 1 }}>{timestamp_to_date(job.timestamp)}</Text>
                        </View>
                    </View>
                </View>

                {/* Skills */}
                <View style={cardStyle}>
                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Skills Required
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {job.skills_required.split(',').map((skill, i) => (
                            <View key={i} style={{ backgroundColor: colors.pillBg, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7 }}>
                                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Medium', color: colors.pillText }}>{skill.trim()}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Applications */}
                <View style={cardStyle}>
                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Applications ({job?.applications?.length || 0})
                    </Text>
                    {job?.applications?.length > 0 ? (
                        job.applications.map((application, i) => (
                            <Link href={`/users/${application.id}`} key={i} asChild>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: colors.surfaceSecondary,
                                        borderRadius: 14,
                                        padding: 14,
                                        marginBottom: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderWidth: isDark ? 0.5 : 0,
                                        borderColor: colors.separator,
                                    }}
                                >
                                    <View style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        backgroundColor: colors.pillBg,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12,
                                    }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Poppins-Bold', color: colors.primary }}>
                                            {application.name?.charAt(0)?.toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.label }}>{application.name}</Text>
                                        <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginTop: 2 }}>{application.email}</Text>
                                        <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary, marginTop: 2 }}>{application.phone}</Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={20} color={colors.labelTertiary} />
                                </TouchableOpacity>
                            </Link>
                        ))
                    ) : (
                        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                            <Feather name="inbox" size={40} color={colors.labelTertiary} />
                            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelTertiary, marginTop: 12 }}>
                                No applications yet
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default JobPosting;
