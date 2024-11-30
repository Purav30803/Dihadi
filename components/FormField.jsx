import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';

// import { icons } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState('')
    return (
        <View className={`${otherStyles}`}>
            {/* <Text className="text-base text-black-100 font-pmedium">{title}</Text> */}
            <View className="flex-row px-4 mt-4 py-2 h-16 justify-between items-center flex bg-white border border-gray-200 rounded-lg focus:border-blue-300 border-2">
                
                <TextInput
                    keyboardType={title === 'Email' ? 'email-address' : title === "Phone" ? 'phone-pad' : (title === "Age" || title === "OTP" )? 'numeric': 'default'}
                    autoCompleteType={title === 'Email' ? 'email' : title === 'Password' || title === 'Retype Password' ? 'password' : 'off'}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={handleChangeText}
                    className="w-full text-base flex-1 font-pregular text-primary"
                    placeholderTextColor="#7b7b8b"
                    secureTextEntry={(title === 'Password' || title === 'Retype Password') && !showPassword ? true : false}
                />
                {
                    (title === 'Password' || title === 'Retype Password') && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {!showPassword ? <Icon name="eye-outline" size={23} color="#000"/> :<Icon name='eye-off-outline' size={23} color="#000" />}
                        </TouchableOpacity>
                    )
                }
                {
                    (title === 'Search') && (
                        <TouchableOpacity>
                            <Icon name="search" size={23} color="#000"/> 
                        </TouchableOpacity>
                    )
                }
                
            </View>
        </View>
    )
}

export default FormField