import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const { colors } = useTheme();

    const isPassword = title === 'Password' || title === 'Retype Password';
    const isSearch = title === 'Search';

    return (
        <View style={{ marginTop: 12 }} className={`${otherStyles}`}>
            {title && !isSearch && (
                <Text style={{ color: colors.labelSecondary, marginBottom: 6, fontSize: 13, fontFamily: 'Poppins-Medium' }}>
                    {title}
                </Text>
            )}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.inputBg,
                    borderWidth: 1.5,
                    borderColor: focused ? colors.primary : colors.inputBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    height: 52,
                }}
            >
                <TextInput
                    keyboardType={
                        title === 'Email' ? 'email-address'
                        : title === 'Phone' ? 'phone-pad'
                        : (title === 'Age' || title === 'OTP') ? 'numeric'
                        : 'default'
                    }
                    autoComplete={
                        title === 'Email' ? 'email'
                        : isPassword ? 'password'
                        : 'off'
                    }
                    placeholder={placeholder}
                    value={value}
                    onChangeText={handleChangeText}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        flex: 1,
                        fontSize: 16,
                        fontFamily: 'Poppins-Regular',
                        color: colors.label,
                    }}
                    placeholderTextColor={colors.labelTertiary}
                    secureTextEntry={isPassword && !showPassword}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                        <Icon
                            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color={colors.labelSecondary}
                        />
                    </TouchableOpacity>
                )}
                {isSearch && (
                    <Icon name="search" size={20} color={colors.labelTertiary} />
                )}
            </View>
        </View>
    )
}

export default FormField
