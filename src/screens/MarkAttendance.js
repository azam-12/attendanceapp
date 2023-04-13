import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'



import EmployeeContext from '../context/Employee/EmployeeContext';
import Menu from '../components/Menu';
import { HOST } from '@env';



const MarkAttendance = ({ navigation }) => {

  const { userToken } = useContext(EmployeeContext)

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [time, setTime] = useState(null);
  const [userId, setUserId] = useState(null)


  const [locationAllowed, setLocationAllowed] = useState(false)
  const [punchLocation, setPunchLocation] = useState('Waiting')

  // map javascript API code
  // const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission for location denied');
        setLocationAllowed(false)
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const date = new Date(location.timestamp);
        setTime(date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',   
          hour12: true,
        }))

        // map javascript API code
        // const API_KEY = 'AIzaSyAu73UO-eHaQ5rUBDVZ8S1EZaqcTI7LhWg';
        // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${API_KEY}`;
        // const response = await fetch(url);
        // const data = await response.json();
        // console.log(data)
        // if (data.status === 'OK') {
        //   setAddress(data.results[0].formatted_address);
        // }

        setLocation(location);
        // setLocationAllowed(true)

        if (location.coords.latitude > 18.477200 && location.coords.latitude < 18.477272) {
          if (location.coords.longitude > 73.861975 && location.coords.longitude < 73.86207) {
            setPunchLocation('Office')
            //  console.log('Inside office')
          } else {
            setPunchLocation('Outside Office')
            //  console.log('Outside office 1')
          }
        } else {
          setPunchLocation('Outside Office')
          //  console.log('Outside office 2')
        }

      } catch (error) {
        setErrorMsg('Permission for location denied');
      }

    })();
  }, [location]);


  // run this useeffect and check the status if any one changes and accordingly enable or disable the buttons
  const [punchInStatus, setpunchInStatus] = useState('new_document')
  const [punchOutStatus, setpunchOutStatus] = useState('new_document')
  // const [idData, setIdData] = useState('new_document')

  const curDate = new Date()
  const dateString = curDate.toISOString()
  const yymmddString = dateString.substring(0, 10)


  const getPunchStatus = async () => {
    const user_id = await AsyncStorage.getItem('@login_user_id')
    setUserId(user_id)

    // to this api we pass user_id, current day and punchOutStatus as 'Punch_Out_Status' is hardcoded at the backend
    // This api takes current day, employee id and punchOutStatus as 'Punch_Out_Pending' as parameters and us return punchIn, punchOut status with that relevant id 

    try {
      const response = await fetch(`${HOST}/api/auth/status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        },
        body: JSON.stringify({ ownerId: userId, date: yymmddString })
      });
      const json = await response.json()

      // here new_document refers to the entry in empLocation collection which is incomplete or punchOut pending 
      // that means punchIn is done but punchOut is pending
      // if json._id returns some id means that there is entry with punchIn done but punchOut pending
      if (json._id !== 'new_document') {
        // remove previous value and then set the the new value
        await AsyncStorage.removeItem('@login_updatePunchIn_id')
        await AsyncStorage.setItem('@login_updatePunchIn_id', json._id)
        // const _id = await AsyncStorage.getItem('@updatePunchIn_id')

        setpunchInStatus(json.punchInStatus)
        setpunchOutStatus(json.punchOutStatus)
      }

      // First all the below 3 very important task are completed only then we can enable the punchIn and punchOut button 
      // 1.device location is enabled 
      // 2.device gets the current location coordinates 
      // 3.getPunchStatus() gets the punchIn status whether user is punching first time(we should enable punchIn button) or 
          // punchIn is done but punchOut is pending(we should disable punchIn and enable punchOut button)
      setLocationAllowed(true)

    } catch (error) {
      console.log('MarkAttendance : ', error.message)
    }
  }

  
  useEffect(() => {
    getPunchStatus()
    // console.log(punchInStatus)
    // console.log(punchOutStatus)
  })



  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location !== null) {
    text = JSON.stringify(location);
  }



  const handleOnPressPunchIn = async () => {

    // First we have to disable both the buttons because it takes time to process the below code and the this variable will be 
    // enabled/updated at the end of getPunchStatus() function so need to enable them again
    setLocationAllowed(false)

    // Code to save the punchIn location in empLocation collection

    //retrieve userId from async storage to save that user's  location 
    const ownerId = await AsyncStorage.getItem('@login_user_id')
    // console.log(user_id)
    const punchInLat = location.coords.latitude
    const punchInLon = location.coords.longitude
    const punchInAlt = location.coords.altitude
    const punchInTime = time
    const punchInStatus = 'complete'
    const punchInLocation = punchLocation

    //  API call

    try {

      const response = await fetch(`${HOST}/api/emplocation/addPunchInLocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        },
        body: JSON.stringify({ punchInLat, punchInLon, punchInAlt, punchInTime, punchInStatus, punchInLocation, ownerId })
      })
      const json = await response.json();
      getPunchStatus()
      // navigation.dispatch(StackActions.pop(1))
      navigation.replace('MarkAttendance')
    } catch (error) {
      console.log('MarkAttendance PunchIn : ', error.message)
    }

  }


  const handleOnPressPunchOut = async () => {

    // First we have to disable both the buttons because it takes time to process the below code and the this variable will be 
    // enabled/updated at the end of getPunchStatus() function so need to enable them again
    setLocationAllowed(false)
    

    // Code to update the punchOut location in empLocation collection when punchIn is done

    //retrieve userId from async storage to save that user's  location 
    const _id = await AsyncStorage.getItem('@login_updatePunchIn_id')
    // console.log(_id)
    const punchOutLat = location.coords.latitude
    const punchOutLon = location.coords.longitude
    const punchOutAlt = location.coords.altitude
    const punchOutTime = time
    const punchOutStatus = 'complete'
    const punchOutLocation = punchLocation

    //  API call
    try {
      const response = await fetch(`${HOST}/api/emplocation/addPunchOutLocation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        },
        body: JSON.stringify({ punchOutLat, punchOutLon, punchOutAlt, punchOutTime, punchOutStatus, punchOutLocation, _id })
      })
      const json = await response.json();

      // since like in handlePunchIn() at the end getPunchStatus() function which automatically updates the button enable/ disable status
      // here we don't call that function so update LocationAllowed variable manually
      setLocationAllowed(true)

      // console.log(json)
      // navigation.dispatch(StackActions.pop(1))
      navigation.replace('MarkAttendance')
    } catch (error) {
      console.log('MarkAttendance PunchOut : ', error.message)
    }
  }




  return (

    <View>

      <View style={styles.container}>
        {/*map javascript API code*/}
        {/* <Text>Current Location: </Text>{address} */}
        {<Text>Attendance will be marked from: {punchLocation}</Text>}
        {location ? <Text>latitude = {location.coords.latitude}</Text> : null}
        {location ? <Text>longitude = {location.coords.longitude}</Text> : null}
        {location ? <Text>altitude = {location.coords.altitude}</Text> : null}
        {location ? <Text>timestamp = {time}</Text> : null}
      </View>

      {/* <View style={styles.container}>
        <Text style={styles.paragraph}>Location: {text}</Text>
      </View> */}

      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={styles.buttonStyle}
          // when punchInStatus === 'new_document' means there is the first document of the day or all the document for that day are in complete status of punchIn and punchOut
          //since fetchstatus api gives us id, punchIn, punchOut status taking in user_id and the day
          disabled={!locationAllowed || (text === 'Waiting..') || !(punchInStatus === 'new_document')}
          onPress={handleOnPressPunchIn}
        >
          <Text style={styles.buttonText}>Punch In</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.buttonStyle}
          disabled={!locationAllowed || (text === 'Waiting..') || !(punchOutStatus === 'Punch_Out_Pending')}
          onPress={handleOnPressPunchOut}
        >
          {/* {punchOutStatus ? "Punch Out Not Allowed" : "Punch Out Allowed"} */}
          <Text style={styles.buttonText}>Punch Out</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.notifyStyle}>
        <TouchableOpacity>
          <Text style={styles.notifyText}>Check Today's Notes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lineStyle}></View>
      <Menu />
      <View style={[
        styles.lineStyle,
        {
          marginVertical: 5,
        }
      ]}>
      </View>

    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'coral',
    height: 136,    //    imp parameter of height claculated when coordinates are displayed on the coral container
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonStyle: {
    marginVertical: 10,
    marginHorizontal: 15,
    height: 50,
    width: 170,
    borderRadius: 5,
    backgroundColor: '#00ff9f',
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabled: {
    opacity: 0.5
  },

  buttonText: {

  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'black',
    height: 70,
    justifyContent: 'center'
  },
  notifyStyle: {
    alignItems: 'center',
    backgroundColor: '#bae1ff',
    height: 30,
    justifyContent: 'center',
    marginBottom: 447,  //  to keep menu at the bottom
    // marginBottom: 522,  //  to keep menu at the bottom
  },

  notifyText: {

  },

  lineStyle: {
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
  },
})


export default MarkAttendance

