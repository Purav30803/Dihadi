import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import logo from '../assets/images/logo1.png';
import demo from '../assets/images/demo.png';
import checkToken from '../components/checkToken';
import { useTheme } from '../context/ThemeContext';

export default function App() {
    const token = checkToken();
    const { colors, isDark } = useTheme();

    if (token?.length > 1) {
        return <Redirect href="/home" />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 48 }}>

                    {/* Logo */}
                    <Image
                        source={logo}
                        style={{ width: 160, height: 70 }}
                        resizeMode="contain"
                    />

                    {/* Hero Image */}
                    <View style={{
                        marginTop: 40,
                        marginBottom: 40,
                        width: 240,
                        height: 300,
                        borderRadius: 24,
                        overflow: 'hidden',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: 0.15,
                        shadowRadius: 24,
                        elevation: 8,
                    }}>
                        <Image
                            source={demo}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Headline */}
                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Text style={{
                            fontSize: 28,
                            fontFamily: 'Poppins-Bold',
                            color: colors.label,
                            textAlign: 'center',
                            lineHeight: 36,
                        }}>
                            Find Your Next{'\n'}
                            <Text style={{ color: colors.primary }}>Opportunity</Text>
                        </Text>
                        <Text style={{
                            fontSize: 15,
                            fontFamily: 'Poppins-Regular',
                            color: colors.labelSecondary,
                            textAlign: 'center',
                            marginTop: 10,
                            lineHeight: 22,
                            paddingHorizontal: 16,
                        }}>
                            Connect with local jobs and employers on Dihadi
                        </Text>
                    </View>

                    {/* CTA Button */}
                    <TouchableOpacity
                        onPress={() => router.push('/sign-in')}
                        activeOpacity={0.85}
                        style={{
                            backgroundColor: colors.primary,
                            width: '100%',
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
                        <Text style={{
                            color: '#FFFFFF',
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 17,
                        }}>
                            Get Started
                        </Text>
                    </TouchableOpacity>

                    {/* Sign up link */}
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                        <Text style={{ color: colors.labelSecondary, fontFamily: 'Poppins-Regular', fontSize: 14 }}>
                            New to Dihadi?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/sign-up')}>
                            <Text style={{ color: colors.primary, fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <StatusBar style={isDark ? 'light' : 'dark'} />
        </SafeAreaView>
    );
}
