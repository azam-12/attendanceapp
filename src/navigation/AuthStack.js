import { StyleSheet} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Login from '../screens/LoginAuthentication/Login';
import ForgotPassword from '../screens/LoginAuthentication/ForgotPassword';
import SignUp from '../screens/LoginAuthentication/SignUp';
// import ResetPassword from '../screens/LoginAuthentication/ResetPassword'


const AuthStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>

            {/* Login Screen */}
            <Stack.Screen name='Sign In' component={Login}>
            </Stack.Screen>


            {/* Forgot Password Screen */}
            <Stack.Screen name='Forgot Password' component={ForgotPassword}>
            </Stack.Screen>


            {/* Sign Up Screen */}
            <Stack.Screen name='Sign Up' component={SignUp}>
            </Stack.Screen>


            {/* Reset Password Screen */}
            {/* <Stack.Screen name='Reset Password' component={ResetPassword}>
            </Stack.Screen> */}


        </Stack.Navigator>
    )
}



export default AuthStack

const styles = StyleSheet.create({})