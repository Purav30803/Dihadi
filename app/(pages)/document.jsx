import { ActivityIndicator, Image, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleHeader from '../../components/header';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const Document = () => {
  const [token, setToken] = useState();
  const [url, setUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { colors, isDark } = useTheme();

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) setToken(JSON.parse(token));
  };

  const getData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/me/document', { headers: { Authorization: `Bearer ${token}` } });
      setUrl(response?.data?.id_proof);
    } catch (error) {
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
    getData();
  }, [token]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save the document to your device.');
        return;
      }
      const filename = `document_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      const base64Data = url.split('base64,')[1] || url;
      await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Documents', asset, false);
      await FileSystem.deleteAsync(fileUri);
      Alert.alert('Success', 'Document has been saved to your device.');
    } catch (error) {
      Alert.alert('Download Failed', 'There was an error downloading the document. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setDownloading(true);
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        Alert.alert('Sharing Unavailable', 'Sharing is not available on this device.');
        return;
      }
      const filename = `document_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      const base64Data = url.split('base64,')[1] || url;
      await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(fileUri);
      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      Alert.alert('Sharing Failed', 'There was an error sharing the document. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleReplace = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
      });
      if (result.canceled) return;
      const newImageBase64 = result.assets[0].base64;
      setUploading(true);
      await api.put('/users/me', { id_proof: `data:image/jpeg;base64,${newImageBase64}` }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrl(`data:image/jpeg;base64,${newImageBase64}`);
      Alert.alert('Success', 'Document replaced successfully.');
    } catch (error) {
      Alert.alert('Replace Failed', 'There was an error replacing the document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const cardStyle = {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0 : 0.05,
    shadowRadius: 8,
    borderWidth: isDark ? 0.5 : 0,
    borderColor: colors.separator,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TitleHeader name="ID Document" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 }}>
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: colors.label }}>ID Document</Text>
            <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.labelSecondary, marginTop: 2 }}>
              Your uploaded identification document
            </Text>
          </View>
          <TouchableOpacity onPress={getData} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialIcons name="refresh" size={18} color={colors.primary} />
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.primary }}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={[cardStyle, { alignItems: 'center', paddingVertical: 48 }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 16, fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.labelSecondary }}>
              Loading document...
            </Text>
          </View>
        ) : error ? (
          <View style={[cardStyle, { alignItems: 'center', paddingVertical: 40 }]}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.redMuted, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <MaterialIcons name="error-outline" size={32} color={colors.red} />
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.label, marginBottom: 8 }}>
              Failed to Load
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.labelSecondary, textAlign: 'center', marginBottom: 20 }}>
              There was an error loading your document.
            </Text>
            <TouchableOpacity
              onPress={getData}
              activeOpacity={0.85}
              style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : url ? (
          <View style={cardStyle}>
            {/* Document Image */}
            <View style={{ backgroundColor: colors.background, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <Image
                source={{ uri: url }}
                style={{ width: '100%', height: 280 }}
                resizeMode="contain"
              />
            </View>

            {/* Actions */}
            <View style={{ height: 0.5, backgroundColor: colors.separator, marginBottom: 16 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={handleDownload}
                disabled={downloading}
                activeOpacity={0.7}
                style={{ alignItems: 'center', gap: 6 }}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="file-download" size={22} color={colors.primary} />
                  </View>
                )}
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: colors.primary }}>
                  {downloading ? 'Saving...' : 'Download'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                disabled={downloading}
                activeOpacity={0.7}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="share" size={22} color={colors.primary} />
                </View>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: colors.primary }}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleReplace}
                disabled={uploading}
                activeOpacity={0.7}
                style={{ alignItems: 'center', gap: 6 }}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="upload-file" size={22} color={colors.primary} />
                  </View>
                )}
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: colors.primary }}>
                  {uploading ? 'Uploading...' : 'Replace'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[cardStyle, { alignItems: 'center', paddingVertical: 48 }]}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <MaterialIcons name="upload-file" size={34} color={colors.labelTertiary} />
            </View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.label, marginBottom: 8 }}>
              No Document Uploaded
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.labelSecondary, textAlign: 'center', marginBottom: 24 }}>
              Upload your identification document to verify your account
            </Text>
            <TouchableOpacity
              onPress={handleReplace}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 28,
                paddingVertical: 14,
                borderRadius: 14,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 15 }}>Upload Document</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Document;
