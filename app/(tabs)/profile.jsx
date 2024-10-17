import { Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  return (
    <SafeAreaView>
      <View>
        <Text className="p-12 font-pregular">Profile</Text>
        {/* Display user's name,email,phone etc */}

        
      </View>
    </SafeAreaView>
  )
}

export default Profile

