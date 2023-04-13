import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';



import EmployeeContext from '../../context/Employee/EmployeeContext';
import { HOST } from '@env';


const AddEmployeeDetails = ({ navigation, route }) => {


    const { userToken } = useContext(EmployeeContext)

    const showAlert = () => {
        Alert.alert('Success', 'Added successfully', [{ text: 'OK' }])
    }


    // Add an Employee
    const addEmployees = async (name, mobileNumber, company, role) => {

        // autogenerate password for user type employees as first 3 letters of company, initial is capital and append with '@1234'

        // convert string to lowercase and trim white spaces
        const companyNameString = company.toLowerCase().replace(/\s/g, "")
        const password = companyNameString.charAt(0).toUpperCase() + companyNameString.substring(1, 3) + '@1234'

        //  API call

        try {
            const response = await fetch(`${HOST}/api/emp/addemployee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': userToken
                },
                body: JSON.stringify({ name, mobileNumber, company, password, role })
            })
            const json = await response.json();

        } catch (error) {
            console.log('AddEmployeeDetails addEmployee', error.message)
        }

        // Show admin the password of added employee
        Alert.alert('Success!', `Staff added successfully whose password will be "${password}", Staff can login immediately to update the password.`, [{ text: 'OK' }])

        navigation.dispatch(StackActions.pop(1))
        navigation.replace('Home')
    }




    const handleAddEmployee = async () => {
        if (contact_name.length >= 1 && contact_phoneNumber.length >= 1) {
            const contnum = contact_phoneNumber.replace(/\s/g, '')
            let mobileNumber = contnum.substring(contnum.length - 10)
            if (mobileNumber.length === 10) {
                const name = contact_name

                // get the company name from async storage while stored during admin login
                const company = await AsyncStorage.getItem('@login_company')

                // for role = 0 permission is employee and 1 is for admin
                const role = 0

                addEmployees(name, mobileNumber, company, role)
                // showAlert()
            } else {
                Alert.alert('Alert', 'Invalid Phone Number', [{ text: 'OK' }])
            }
        }
        else {
            Alert.alert('Alert', 'Name or Phone Number should not be empty', [{ text: 'OK' }])
        }
    }


    // To autofill name and number when contact selected
    // Method 1: using useState, useEffect in AddEmployeeDetails and navigation.replace in SelectContact
    const [contact_name, setContact_name] = useState('')
    const [contact_phoneNumber, setContact_phoneNumber] = useState('')
    useEffect(() => {
        (async () => {
            try {
                const keyValue1 = await AsyncStorage.getItem('@contact_name')
                const keyValue2 = await AsyncStorage.getItem('@contact_phoneNumber')
                // console.log(keyValue)
                if (keyValue1 !== null && keyValue2 !== null) {
                    // value previously stored
                    await AsyncStorage.removeItem('@contact_name')
                    await AsyncStorage.removeItem('@contact_phoneNumber')
                    setContact_name(keyValue1)
                    setContact_phoneNumber(keyValue2)
                    // console.log('Old value removed and new set')
                }

            } catch (e) {
                // error reading value
                console.log(e)
            }
        })()
    })



    // To autofill name and number when contact selected
    // Method 2: Passing parameter(concatenating name and number) to routes   
    // const [contactName, setContactName] = useState('')
    // const [contactNumber, setContactNumber] = useState()
    // useEffect(() => {
    //     if (route.params?.post) {
    //         // Post updated, do something with `route.params.post`
    //         // For example, send the post to the server
    //         let data = route.params?.post
    //         // console.log(data)
    //         const dataArray = data.split('.')
    //         const contactName = dataArray[0]
    //         const condition = dataArray[1]
    //         const rawContactNumber = dataArray[1]
    //         const contnum = rawContactNumber.replace(/\s/g, '')
    //         let contactNumber = contnum.substring(contnum.length - 10)
    //         setContactName(contactName)
    //         setContactNumber(contactNumber)
    //         console.log(contactName)
    //         console.log(contactNumber)
    //     }
    // }, [route.params?.post]);



    const handleOnChangeName = (typedText) => {
        // setContactName(typedText)
        setContact_name(typedText)
    }

    const handleOnChangeNumber = (typedNumber) => {
        // setContactNumber(typedNumber)
        setContact_phoneNumber(typedNumber)
    }




    return (
        <View style={styles.mainContainer}>

            <View>
                <TextInput
                    style={styles.inputStyle}
                    placeholder={'Name'}
                    textAlign={'left'}
                    onChangeText={handleOnChangeName}
                    value={contact_name}
                // minLength={1}
                />
            </View>

            <View style={styles.fabArea}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={'Phone Number (optional)'}
                    textAlign={'left'}
                    value={contact_phoneNumber}
                    onChangeText={handleOnChangeNumber}
                    keyboardType={'numeric'}
                // minLength={10}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('SelectContact')}
                >
                    <Image
                        style={styles.iconStyle}
                        source={require('../../../assets/icons/contactList.png')}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.lineStyle}></View>

            <View>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={handleAddEmployee}
                >
                    <Text style={styles.buttonText}>Add Employee</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}



const styles = StyleSheet.create({
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

    },

    lineStyle: {
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 0.2,
        borderColor: 'grey',
    },

    inputStyle: {
        marginHorizontal: 15,
        marginVertical: 10,
        borderWidth: 0.8,
        borderColor: 'black',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        // fontFamily: 'regular',
        fontSize: 18,
    },

    mainContainer: {
        marginTop: 30,
        flex: 1,
    },
    iconStyle: {
        width: '100%',
        height: 30,
        aspectRatio: 1,
    },



    fabArea: {
        flexDirection: 'row',
        width: '92.5%',
        height: 50,
        marginHorizontal: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 55,
        alignItems: 'flex-end',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 0.8,
        borderColor: 'black',
    },
})

export default AddEmployeeDetails