import { ActivityIndicator, Image, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleHeader from '../../components/header'
import api from '../../api/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../../components/Loader'
import { MaterialIcons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'

const Document = () => {
    const [token, setToken] = useState()
    const [url, setUrl] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [downloading, setDownloading] = useState(false)

    const getToken = async () => {
        const token = await AsyncStorage.getItem('token')
        if (token) {
            setToken(JSON.parse(token))
        }
    }

    const getData = async () => {
        if (!token) {
            return
        }

        try {
            setLoading(true)
            setError(null)
            const response = await api.get('/users/me/document', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const base64 = response?.data?.id_proof
            setUrl(base64)
        } catch (error) {
            console.log(error)
            setError('Failed to load document')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getToken()
        getData()
    }, [token])

    const handleRetry = () => {
        getData()
    }

    const handleDownload = async () => {
        try {
            setDownloading(true)

            // Request permissions
            const { status } = await MediaLibrary.requestPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please grant permission to save the document to your device.',
                    [{ text: 'OK' }]
                )
                return
            }

            // Create a unique filename
            const filename = `document_${Date.now()}.jpg`
            const fileUri = `${FileSystem.documentDirectory}${filename}`

            // Convert base64 to file
            const base64Data = url.split('base64,')[1] || url
            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            })

            // Save to media library
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            await MediaLibrary.createAlbumAsync('Documents', asset, false)

            // Clean up temporary file
            await FileSystem.deleteAsync(fileUri)

            Alert.alert(
                'Success',
                'Document has been saved to your device',
                [{ text: 'OK' }]
            )
        } catch (error) {
            console.error('Download error:', error)
            Alert.alert(
                'Download Failed',
                'There was an error downloading the document. Please try again.',
                [{ text: 'OK' }]
            )
        } finally {
            setDownloading(false)
        }
    }

    const handleShare = async () => {
        try {
            setDownloading(true)

            // Check if sharing is available
            const isSharingAvailable = await Sharing.isAvailableAsync()
            if (!isSharingAvailable) {
                Alert.alert(
                    'Sharing Unavailable',
                    'Sharing is not available on this device',
                    [{ text: 'OK' }]
                )
                return
            }

            // Create temporary file for sharing
            const filename = `document_${Date.now()}.jpg`
            const fileUri = `${FileSystem.documentDirectory}${filename}`

            // Convert base64 to file
            const base64Data = url.split('base64,')[1] || url
            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            })

            // Share the file
            await Sharing.shareAsync(fileUri)

            // Clean up temporary file
            await FileSystem.deleteAsync(fileUri)
        } catch (error) {
            console.error('Sharing error:', error)
            Alert.alert(
                'Sharing Failed',
                'There was an error sharing the document. Please try again.',
                [{ text: 'OK' }]
            )
        } finally {
            setDownloading(false)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <TitleHeader name="Document" />
            
            <ScrollView className="flex-1">
                {/* Document Header */}
                <View className="px-4 py-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-xl font-pbold text-gray-900">
                            ID Document
                        </Text>
                        <TouchableOpacity 
                            onPress={getData}
                            className="flex-row items-center"
                        >
                            <MaterialIcons name="refresh" size={20} color="#3b82f6" />
                            <Text className="ml-1 text-blue-500 font-pmedium">
                                Refresh
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text className="text-sm text-gray-500 font-pregular">
                        Your uploaded identification document
                    </Text>
                </View>

                {/* Document Display */}
                <View className="px-4 pb-6">
                    {loading ? (
                        <View className="bg-white rounded-xl p-8 items-center justify-center shadow-sm">
                            <Loader />
                            <Text className="mt-4 text-gray-600">
                                Loading document...
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="bg-white rounded-xl p-8 items-center shadow-sm">
                            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                                <MaterialIcons name="error-outline" size={32} color="#ef4444" />
                            </View>
                            <Text className="text-gray-900 font-medium mb-2">
                                Failed to load document
                            </Text>
                            <Text className="text-gray-500 text-center mb-4">
                                There was an error loading your document. Please try again.
                            </Text>
                            <TouchableOpacity 
                                onPress={handleRetry}
                                className="bg-blue-500 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-white font-medium">
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : url ? (
                        <View className="bg-white rounded-xl p-4 shadow-sm">
                            <View className="bg-gray-50 rounded-lg p-2 mb-4">
                                <Image 
                                    source={{ uri: url }}
                                    className="w-full h-[300px] rounded-lg"
                                    resizeMode="contain"
                                />
                            </View>
                            
                            {/* Document Actions */}
                            <View className="flex-row justify-around pt-2 border-t border-gray-100">
                                <TouchableOpacity 
                                    className="flex-row items-center p-2"
                                    onPress={handleDownload}
                                    disabled={downloading}
                                >
                                    {downloading ? (
                                        <ActivityIndicator size="small" color="#3b82f6" />
                                    ) : (
                                        <MaterialIcons name="file-download" size={24} color="#3b82f6" />
                                    )}
                                    <Text className="ml-2 text-blue-500 font-pmedium">
                                        {downloading ? 'Downloading...' : 'Download'}
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    className="flex-row items-center p-2"
                                    onPress={handleShare}
                                    disabled={downloading}
                                >
                                    <MaterialIcons name="share" size={24} color="#3b82f6" />
                                    <Text className="ml-2 text-blue-500 font-pmedium">
                                        Share
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    className="flex-row items-center p-2"
                                    onPress={() => {/* Add replace functionality */}}
                                >
                                    <MaterialIcons name="upload-file" size={24} color="#3b82f6" />
                                    <Text className="ml-2 text-blue-500 font-pmedium">
                                        Replace
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View className="bg-white rounded-xl p-8 items-center shadow-sm">
                            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <MaterialIcons name="upload-file" size={32} color="#6b7280" />
                            </View>
                            <Text className="text-gray-900 font-medium mb-2">
                                No Document Uploaded
                            </Text>
                            <Text className="text-gray-500 text-center mb-4 font-pregular">
                                Upload your identification document to get started
                            </Text>
                            <TouchableOpacity 
                                className="bg-blue-500 px-6 py-3 rounded-lg"
                                onPress={() => {/* Add upload functionality */}}
                            >
                                <Text className="text-white font-medium">
                                    Upload Document
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Document