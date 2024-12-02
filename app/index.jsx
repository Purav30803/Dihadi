import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect,router } from 'expo-router';
import CustomButton from '../components/customButton';
import logo from '../assets/images/logo1.png';
import demo from '../assets/images/demo.png';
import checkToken from '../components/checkToken';
import { useEffect } from 'react';
export default function App() {
    const token = checkToken(); 
    if(token?.legth > 1){
       return <Redirect href="/home"/>
    }


  return (
   <SafeAreaView className="bg-primary h-full"> 
         
        <ScrollView contentContainerStyle={{height:"100%"}}>
            <View className="w-full justify-center items-center min-h-[85vh] px-2">
                <Image source={logo} className="w-[190px] h-[84px]" resizeMode='contain'/>
                <Image source={demo} className="w-[200px] h-[300px] rounded-xl my-12"/> 
                <View className="relative mt-5">
                    <Text className="text-2xl px-2 text-white font-pbold text-center">
                        Discover Endless Possibilities with {''}
                        <Text className="text-secondary-200">Dihadi</Text>
                    </Text>
                    {/* <Image source={images.path} className="w-[136px] h-[15px] absolute -bottom-2 -right-8" resizeMode='contain'/>                     */}
                </View>
                <CustomButton title="Continue with Email" handlePress={()=>router.push('/sign-in')} containerStyles="w-[80%] mt-7" textStyles="text-white"/>
            </View>
        </ScrollView>
        <StatusBar backgroundColor='#161622' style='light' />
   </SafeAreaView>
  );
}