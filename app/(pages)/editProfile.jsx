import { 
    View, 
    Text, 
    ScrollView, 
    Platform, 
    TouchableOpacity, 
    ActivityIndicator 
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import TitleHeader from '../../components/header';
  import FormField from '../../components/FormField';
  import api from '../../api/api';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
  import { useRouter } from 'expo-router';
  
  const EditProfile = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [form, setForm] = useState({
      name: '',
      phone: '',
      location: '',
      skills: '',
      working_hours: {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: ''
      },
    });
  
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setToken(JSON.parse(token));
      }
    };
  
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const user = response.data;
        setForm({
          name: user.name || '',
          phone: user.phone || '',
          location: user.location || '',
          skills: user.skills || '',
          working_hours: user.working_hours || {
            Monday: '',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: '',
            Sunday: ''
          },
        });
      } catch (error) {
        console.error('Error fetching user details:', error.response || error);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Failed to fetch user details.'
        });
      }
      setLoading(false);
    };
  
    useEffect(() => {
      getToken();
    }, []);
  
    useEffect(() => {
      if (token) {
        fetchUserDetails();
      }
    }, [token]);
  
    const handleInputChange = (field, value) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };
  
    const handleWorkingHoursChange = (day, value) => {
      setForm(prev => ({
        ...prev,
        working_hours: {
          ...prev.working_hours,
          [day]: value
        }
      }));
    };
  
    const handleSubmit = async () => {
      if (!form.name || !form.phone || !form.location || !form.skills) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'All fields are required'
        });
        return;
      }
      const workingHoursRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] - ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

      if (
        Object.values(form.working_hours).some((value) => value.trim() !== "") && // Check if any value is non-empty
        !Object.values(form.working_hours).every((value) => value.trim() === "" || workingHoursRegex.test(value)) // Validate only non-empty values
      ) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Invalid working hours format. Please enter in HH:MM - HH:MM format.'
        });
        return;
      }
      
      setLoading(true);
      try {
        console.log('Updating profile:', form);
        await api.put(
          '/users/me',
          { ...form },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Profile Updated Successfully'
        });
        router.push('/profile');
      } catch (error) {
        console.error('Error updating profile:', error.response || error);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Failed to update profile.'
        });
      }
      setLoading(false);
    };
  
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      );
    }
  
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView>
          <TitleHeader name="Edit Profile" />
          <View className="px-4 pb-6">
            {/* Name */}
            <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold mb-2">Name</Text>
              <FormField
                title="Name"
                placeholder="Enter Your Name"
                value={form.name}
                handleChangeText={(e) => handleInputChange('name', e)}
              />
            </View>
  
            {/* Phone */}
            <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold mb-2">Phone</Text>
              <FormField
                title="Phone"
                placeholder="Enter Your Phone Number"
                value={form.phone}
                handleChangeText={(e) => handleInputChange('phone', e)}
              />
            </View>
  
            {/* Location */}
            <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold mb-2">Location</Text>
              <FormField
                title="Location"
                placeholder="Enter Your Location"
                value={form.location}
                handleChangeText={(e) => handleInputChange('location', e)}
              />
            </View>
  
            {/* Skills */}
            <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold mb-2">Skills</Text>
              <FormField
                title="Skills"
                placeholder="Enter Your Skills (comma-separated)"
                value={form.skills}
                handleChangeText={(e) => handleInputChange('skills', e)}
              />
            </View>
  
            {/* Working Hours */}
            <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold mb-2">Working Hours</Text>
              {Object.keys(form.working_hours).map((day) => (
                <View key={day} className="mb-2">
                  <Text className="text-sm font-semibold text-gray-600">{day}</Text>
                  <FormField
                    title={day}
                    placeholder="e.g., 9 AM - 5 PM"
                    value={form.working_hours[day]}
                    handleChangeText={(e) => handleWorkingHoursChange(day, e)}
                  />
                </View>
              ))}
            </View>
  
            {/* Submit Button */}
            <TouchableOpacity
              className="bg-secondary py-3 mx-6 rounded-lg"
              onPress={handleSubmit}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white text-center text-lg font-pbold">
                  Update Profile
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default EditProfile;
  