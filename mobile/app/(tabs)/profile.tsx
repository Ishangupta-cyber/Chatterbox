import { Text, ScrollView, TouchableHighlight } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth, useUser } from '@clerk/clerk-expo'

const ProfileTab = () => {


  const { signOut } = useAuth()
  const useUserData = useUser()

  console.log(useUserData)
  
  return (
   <SafeAreaView className="flex-1 bg-surface">
       
   <TouchableHighlight className="px-4 py-3 border-b border-muted/30" 
   onPress={() => 
    signOut()
   }>
    
     <Text className="text-lg font-medium text-primary">Sign out</Text>
   </TouchableHighlight>
       </SafeAreaView>
  )
}

export default ProfileTab