import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


import Menu from '../components/Menu';

const Notifications = () => {

  

  return (

    <View>


      <View style={styles.menuViewContainer}>
        <View style={styles.lineStyle}></View>
        <Menu />
        <View style={[
          styles.lineStyle,
          {
            marginVertical: 5,
          }
        ]}></View>
      </View>


    </View>

  )
}



const styles = StyleSheet.create({
  lineStyle: {
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  menuViewContainer: {
    marginTop: 683,
  }
})


export default Notifications