import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect, useLayoutEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions } from '@react-navigation/native';
import { HOST } from '@env';


import Menu from '../components/Menu';
import EmployeeContext from '../context/Employee/EmployeeContext';

// required to exit from app when logout pressed
import { BackHandler } from 'react-native'


const Profile = ({ navigation }) => {

  const { logout, userToken } = useContext(EmployeeContext)


  const [userName, setUserName] = useState()
  const [userId, setUserId] = useState()
  const [userMobileNumber, setUserMobileNumber] = useState()
  const [userEmailId, setUserEmailId] = useState()
  const [userCompanyName, setUserCompanyName] = useState()


  useEffect(() => {
    (async () => {
      const user_id = await AsyncStorage.getItem('@login_user_id')
      const user_name = await AsyncStorage.getItem('@login_user_name')
      const user_mobileNumber = await AsyncStorage.getItem('@login_mobileNumber')
      const user_emailid = await AsyncStorage.getItem('@login_emailid')
      const user_company = await AsyncStorage.getItem('@login_company')
      setUserName(user_name)
      setUserId(user_id)
      setUserMobileNumber(user_mobileNumber)
      setUserEmailId(user_emailid)
      setUserCompanyName(user_company)
    })()
  }, [])


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: userName,
    });
  });


  const [editButtonFlag, setEditButtonFlag] = useState(false)

  const handleOnChangeName = (typedName) => {
    setUserName(typedName)
  }

  const handleOnChangeNumber = (typedNumber) => {
    setUserMobileNumber(typedNumber)
  }

  const handleOnChangeEmailId = (typedEmailID) => {
    setUserEmailId(typedEmailID)
  }




  const editStaffDetails = async (staffName, staffEmailId) => {

    // At the backend we receive two parameters 1st is the id to be updated and 2nd is the logged in user id
    // API call to edit staff details
    try {
      const response = await fetch(`${HOST}/api/emp/updateemployee/${userId}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        },
        body: JSON.stringify({ staffName, staffEmailId })
      })
      const json = await response.json();
      // console.log(json)
    }
    catch (error) {
      console.log('Profile editStaffDetails :', error.message)
      response.status(500).send('Some error occured')
    }
  }



  const handleSaveDetails = async () => {
    if (userName.length >= 1) {

      const numberCondition = new RegExp('^[0-9]{10}$')
      if (numberCondition.test(userMobileNumber)) {
        editStaffDetails(userName, userEmailId)
        // editStaffDetails(userName, userMobileNumber, userEmailId)
        setEditButtonFlag(false)

        // to do 1,2 and 3
        //  1.  remove only the editable fields from AsyncStorage variables i.e. name and email id keep rest as it is 
        // so we don't call clearAppData() method because this method will remove all the asyncStorage variables.
        // await clearAppData()

        await AsyncStorage.removeItem('@login_user_name')
        await AsyncStorage.removeItem('@login_emailid')

        //  This api call also used in login page
        //  2.  call to db to get the modified details of admin or employee since this api is for both users
        try {


          const response = await fetch(`${HOST}/api/auth/staffdetails/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': userToken
            },
            body: JSON.stringify({ mobileNumber: userMobileNumber })
          });
          const json = await response.json()
          // console.log(json)


          if (json) {
            //  3.  again store modified fields in AsyncStorage variables
            // await AsyncStorage.setItem('@login_user_id', json.user_id)
            // await AsyncStorage.setItem('@login_mobileNumber', json.user_mobileNumber)
            // await AsyncStorage.setItem('@login_company', json.user_company)
            // await AsyncStorage.setItem('@login_userToken', json.token)

            await AsyncStorage.setItem('@login_user_name', json.user_name)
            await AsyncStorage.setItem('@login_emailid', json.user_emailid)
          }

          navigation.dispatch(StackActions.pop(1))
          // navigation.replace('Home')   Donot uncomment because home is not present for employee login, it will throw error

        } catch (error) {
          console.log('Profile SaveDetails : ', error.message)
        }

      }
      else {
        Alert.alert('Alert', 'Invalid Phone Number', [{ text: 'OK' }])
      }

    }
    else {
      Alert.alert('Alert', 'Name cannot be empty', [{ text: 'OK' }])
    }
  }




  // This method will clear only the used asyncstorage variables created while operating the app
  const clearAppData = async function () {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // console.log(keys)

      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing app data.');
    }
  }



  // This method will exit the app
  const onPresslogOut = async () => {
    logout()
    await clearAppData()
    BackHandler.exitApp()
  }


  return (
    <View style={styles.mainContainer}>

      <View>
        <Text style={styles.textStyle}>Name</Text>

        <TextInput
          editable={editButtonFlag}
          style={styles.inputStyle}
          textAlign={'left'}
          onChangeText={handleOnChangeName}
          value={userName}
        // minLength={1}
        />
      </View>


      <View>
        <Text style={styles.textStyle}>Mobile Number</Text>

        <TextInput
          editable={false}
          style={styles.inputStyle}
          textAlign={'left'}
          onChangeText={handleOnChangeNumber}
          value={userMobileNumber}
        // minLength={1}
        />
      </View>


      <View>
        <Text style={styles.textStyle}>Email Id</Text>

        <TextInput
          editable={editButtonFlag}
          style={styles.inputStyle}
          textAlign={'left'}
          onChangeText={handleOnChangeEmailId}
          value={userEmailId}
        // minLength={1}
        />
      </View>



      <View>
        <Text style={styles.textStyle}>Company Name</Text>

        <TextInput
          editable={false}
          style={styles.inputStyle}
          textAlign={'left'}
          // onChangeText={handleOnChangeCompany}
          value={userCompanyName}
        // minLength={1}
        />
      </View>


      {/* <View style={styles.lineStyle}></View> */}


      <View>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => { setEditButtonFlag(true) }}
        >
          <Text style={styles.buttonText}>Edit details</Text>
        </TouchableOpacity>
      </View>



      {/* <View style={styles.lineStyle}></View> */}


      <View>
        <TouchableOpacity
          style={styles.buttonStyle}
          // Save and navigate to home
          onPress={handleSaveDetails}
          disabled={!editButtonFlag}
        >
          <Text style={styles.buttonText}>Save Details</Text>
        </TouchableOpacity>
      </View>



      {/* <View style={styles.lineStyleAfterSave}></View> */}



      <View>
        <TouchableOpacity style={styles.touchableContainer}
          onPress={onPresslogOut}
        >
          <View>
            <Image
              style={styles.headerContainer2IconStyle}
              source={require('../../assets/icons/logout.png')}
            />
          </View>
          <View>
            <Text style={styles.headerContainer2Text}>Logout and Exit App</Text>
          </View>
        </TouchableOpacity>
      </View>


      {/* <View style={styles.lineStyle}></View> */}


      <View>

        <View style={styles.bottomLineStyle}></View>
        <Menu />
        <View style={styles.lineStyle}></View>
      </View>


    </View>
  )
}


const styles = StyleSheet.create({

  mainContainer: {
    // marginTop: 683,
    marginTop: 20,
  },

  textStyle: {
    marginHorizontal: 15,
    fontWeight: 300,
  },

  inputStyle: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 0.6,
    borderColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    // fontWeight: 400,
    fontSize: 16,
  },

  buttonStyle: {
    marginVertical: 10,
    marginHorizontal: 15,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#00ff9f',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    // fontWeight: 400,
  },

  lineStyle: {
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  lineStyleAfterSave: {
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  bottomLineStyle: {
    marginTop: 120, // to keep it at the bottom
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  touchableContainer: {
    marginTop: 10,
    marginHorizontal: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  headerContainer2IconStyle: {
    marginVertical: 10,
    marginLeft: 15,
    width: 25,
    height: 25,
    aspectRatio: 1,
    // icon hex value is #0000007D, #00000087
  },

})


export default Profile
