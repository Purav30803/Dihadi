import { View, Text } from 'react-native'
import React from 'react'
import {Tabs,Redirext} from 'expo-router';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const TabIcon = ({color,name,focused,title})=>(
  <View className="items-center justify-center gap-1">
    {/* <Image source={icon} resizeMode='contain' tintColor={color} className="w-4 h-4"/> */}
    <View className={`${focused && 'rounded-full bg-blue-100'} px-6 py-1`}>

    <Icon name={name} size={20} color={focused?"rgb(59 130 246)":"black"} />
    </View>
    <Text className={`text-xs ${focused?'font-psemibold text-blue-500':'font-pregular'} `} >{title}</Text>
  </View>
)

const TabsLayout = () => {
  return (
   <>
   <Tabs screenOptions={{
    tabBarShowLabel:false,
    tabBarActiveTintColor:"#000",
    tabBarInactiveTintColor:"#4a4a4a",
    tabBarStyle:{
        backgroundColor:"#fff",
        borderTopWidth:2,
        borderTopColor:"#eee",
        height:74
    }
   }}>
    <Tabs.Screen name='home' options={{
        title:'Home',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
            <TabIcon color={color} focused={focused} name='home' title="Home"/>
        )
    }}/>
      <Tabs.Screen name='search' options={{
        title:'Search',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
            <TabIcon color={color} focused={focused} name='search' title="Search"/>
        )
    }}/>
       <Tabs.Screen name='myjobs' options={{
        title:'Posted Jobs',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
            <TabIcon color={color} focused={focused} name='browser' title="Posted Jobs"/>
        )
    }}/>
    <Tabs.Screen name='settings' options={{
        title:'Settings',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
            <TabIcon color={color} focused={focused} name='gear' title="Settings"/>
        )
    }}/>
   
 
    
   </Tabs>
   </>
  )
}

export default TabsLayout