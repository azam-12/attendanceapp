import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useContext} from 'react'


import EmployeeContext from '../context/Employee/EmployeeContext';
import AuthStack from './AuthStack';
import AdminStack from './AdminStack';
import EmpStack from './EmpStack';



const AppNav = () => {

  const Stack = createNativeStackNavigator();  

  const {isLoading, userToken, userRole} = useContext(EmployeeContext)  

  // console.log(isLoading)
  // console.log(userToken)  



  if(isLoading){
    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
            <ActivityIndicator size={'large'}/>
        </View>
    )
  }

  return (
    <NavigationContainer>
            {/* {userToken !== null ? <AppStack/> : <AuthStack/> } */}
            {userToken !== null ? (userRole === '1' ? <AdminStack/> :  <EmpStack/>) :  <AuthStack/>}
    </NavigationContainer>
  );
}

export default AppNav

const styles = StyleSheet.create({})