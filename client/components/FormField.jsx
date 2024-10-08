import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';

// import { icons } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState('')
    return (
        <View className={`${otherStyles}`}>
            {/* <Text className="text-base text-black-100 font-pmedium">{title}</Text> */}
            <View className="flex-row px-4 mt-4 py-2 h-14 justify-between flex bg-white border border-gray-200 rounded-lg focus:border-blue-300 border-2">
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={handleChangeText}
                    className="w-full h-full text-base flex-1 font-pregular text-primary"
                    placeholderTextColor="#7b7b8b"
                    secureTextEntry={title === 'Password' && !showPassword ? true : false}
                />
                {
                    title === 'Password' && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {!showPassword ? <Icon name="eye-outline" size={23} color="#000" className="mt-1"/> :<Icon name='eye-off-outline' size={23} color="#000" className="mt-1"/>}
                        </TouchableOpacity>
                    )
                }
                
            </View>
        </View>
    )
}

export default FormField