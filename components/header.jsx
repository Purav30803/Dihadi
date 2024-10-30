import { View, Text } from 'react-native'
import React from 'react'
import goBack from './lastPath'
import Icon from 'react-native-vector-icons/Octicons';

const TitleHeader = ({ name }) => {
    return (
        // <View>
            <View className="pt-12 pl-6 flex-row gap-x-8">
                {name !== "Dihadi" &&<Icon name="arrow-left" size={30} color="#000" onPress={goBack} />}
                <Text className="text-3xl font-pmedium text-gray-900 items-center mb-12">
                    {name}</Text>
            </View>
        // </View>
    )
}

export default TitleHeader