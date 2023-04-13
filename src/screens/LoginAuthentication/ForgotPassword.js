import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


import EmployeeContext from '../../context/Employee/EmployeeContext';


import * as Animatable from 'react-native-animatable'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather';
import { HOST } from '@env';

const ForgotPassword = ({ navigation }) => {


    const { login } = useContext(EmployeeContext)

    const [data, setData] = useState({

        usernumber: '',
        isValidUserNumber: true,
        checkPhoneNumberTextInputChange: false,
        isValidNumberFlag: false,

        useremailid: '',
        isValidUserEmailId: true,
        checkUserEmailIdTextInputChange: false,
        isValidUserEmailIdFlag: false,
    })




    const handleOnChangeNumber = (val) => {
        //  regex to check only digits
        const validFlag = /^\d+$/.test(val)
        if (validFlag && val.length === 10) {
            setData({
                ...data,
                usernumber: val,
                checkPhoneNumberTextInputChange: true,
                isValidUserNumber: true,
                isValidNumberFlag: true
            })
        } else {
            setData({
                ...data,
                usernumber: val,
                checkPhoneNumberTextInputChange: false,
                isValidUserNumber: false,
                isValidNumberFlag: false
            })
        }

    }



    const handleOnChangeUserEmailId = (val) => {
        //  regex to check email id
        const validFlag = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val)
        if (validFlag) {
            setData({
                ...data,
                useremailid: val,
                isValidUserEmailId: true,
                checkUserEmailIdTextInputChange: true,
                isValidUserEmailIdFlag: true,
            })
        } else {
            setData({
                ...data,
                useremailid: val,
                isValidUserEmailId: false,
                checkUserEmailIdTextInputChange: false,
                isValidUserEmailIdFlag: false,
            })
        }

    }




    const handleOnPressSubmit = async () => {

        //  API call to retrieve user_id, user_name and user_mobileNumber from database
        // console.log(data.usernumber)
        // console.log(data.useremailid)
        try {
            const response = await fetch(`${HOST}/api/auth/forgot/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mobileNumber: data.usernumber, emailid: data.useremailid })
            });
            const json = await response.json()
            // console.log(json.success)
            if (json.success) {
                // Update the email id to entered email id and sent a password reset link to this new email id
                Alert.alert('Valid User!', 'One time Password Reset link has been sent to the entered email id which is valid for 10 minutes.', [{ text: 'Okay' }])
            } else {
                Alert.alert('Invalid User!', 'User with this Mobile Number does not exists.', [{ text: 'Okay' }])
                return
            }
        } catch (error) {
            console.log('ForgotPassword : ', error.message)
        }
        
    }




    return (
        <View style={styles.mainContainer}>


            {/* Mobile Number field */}


            <View style={styles.fabArea}>
                <MaterialIcons
                    name='phone-android'
                    size={20}
                    color='#666'
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder={'Mobile Number'}
                    textAlign={'left'}
                    onChangeText={(val) => handleOnChangeNumber(val)}
                    // (val) => handleOnChangeNumber(val)
                    keyboardType={'numeric'}
                />
                {data.checkPhoneNumberTextInputChange ?
                    <Feather
                        name='check-circle'
                        color='green'
                        size={20}

                    />
                    : null}
            </View>
            {data.isValidUserNumber ? null :
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorTextStyle}>Mobile Number must be 10 digit number</Text>
                </Animatable.View>
            }





            {/* Email Id field */}

            <View style={styles.fabArea}>
                <MaterialIcons
                    name='alternate-email'
                    size={20}
                    color='#666'
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder={'Email Id'}
                    textAlign={'left'}
                    onChangeText={(val) => handleOnChangeUserEmailId(val)}
                // (val) => handleOnChangeNumber(val)
                />
                {data.checkUserEmailIdTextInputChange ?
                    <Feather
                        name='check-circle'
                        color='green'
                        size={20}
                    />
                    : null}
            </View>
            {data.isValidUserEmailId ? null :
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorTextStyle}>Enter valid Email Id</Text>
                </Animatable.View>
            }







            <View>
                <TouchableOpacity
                    disabled={!(data.isValidUserEmailIdFlag && data.isValidNumberFlag)}
                    style={styles.buttonStyle}
                    onPress={handleOnPressSubmit}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.textContainer}>
                <Text>Back To</Text>
                <TouchableOpacity style={styles.signUplinkStyle}
                    onPress={() => navigation.navigate('Sign In')}
                >
                    <Text style={styles.linkTextStyle}> Sign In</Text>
                </TouchableOpacity>
            </View>



        </View>
    )

}


//  link color hex valie is : #4d8cbf

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

    signUplinkStyle: {
        alignItems: 'center',
        marginVertical: 10,
        // marginHorizontal: 100,
    },

    forgotLinkStyle: {
        alignItems: 'flex-end',
        marginVertical: 10,
        marginRight: 15
    },

    linkTextStyle: {
        color: '#4d8cbf',      //  4d8cbf
        fontWeight: '500'
    },

    textStyle: {
        marginLeft: 15,
        fontSize: 17,
        fontWeight: 300,
    },

    errorTextStyle: {
        color: '#FF0000',
        fontSize: 14,
        marginHorizontal: 15
    },

    lineStyle: {
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 0.2,
        borderColor: 'grey',
    },

    inputStyle: {
        flex: 1,
        marginHorizontal: 5,
    },


    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    // inputStyle: {
    //     marginHorizontal: 15,
    //     marginVertical: 10,
    //     borderWidth: 0.8,
    //     borderColor: 'black',
    //     paddingHorizontal: 15,
    //     paddingVertical: 10,
    //     borderRadius: 5,
    //     fontSize: 17,
    // },

    mainContainer: {
        marginTop: 20,
        flex: 1,
    },
    iconStyle: {
        width: '100%',
        height: 30,
        aspectRatio: 1,
    },



    fabArea: {
        marginVertical: 10,
        flexDirection: 'row',
        width: '92.5%',
        height: 50,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        // paddingVertical: 10,
        marginRight: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 0.8,
        borderColor: 'black',
    },
})



export default ForgotPassword