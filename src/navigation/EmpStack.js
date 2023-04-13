import { StyleSheet} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import MarkAttendance from '../screens/MarkAttendance';
import Profile from '../screens/Profile';
import Notifications from '../screens/Notifications';



const Stack = createNativeStackNavigator();


const EmpStack = () => {
  

    return (
        <Stack.Navigator>


            {/* Mark Attendance Screen */}
            <Stack.Screen name='MarkAttendance' component={MarkAttendance}>
            </Stack.Screen>

            {/* Notification Screen */}
            <Stack.Screen name='Notifications' component={Notifications}>
            </Stack.Screen>

            {/* Profile Screen */}
            <Stack.Screen name='Profile' component={Profile}>
            </Stack.Screen>


        </Stack.Navigator>
    )
}

export default EmpStack

const styles = StyleSheet.create({})