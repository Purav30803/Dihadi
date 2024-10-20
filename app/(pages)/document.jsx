import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleHeader from '../../components/header';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';


const Document = () => {
    const [token, setToken] = useState()
    const [url, setUrl] = useState()


    const getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            setToken(JSON.parse(token))
        }
    }
    const getData = async () => {
        if (!token) {
            return
        }

        try {
            const response = await api.get('/users/me/document', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const base64 = response?.data?.id_proof
            setUrl(base64)

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getToken()
        getData()
    }, [token])


    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView contentContainerStyle="p-6 flex items-center">
                <TitleHeader name="Document" />
                <View>
                    <Text className="px-8 font-psemibold text-xl py-3 ">Uploaded Document</Text>
                    {url && <Image src={url} className="w-full h-[200px] mt-4" resizeMode='contain' />}
                    {!url && <Loader />}

                  
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Document
