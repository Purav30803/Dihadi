import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import goBack from './lastPath'
import Icon from 'react-native-vector-icons/Octicons';

const TitleHeader = ({ name }) => {
 

    // apply styles here
    
    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return 'Good Morning';
        } else if (currentHour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };
    return (
        // <View>
            <View className="pt-12 pl-6 flex-row gap-x-8">
                {name !== "Dihadi" &&<Icon name="arrow-left" size={30} color="#000" onPress={goBack} />}
                {<Text className={`text-3xl text-gray-900 items-center mb-12 ${name === "Dihadi" ? 'text-3xl pt-1 ml-4 font-hregular' : 'font-pmedium'}`}
>
                    {name}</Text>}
              
            </View>
        // </View>
    )
}

export default TitleHeader

