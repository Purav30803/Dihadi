import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import goBack from './lastPath'
import Icon from 'react-native-vector-icons/Octicons';
import { useTheme } from '../context/ThemeContext';

const TitleHeader = ({ name, rightComponent }) => {
    const { colors } = useTheme();
    const isHome = name === 'Dihadi';

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: 12,
                gap: 12,
            }}
        >
            {!isHome && (
                <TouchableOpacity
                    onPress={goBack}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: colors.surfaceSecondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon name="arrow-left" size={18} color={colors.primary} />
                </TouchableOpacity>
            )}
            <Text
                style={{
                    fontSize: isHome ? 28 : 22,
                    color: colors.label,
                    fontFamily: isHome ? 'Heading' : 'Poppins-SemiBold',
                    flex: 1,
                }}
            >
                {name}
            </Text>
            {rightComponent && rightComponent}
        </View>
    )
}

export default TitleHeader
