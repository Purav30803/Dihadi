import { View, Text } from 'react-native'
import React from 'react'
import {Tabs,Redirext} from 'expo-router';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const TabIcon = ({color,name,focused,title})=>(
  <View className="items-center justify-center gap-2">
    {/* <Image source={icon} resizeMode='contain' tintColor={color} className="w-4 h-4"/> */}
    <Icon name={name} size={20} color={color}/>
    <Text className={`text-xs ${focused?'font-psemibold':'font-pregular'}`} style={{color:color}}>{title}</Text>
  </View>
)

const TabsLayout = () => {
  return (
   <>
   <Tabs screenOptions={{
    tabBarShowLabel:false,
    tabBarActiveTintColor:"#ffa001",
    tabBarInactiveTintColor:"#cdcde0",
    tabBarStyle:{
        backgroundColor:"#161622",
        borderTopWidth:1,
        borderTopColor:"232533",
        height:64
    }
   }}>
    <Tabs.Screen name='home' options={{
        title:'Home',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
            <TabIcon color={color} focused={focused} name='home' title="Home"/>
        )
    }}/>
    <Tabs.Screen name='profile' options={{
        title:'Profile',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
            <TabIcon color={color} focused={focused} name='person' title="Profile"/>
        )
    }}/>
    
   </Tabs>
   </>
  )
}

export default TabsLayout