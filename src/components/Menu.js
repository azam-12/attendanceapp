import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import React, {useContext} from 'react'
import { useNavigation } from '@react-navigation/native'



import EmployeeContext from '../context/Employee/EmployeeContext';
 


const Menu = () => {

  const navigation = useNavigation()

  const {userRole} = useContext(EmployeeContext) 

  return (
    <View style={styles.menuContainer}>


      {/* if role is 1 then he is admin else employee */}
      {userRole === '1' ? 
        <TouchableOpacity
        onPress={() => navigation.navigate('Home')}>
        <Text>Home</Text>
      </TouchableOpacity> : null}
      

      <TouchableOpacity
        onPress={() => navigation.navigate('MarkAttendance')}>
        <Text>Mark Atten...</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}>
        <Text>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}>
        <Text>Profile</Text>
      </TouchableOpacity>


      {/* if role is 1 then he is admin else employee */}
      {userRole === '1' ? 
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}>
        <Text>Settings</Text>
      </TouchableOpacity> : null}

    </View>
  )
}

export default Menu

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: StatusBar.currentHeight   
    // This height should be equal to statusbar height since we have given marginBottom of same height to statusbar style
  },
})