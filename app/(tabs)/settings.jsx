import { View, Text, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Octicons'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '../../context/ThemeContext'
import { StatusBar } from 'expo-status-bar'

const Settings = () => {
    const { colors, isDark, toggleTheme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 }}>
                <Text style={{ fontSize: 34, fontFamily: 'Poppins-Bold', color: colors.label }}>Settings</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Account Section */}
                <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Account
                </Text>
                <View style={{
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    overflow: 'hidden',
                    marginBottom: 24,
                    borderWidth: isDark ? 0.5 : 0,
                    borderColor: colors.separator,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isDark ? 0 : 0.05,
                    shadowRadius: 8,
                }}>
                    <MenuItem
                        title="Profile"
                        icon="person"
                        redirect="/profile"
                        description="View and edit your profile"
                        colors={colors}
                    />
                    <MenuItem
                        title="Document"
                        icon="file"
                        redirect="/document"
                        description="Manage your ID documents"
                        colors={colors}
                    />
                    <MenuItem
                        title="Applied Jobs"
                        icon="briefcase"
                        redirect="/appliedJobs"
                        description="Track your job applications"
                        colors={colors}
                    />
                    <MenuItem
                        title="Reset Password"
                        icon="key"
                        redirect="/resetPasswordUser"
                        description="Change your password"
                        colors={colors}
                        isLast
                    />
                </View>

                {/* Appearance Section */}
                <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Appearance
                </Text>
                <View style={{
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    overflow: 'hidden',
                    marginBottom: 24,
                    borderWidth: isDark ? 0.5 : 0,
                    borderColor: colors.separator,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isDark ? 0 : 0.05,
                    shadowRadius: 8,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                    }}>
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: isDark ? '#3A3A3C' : '#F2F2F7',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 14,
                        }}>
                            <Icon name={isDark ? 'moon' : 'sun'} size={18} color={isDark ? '#FFD60A' : '#FF9500'} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color: colors.label }}>
                                Dark Mode
                            </Text>
                            <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelTertiary, marginTop: 1 }}>
                                {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#E5E7EB', true: colors.primary }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#E5E7EB"
                        />
                    </View>
                </View>

                {/* Danger Section */}
                <Text style={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.labelTertiary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Session
                </Text>
                <View style={{
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    overflow: 'hidden',
                    borderWidth: isDark ? 0.5 : 0,
                    borderColor: colors.separator,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isDark ? 0 : 0.05,
                    shadowRadius: 8,
                }}>
                    <LogoutItem colors={colors} isDark={isDark} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const MenuItem = ({ icon, title, redirect, description, isDestructive = false, isLast = false, colors }) => {
    return (
        <TouchableOpacity
            onPress={() => router.push(redirect)}
            activeOpacity={0.7}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: isLast ? 0 : 0.5,
                borderBottomColor: colors.separator,
            }}
        >
            <View style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.iconBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
            }}>
                <Icon name={icon} size={18} color={colors.primary} />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color: colors.label }}>
                    {title}
                </Text>
                {description && (
                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelTertiary, marginTop: 1 }}>
                        {description}
                    </Text>
                )}
            </View>

            <Icon name="chevron-right" size={16} color={colors.labelTertiary} />
        </TouchableOpacity>
    );
};

const LogoutItem = ({ colors, isDark }) => {
    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('token');
                        router.push('/sign-in');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
            }}
        >
            <View style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: isDark ? '#3D1110' : '#FFF1F0',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
            }}>
                <Icon name="sign-out" size={18} color={colors.red} />
            </View>
            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color: colors.red }}>
                Sign Out
            </Text>
        </TouchableOpacity>
    );
};

export default Settings;
