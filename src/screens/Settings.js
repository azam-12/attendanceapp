import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState, useContext } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage'


// packages required for generating, saving and sharing xlsx file
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { StorageAccessFramework } from 'expo-file-system';


import EmployeeContext from '../context/Employee/EmployeeContext';
import Menu from '../components/Menu';
import { HOST } from '@env';



const Settings = () => {

  const { userToken } = useContext(EmployeeContext)

  // const host = "https://egvky7fww5.execute-api.us-east-1.amazonaws.com/dev"
  // const host = HOST


  const [isPickerShowFrom, setisPickerShowFrom] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());


  const showPickerFrom = () => {
    setisPickerShowFrom(true);
  };




  // onChangeFrom - to continuously keep up changing date while on same page
  const onChangeFrom = (event, selectedFromDate) => {
    if (selectedFromDate) {
      setDateFrom(selectedFromDate);
    }
    if (Platform.OS === 'android') {
      setisPickerShowFrom(false);
    }
  }




  const [isPickerShowTo, setisPickerShowTo] = useState(false);
  const [dateTo, setDateTo] = useState(new Date());


  const showPickerTo = () => {
    setisPickerShowTo(true);
  };

  // onChangeTo - to continuously keep up changing date while on same page
  const onChangeTo = (event, selectedToDate) => {
    if (selectedToDate) {
      setDateTo(selectedToDate);
    }
    if (Platform.OS === 'android') {
      setisPickerShowTo(false);
    }
  }




  // This function will call generate xlsx sheet from json data obtained from api call and return base64 format to either save or share 
  const createExcel = async () => {

    //retrieve user_id from async storage to get his attendance report using employee id, from date and to date
    // Here we have set in api json body name format as employee, from and to so we changed the variable names as per format
    // const employee = await AsyncStorage.getItem('@user_id')
    const from = dateFrom
    const to = dateTo

    //  get the admin company name from asyncStorage and give to query to get that comapny employee location data
    const company = await AsyncStorage.getItem('@login_company')

    // api call to retrieve attendance data with dates specified

    try {


      const response = await fetch(`${HOST}/api/auth/report/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        },
        body: JSON.stringify({ from, to, company })
        // body: JSON.stringify({ employee, from, to })
      })
      const data = await response.json();
      // console.log(data)

      // create new workbook
      let wb = XLSX.utils.book_new();
      // create new worksheet
      let ws = XLSX.utils.json_to_sheet(data)

      // save the worksheet into workbook, parameters are: first- workbook, second- worksheet, third- worksheet name, fourth- true is handle name collision and it will just append 1 to name or relevant number to avoid collision
      XLSX.utils.book_append_sheet(wb, ws, "MyFirstSheet", true);

      // generate base64 type of workbook
      const base64 = XLSX.write(wb, { type: "base64" });
      return base64

    } catch (error) {
      console.log('Settings  : ', error.message)
    }
  }




  //  This method will generate and save xlsx file to user specified folder location
  const generateAndSaveExcel = async () => {

    // take user permission to store file in user specified folder. If permission denied do nothing and return
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      console.log('Permission not granted')
      return;
    }
    // console.log(permissions)

    // createExcel will create the excel file from data received fron db and return the workbook(excel file) in base64 type
    const base64 = await createExcel()
    // console.log(base64)
    // As of now fileName is given as currentlt logged in username
    const fileName = 'AttendanceSheet'


    try {
      // The code calls the createFileAsync method of the StorageAccessFramework object with three arguments: permissions.directoryUri, fileName, and 'application/vnd.ms-excel'. This method returns a promise that resolves to the URI of the created file
      // The then method is called on the promise returned by createFileAsync. This method takes a function that is called when the promise resolves successfully. The function takes the URI of the created file as its argument.
      // Inside the then function, the code calls the writeAsStringAsync method of the FileSystem object with three arguments: uri, base64, and { encoding: FileSystem.EncodingType.Base64 }. This method writes the base64-encoded data to the file at the specified URI.
      // 'vnd.ms-excel' is xlsx file, pdf for pdf, etc 
      await StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/vnd.ms-excel')
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        })
        .catch((e) => {
          console.log('createFileAsync catch :', e);
        });

      //  Do not navigate otherwise it will throw errors 
      // navigation.dispatch(StackActions.pop(1))
      // navigation.replace('Home')

    } catch (e) {
      throw new Error('writeAsStringAsync catch :', e);
    }
  }



  const generateAndShareExcel = async () => {

    // createExcel will create the excel file from data received fron db and return the workbook(excel file) in base64 type
    const base64 = await createExcel()

    // As of now fileName is given as currentlt logged in username
    const sharedFileName = "AttendanceSheet.xlsx"
    const filename = FileSystem.documentDirectory + sharedFileName;

    // FileSystem.writeAsStringAsync(filename, base64, {...}): This line of code writes the contents of a Base64-encoded string to a file specified by filename. The base64 parameter contains the Base64-encoded string that will be written to the file. The third parameter is an object containing options for how to write the file. In this case, the only option specified is the encoding type, which is set to FileSystem.EncodingType.Base64

    // .then(() => {...}): This line of code waits for the file to be written to the file system and then executes the code inside the function. The () => {...} is an arrow function that contains the code to execute

    // Sharing.shareAsync(filename): This line of code shares the file specified by filename using the Expo Sharing API. The Sharing.shareAsync() function takes a filename as a parameter and then shares that file using the appropriate sharing method for the device/platform

    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64
    }).then(() => {
      Sharing.shareAsync(filename);
    });

    //  Do not navigate otherwise it will throw errors
    // navigation.dispatch(StackActions.pop(1))
    // navigation.replace('Home')

  }





  return (
    <View>

      <View style={styles.headerContainerUpper}>
        <Text style={styles.headerContainerUpperText}>Select Attendance for</Text>
      </View>
      <View style={styles.headerContainer1}>
        <Text style={styles.headerContainer1Text}>From</Text>
        <View style={styles.fabContainer}>


          <TouchableOpacity style={styles.fab}
            onPress={showPickerFrom}
          >
            {!isPickerShowFrom && (
              <Image
                style={styles.iconStyle}
                source={require('../../assets/icons/calendar.png')}
              />
            )}
            <Text style={styles.fabIcon}>{dateFrom.toUTCString().substring(4, 16)}</Text>
            {/* <Image
              style={styles.iconStyle}
              source={require('../../assets/icons/expandArrow.png')}
            /> */}
            <View>
              {isPickerShowFrom && (
                <DateTimePicker
                  value={dateFrom}
                  mode={'date'}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  is24Hour={true}
                  // onChange keep to continuously keep changing date while on same page
                  onChange={onChangeFrom}
                  // onDateChange={(date) => {
                  //   setDateFrom(date)
                  // }}
                  maximumDate={Date.now()}
                />
              )}
            </View>
          </TouchableOpacity>

        </View>



        <Text style={styles.headerContainer1Text}> To</Text>



        <View style={styles.fabContainer}>

          <TouchableOpacity style={styles.fab}
            onPress={showPickerTo}
          >
            {!isPickerShowTo && (
              <Image
                style={styles.iconStyle}
                source={require('../../assets/icons/calendar.png')}
              />
            )}
            <Text style={styles.fabIcon}>{dateTo.toUTCString().substring(4, 16)}</Text>
            {/* <Image
              style={styles.iconStyle}
              source={require('../../assets/icons/expandArrow.png')}
            /> */}
            <View>
              {isPickerShowTo && (
                <DateTimePicker
                  value={dateTo}
                  mode={'date'}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  is24Hour={true}
                  // onChange keep to continuously keep changing date while on same page
                  onChange={onChangeTo}
                  // onDateChange={(date) => {
                  //   setDateTo(date)
                  // }}
                  maximumDate={Date.now()}
                />
              )}
            </View>
          </TouchableOpacity>

        </View>

      </View>




      <View>
        <TouchableOpacity style={styles.touchableContainer}
          onPress={generateAndShareExcel}
        >
          {/* ../../assets/icons/share.png */}
          <View>
            <Image
              style={styles.headerContainer2IconStyle}
              source={require('../../assets/icons/share.png')}
            />
          </View>
          <View>
            <Text style={styles.headerContainer2Text}>Generate and Share Report</Text>
          </View>
        </TouchableOpacity>
      </View>




      <View>
        <TouchableOpacity style={styles.touchableContainer}
          onPress={generateAndSaveExcel}
        >
          <View>
            <Image
              style={styles.headerContainer2IconStyle}
              source={require('../../assets/icons/download.png')}
            />
          </View>
          <View>
            <Text style={styles.headerContainer2Text}>Generate and Download Report</Text>
          </View>
        </TouchableOpacity>
      </View>



      {/* <View>
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
            <Text style={styles.headerContainer2Text}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View> */}



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



// image color is #339AF0

const styles = StyleSheet.create({


  headerContainerUpper: {
    height: 50,
    backgroundColor: '#fbf6e1',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  headerContainerUpperText: {
    fontSize: 20,
    color: '#948b6c'
  },

  headerContainer1: {
    height: 70,
    backgroundColor: '#fbf6e1',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row'
  },

  headerContainer1Text: {
    color: '#948b6c'
  },

  headerContainer2: {
    flexDirection: 'row',
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 430,  //  to keep menu at the bottom
  },

  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerContainer2IconStyle: {
    marginVertical: 10,
    marginLeft: 15,
    width: 25,
    height: 25,
    aspectRatio: 1,
    // icon hex value is #0000007D, #00000087
  },

  headerContainer2Text: {
    marginLeft: 15,
    // color: '#339AF0',
    color: '#00000087'
  },



  fab: {
    flexDirection: 'row',
    // flexDirection: 'column',
    width: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    borderRadius: 30
  },

  fabContainer: {
    flexDirection: 'row',
  },

  iconStyle: {
    width: '12%',
    height: 15,
    aspectRatio: 1,
  },


  buttonStyle: {
    marginVertical: 10,
    marginHorizontal: 15,
    height: 50,
    width: 200,
    borderRadius: 5,
    backgroundColor: '#00ff9f',
    alignItems: 'center',
    justifyContent: 'center'
  },

  lineStyle: {
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  menuViewContainer: {
    marginTop: 473,
  }

})


export default Settings