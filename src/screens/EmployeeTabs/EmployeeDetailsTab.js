import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect, useLayoutEffect, useContext } from 'react'
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import EmployeeContext from '../../context/Employee/EmployeeContext';
import { HOST } from '@env';


const EmployeeDetailsTab = ({ navigation, route }) => {


  const { userToken } = useContext(EmployeeContext)

  const staffMobileNumber = route.params.pressedStaffNumber


  const [staffName, setStaffName] = useState('')
  const [staffNumber, setStaffNumber] = useState('')
  const [staffId, setstaffId] = useState('')
  const [staffEmailId, setStaffEmailId] = useState('')
  const [staffCompany, setStaffCompany] = useState('')


  // console.log(staffId)

  const [editButtonFlag, setEditButtonFlag] = useState(false)


  const getStaffInfo = async () => {
    //  API call to retrieve staff details from database
    try {
      const response = await fetch(`${HOST}/api/auth/staffdetails/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        },
        body: JSON.stringify({ mobileNumber: staffMobileNumber })
      });
      const json = await response.json()
      setStaffName(json.user_name)
      setstaffId(json.user_id)
      setStaffCompany(json.user_company)
      setStaffEmailId(json.user_emailid)
    } catch (e) {
      // saving error
      console.log('EmployeedetailsTab : Phone number does not exists in staff list', e.message)
    }
  }



  useEffect(() => {
    getStaffInfo()
    setStaffNumber(staffMobileNumber)
  }, [])



  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Staff Details',
    });
  });



  const handleOnChangeName = (typedName) => {
    setStaffName(typedName)
  }

  const handleOnChangeNumber = (typedNumber) => {
    setStaffNumber(typedNumber)
  }

  const handleOnChangeEmailId = (typedEmailID) => {
    setStaffEmailId(typedEmailID)
  }

  // const handleOnChangeCompany = (typedText) => {
  //   setStaffNumber(typedText)
  // }



  const editStaffDetails = async (staffName, staffNumber, staffEmailId) => {

    const loginid = await AsyncStorage.getItem('@login_user_id')
    // API call to edit staff details
    try {
      const response = await fetch(`${HOST}/api/emp/updateemployee/${staffId}/${loginid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        },
        body: JSON.stringify({ staffName, staffNumber, staffEmailId })
      })
      // const json = await response.json();
    }
    catch (error) {
      console.log('EmployeedetailsTab editStaffDetails :', error.message)
      response.status(500).send('Some error occured')
    }
  }



  const handleAlertDelete = async (staffId) => {
    // API call
    try {
      const response = await fetch(`${HOST}/api/emp/deleteemploye/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        }
      });
      const json = await response.json();
      // console.log(json)
      navigation.dispatch(StackActions.pop(1))
      navigation.replace('Home')
    }
    catch (error) {
      console.log('EmployeeDetailsTab Delete :', error.message)
      response.status(500).send('Some error occured')
    }
  }



  const handleSaveDetails = () => {
    if (staffName.length >= 1) {

      const numberCondition = new RegExp('^[0-9]{10}$')
      if (numberCondition.test(staffNumber)) {
        editStaffDetails(staffName, staffNumber, staffEmailId)
        setEditButtonFlag(false)
        navigation.dispatch(StackActions.pop(1))
        navigation.replace('Home')
      }
      else {
        Alert.alert('Alert', 'Invalid Phone Number', [{ text: 'OK' }])
      }
    }
    else {
      Alert.alert('Alert', 'Name cannot be empty', [{ text: 'OK' }])
    }
  }



  const handleDeleteDetails = () => {
    Alert.alert('Delete Employee',
      'Once ypu delete this Employee, all his/her attendance details will be erased. Are you sure, you want to delete this Employee?', [
      {
        text: 'Yes, Delete Permanently',
        onPress: () => handleAlertDelete(staffId),
      },
      {
        text: 'Cancel',
        // onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }
    ])
  }






  return (

    <View style={styles.mainContainer}>


      <View>
        <Text style={styles.textStyle}>Staff Name</Text>

        <TextInput
          editable={editButtonFlag}
          style={styles.inputStyle}
          textAlign={'left'}
          onChangeText={handleOnChangeName}
          value={staffName}
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
          value={staffNumber}
        // minLength={1}
        />
      </View>


      <View>
        <Text style={styles.textStyle}>Staff EmailId</Text>

        <TextInput
          editable={editButtonFlag}
          style={styles.inputStyle}
          textAlign={'left'}
          onChangeText={handleOnChangeEmailId}
          value={staffEmailId}
        // minLength={1}
        />
      </View>


      <View>
        <Text style={styles.textStyle}>Staff Company</Text>

        <TextInput
          editable={false}
          style={styles.inputStyle}
          textAlign={'left'}
          // onChangeText={handleOnChangeCompany}
          value={staffCompany}
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


      {/* <View style={styles.lineStyle}></View> */}

      {/* <View style={styles.bottomLineStyle}></View> */}

      <View>
        <TouchableOpacity style={styles.touchableDeleteContainer}
          // Delete and navigate to home
          onPress={handleDeleteDetails}
        >
          <Image
            style={styles.trashIconStyle}
            source={require('../../../assets/icons/trash_48.png')}
          />
          <Text style={styles.trashIconText}>Delete Staff Details</Text>
        </TouchableOpacity>
      </View>


      {/* <View style={styles.lineStyle}></View> */}



    </View>
  )
}





const styles = StyleSheet.create({


  mainContainer: {
    marginTop: 20,
    flex: 1,
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

  lineStyle: {
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
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

  textStyle: {
    marginHorizontal: 15,
    fontWeight: 300,
  },

  buttonText: {
    // fontWeight: 400,
  },

  iconStyle: {
    width: '100%',
    height: 30,
    aspectRatio: 1,
  },

  bottomLineStyle: {
    marginTop: 10, // to keep it at the bottom
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  touchableDeleteContainer: {
    marginTop: 20,
    marginHorizontal: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  trashIconStyle: {
    width: 20,
    height: 20,
    aspectRatio: 1,
  },

  trashIconText: {
    marginLeft: 10,
    height: 20,
    color: '#FF0000'
  },

})


export default EmployeeDetailsTab