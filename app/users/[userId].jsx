import { ActivityIndicator, ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import { RefreshControl } from 'react-native';
import TitleHeader from '../../components/header';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const User = () => {
    const { userId } = useLocalSearchParams();
    const [token, setToken] = useState();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState();
    const router = useRouter();
    const { colors, isDark } = useTheme();

    const getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) setToken(JSON.parse(token));
    };

    const getUser = async () => {
        setLoading(true);
        if (!token) return;
        try {
            const response = await api.get(`/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
            setUser(response.data);
        } catch (err) {
            console.log(err.response?.data);
        }
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await getUser();
        setRefreshing(false);
    };

    useEffect(() => {
        getToken();
        getUser();
    }, [token, userId]);

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

    const InfoRow = ({ icon, label, value }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.separator }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <MaterialIcons name={icon} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>{label}</Text>
                <Text style={{ fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.label, marginTop: 2 }}>{value || 'N/A'}</Text>
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <TitleHeader name="Applicant Profile" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar & Name */}
                <View style={{ alignItems: 'center', paddingVertical: 28 }}>
                    <View style={{
                        width: 88,
                        height: 88,
                        borderRadius: 44,
                        backgroundColor: colors.pillBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        borderWidth: 3,
                        borderColor: colors.primary,
                    }}>
                        <Text style={{ fontSize: 32, fontFamily: 'Poppins-Bold', color: colors.primary }}>
                            {user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 22, fontFamily: 'Poppins-Bold', color: colors.label }}>{user?.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 }}>
                        <MaterialIcons name="verified" size={16} color={colors.primary} />
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.labelSecondary }}>
                            {user?.is_student ? 'Student' : 'Professional'}
                        </Text>
                    </View>
                </View>

                {/* Contact Actions */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={() => router.push(`tel:${user?.phone}`)}
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
                        <MaterialIcons name="phone" size={18} color="#fff" />
                        <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>Call Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push(`mailto:${user?.email}`)}
                        activeOpacity={0.85}
                        style={{
                            flex: 1,
                            height: 48,
                            backgroundColor: colors.green,
                            borderRadius: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        <MaterialIcons name="email" size={18} color="#fff" />
                        <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>Email</Text>
                    </TouchableOpacity>
                </View>

                {/* Personal Info */}
                <View style={cardStyle}>
                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Personal Information
                    </Text>
                    <InfoRow icon="email" label="Email" value={user?.email} />
                    <InfoRow icon="phone" label="Phone" value={user?.phone} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
                        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                            <MaterialIcons name="location-on" size={18} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.labelTertiary }}>Location</Text>
                            <Text style={{ fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.label, marginTop: 2 }}>{user?.location || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Skills */}
                <View style={cardStyle}>
                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Skills
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {user?.skills?.split(',').map((skill, i) => (
                            <View key={i} style={{ backgroundColor: colors.pillBg, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7 }}>
                                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Medium', color: colors.pillText }}>{skill.trim()}</Text>
                            </View>
                        )) || <Text style={{ color: colors.labelTertiary, fontFamily: 'Poppins-Regular' }}>No skills listed</Text>}
                    </View>
                </View>

                {/* Working Hours */}
                <View style={cardStyle}>
                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Working Hours
                    </Text>
                    {user?.working_hours ? (
                        Object.entries(user.working_hours).map(([day, hours], i, arr) => (
                            <View key={i} style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingVertical: 10,
                                borderBottomWidth: i < arr.length - 1 ? 0.5 : 0,
                                borderBottomColor: colors.separator,
                            }}>
                                <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: colors.labelSecondary }}>{day}</Text>
                                <Text style={{ fontSize: 14, fontFamily: 'Poppins-SemiBold', color: hours ? colors.label : colors.labelTertiary }}>
                                    {hours || 'Not set'}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ color: colors.labelTertiary, fontFamily: 'Poppins-Regular' }}>No working hours listed</Text>
                    )}
                </View>

                {/* ID Proof */}
                {user?.id_proof && (
                    <View style={cardStyle}>
                        <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            ID Proof
                        </Text>
                        <View style={{ backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden' }}>
                            <Image
                                source={{ uri: user.id_proof }}
                                style={{ width: '100%', height: 220 }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default User;
