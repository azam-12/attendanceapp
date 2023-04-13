import { StyleSheet} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import MarkAttendance from '../screens/MarkAttendance';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import Notifications from '../screens/Notifications';
import AddEmployeeDetails from '../screens/AddStaff/AddEmployeeDetails';
import SelectContact from '../screens/AddStaff/SelectContact';
import Home from '../screens/Home';
import EmployeeDetailsTab from '../screens/EmployeeTabs/EmployeeDetailsTab';



const Stack = createNativeStackNavigator();


const AdminStack = () => {
  

    return (
        <Stack.Navigator>

            {/* Home Screen */}
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }}>
            </Stack.Screen>


            {/* Mark Attendance Screen */}
            <Stack.Screen name='MarkAttendance' component={MarkAttendance}>
            </Stack.Screen>

            {/* Notification Screen */}
            <Stack.Screen name='Notifications' component={Notifications}>
            </Stack.Screen>

            {/* Profile Screen */}
            <Stack.Screen name='Profile' component={Profile}>
            </Stack.Screen>

            {/* Settings Screen */}
            <Stack.Screen name='Settings' component={Settings}>
            </Stack.Screen>

            {/* AddEmployeeDetails Screen */}
            <Stack.Screen name='AddEmployeeDetails' component={AddEmployeeDetails}>
            </Stack.Screen>

            {/* SelectContact Screen */}
            <Stack.Screen name='SelectContact' component={SelectContact}>
            </Stack.Screen>

            {/* SelectContact Screen */}
            <Stack.Screen name='EmployeeDetailsTab' component={EmployeeDetailsTab}>
            </Stack.Screen>


        </Stack.Navigator>
    )
}

export default AdminStack

const styles = StyleSheet.create({})