import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={isLoading}
            style={{
                backgroundColor: colors.primary,
                borderRadius: 14,
                minHeight: 56,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isLoading ? 0.6 : 1,
            }}
            className={containerStyles}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 17,
                    }}
                    className={textStyles}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    )
}

export default CustomButton
