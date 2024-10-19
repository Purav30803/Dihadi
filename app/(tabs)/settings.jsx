import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons';
import { Link, router } from 'expo-router';
import TitleHeader from '../../components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Settings = () => {

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View >
                <TitleHeader name="Settings"/>
            </View>
            <ScrollView>
                <View className="flex-1 bg-gray-50 gap-y-4">
                  <MenuItem title="Profile" icon="person" redirect="/profile"/>
                   <MenuItem title="Document" icon="file" />
                   <MenuItem title="Logout" icon="sign-out" redirect="logout" />
                
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Settings

const MenuItem = ({ icon, title,redirect }) => {

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        router.push('/sign-in')
      }
    const redirectTo = async (path) => {
        
        if(path && path.includes('profile')){
            router.push(path)
            return
        }
        else if(path && path.includes('logout')){
            logout();
        }
        else{
            return;
        }
    }
    return (
        <View className="flex-row py-6 w-full justify-between px-12 items-center" onTouchStart={()=>redirectTo(redirect)}>
        <View className="flex-row gap-x-4">
            <Icon name={icon} size={30} color={`${title==="Logout"?"red":"#000"}`}/>
            <Text className={`${title === 'Logout' ? "text-red-500":"text-gray-900"} text-2xl font-pmedium`}>{title}</Text>
        </View>
        {title!=='Logout' && <View>
            <Icon name="chevron-right" size={30} color="#000" />
        </View>}
    </View>
    )
}