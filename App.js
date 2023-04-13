import EmployeeState from './src/context/Employee/EmployeeState';
import { StyleSheet, StatusBar } from 'react-native';

import AppNav from './src/navigation/AppNav';

// console.log(StatusBar.currentHeight)
// console.log(StatusBar)

export default function App() {

  return (
    <EmployeeState>
      <StatusBar style={styles.statusBarStyle}/>
      <AppNav />
    </EmployeeState>
  )


}



const styles = StyleSheet.create({
  statusBarStyle: {
    marginBottom: StatusBar.currentHeight
  }
})  