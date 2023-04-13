import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


import EmployeeContext from '../../context/Employee/EmployeeContext';


import * as Animatable from 'react-native-animatable'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather';
import { HOST } from '@env';

const SignUp = ({ navigation }) => {


    const { login } = useContext(EmployeeContext)

    //  checkPhoneNumberTextInputChange used to show/hide the check-circle icon at right most
    //  securePasswordTextEntry to open-close the eye icon on password and confirm password field
    //  isValidUserNumber used to show/hide mobile number regex error message
    //  isValidPassword used to show/hide password regex error message
    //  isValidNumberFlag if false then disable submit button
    //  isValidPasswordFlag if false then disable submit button
    //  similar for all other variables

    //  updatePasswordSecureTextEntry() to open-close the eye icon on password and confirm password field


    const [data, setData] = useState({

        usernumber: '',
        isValidUserNumber: true,
        checkPhoneNumberTextInputChange: false,
        isValidNumberFlag: false,

        username: '',
        isValidUserName: true,
        checkUserNameTextInputChange: false,
        isValidUserNameFlag: false,

        usercompanyname: '',
        isValidCompanyName: true,
        checkCompanyNameTextInputChange: false,
        isValidCompanyNameFlag: false,

        useremailid: '',
        isValidUserEmailId: true,
        checkUserEmailIdTextInputChange: false,
        isValidUserEmailIdFlag: false,

        userpassword: '',
        isValidPassword: true,
        securePasswordTextEntry: true,
        isValidPasswordFlag: false,

        userconfirmpassword: '',
        isValidConfirmPassword: true,
        isValidConfirmPasswordFlag: false,
        secureConfirmPasswordTextEntry: true,
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



    const handleOnChangeUserName = (val) => {
        //  regex to check alphabets with spaces
        const validFlag = /^[a-zA-Z ]*$/.test(val)
        if (validFlag && val.length >= 3) {
            setData({
                ...data,
                username: val,
                isValidUserName: true,
                checkUserNameTextInputChange: true,
                isValidUserNameFlag: true,
            })
        } else {
            setData({
                ...data,
                username: val,
                isValidUserName: false,
                checkUserNameTextInputChange: false,
                isValidUserNameFlag: false,
            })
        }

    }


    const handleOnChangeCompanyName = (val) => {
        //  regex to check alphabets with spaces
        const validFlag = /^[a-zA-Z ]*$/.test(val)
        if (validFlag && val.length >= 3) {
            setData({
                ...data,
                usercompanyname: val,
                isValidCompanyName: true,
                checkCompanyNameTextInputChange: true,
                isValidCompanyNameFlag: true,
            })
        } else {
            setData({
                ...data,
                usercompanyname: val,
                isValidCompanyName: false,
                checkCompanyNameTextInputChange: false,
                isValidCompanyNameFlag: false,
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




    const handleOnChangePassword = (val1) => {
        //  regex to check 8-16 characters alphanumeric, one uppercase, one lower case and a special character
        const validFlag = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(val1)
        if (validFlag) {
            setData({
                ...data,
                userpassword: val1,
                isValidPassword: true,
                isValidPasswordFlag: true,
            })
        } else {
            setData({
                ...data,
                userpassword: val1,
                isValidPassword: false,
                isValidPasswordFlag: false,
            })
        }

    }



    const handleOnChangeConfirmPassword = (val1) => {
        //  check if entered password equals confirm password
        if (data.userpassword === val1) {
            setData({
                ...data,
                userconfirmpassword: val1,
                isValidConfirmPassword: true,
                isValidConfirmPasswordFlag: true,
            })
        } else {
            setData({
                ...data,
                userconfirmpassword: val1,
                isValidConfirmPassword: false,
                isValidConfirmPasswordFlag: false,
            })
        }

    }



    const updatePasswordSecureTextEntry = () => {
        // changed the value to opposite of securePasswordTextEntry
        setData({
            ...data,
            securePasswordTextEntry: !data.securePasswordTextEntry
        })
    }



    const updateConfirmPasswordSecureTextEntry = () => {
        // changed the value to opposite of secureConfirmPasswordTextEntry
        setData({
            ...data,
            secureConfirmPasswordTextEntry: !data.secureConfirmPasswordTextEntry
        })
    }








    // Need to call the create user api instead of login api
    const handleOnPressSubmit = async () => {

        //  API call to retrieve user_id, user_name and user_mobileNumber from database
        //  This api call also used in profile page

        try {
            const response = await fetch(`${HOST}/api/auth/createuser/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mobileNumber: data.usernumber, name: data.username, company: data.usercompanyname,
                    emailid: data.useremailid, password: data.userpassword
                })
            });
            const json = await response.json()

            if (json.success) {
                // Store the user details in asyncStorage and call login() to land on home page

                await AsyncStorage.setItem('@login_user_id', json.user_id)
                await AsyncStorage.setItem('@login_user_name', json.user_name)
                await AsyncStorage.setItem('@login_mobileNumber', json.user_mobileNumber)
                await AsyncStorage.setItem('@login_emailid', json.user_emailid)
                await AsyncStorage.setItem('@login_company', json.user_company)
                await AsyncStorage.setItem('@login_userToken', json.token)
                await AsyncStorage.setItem('@login_userRole', json.user_role)

                // const variable = await AsyncStorage.getItem('@login_company')
                // console.log(variable)

                // in above code we added field token because if token present we redirect him to AppStack else AuthStack
                // AppStack are login-screens while AuthStack is not login-screens 
                // added code for login, defined in EmployeeState Context
                login()

            } else {
                Alert.alert('Error!', 'User with this mobile number already Exists', [{ text: 'Okay' }])
                // props.showAlert('Invalid credentials', "danger")
                return
            }

        } catch (error) {
            console.log('signUP :', error.message)
        }
    }







    return (
        <View style={styles.mainContainer}>


            {/* Mobile Number field */}

            <View style={styles.fabArea}>
                <MaterialIcons
                    //  corporate-fare        person-outline      alternate-email        phone-android
                    //  ios-lock-closed-outline    from ionicons
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
                    // value={usernumber}
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




            {/* User Name field */}

            <View style={styles.fabArea}>
                <MaterialIcons
                    name='person-outline'
                    size={20}
                    color='#666'
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder={'User Name'}
                    textAlign={'left'}
                    onChangeText={(val) => handleOnChangeUserName(val)}
                // (val) => handleOnChangeNumber(val)
                />
                {data.checkUserNameTextInputChange ?
                    <Feather
                        name='check-circle'
                        color='green'
                        size={20}
                    />
                    : null}
            </View>
            {data.isValidUserName ? null :
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorTextStyle}>User name must be atleast 3 characters long</Text>
                </Animatable.View>
            }



            {/* Company Name field */}

            <View style={styles.fabArea}>
                <MaterialIcons
                    name='corporate-fare'
                    size={20}
                    color='#666'
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder={'Company Name'}
                    textAlign={'left'}
                    onChangeText={(val) => handleOnChangeCompanyName(val)}
                // (val) => handleOnChangeNumber(val)
                />
                {data.checkCompanyNameTextInputChange ?
                    <Feather
                        name='check-circle'
                        color='green'
                        size={20}
                    />
                    : null}
            </View>
            {data.isValidCompanyName ? null :
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorTextStyle}>Company name must be atleast 3 characters long</Text>
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



            {/* Password field */}

            <View style={styles.fabArea}>
                <Ionicons
                    name='ios-lock-closed-outline'
                    size={20}
                    color='#666'
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder={'Password'}
                    textAlign={'left'}
                    onChangeText={(val1) => handleOnChangePassword(val1)}
                    //  (val1) => handleOnChangePassword(val1)
                    // value={userpassword}
                    autoCapitalize={'none'}
                    secureTextEntry={data.securePasswordTextEntry ? true : false}
                />
                <TouchableOpacity
                    onPress={updatePasswordSecureTextEntry}
                >
                    {data.securePasswordTextEntry ?
                        <Feather
                            name='eye-off'
                            color='grey'
                            size={20}
                        />
                        :
                        <Feather
                            name='eye'
                            color='grey'
                            size={20}
                        />
                    }
                </TouchableOpacity>
            </View>

            {data.isValidPassword ? null :
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorTextStyle}>Password must be 8-16 characters long with one special character,
                        one numerical, one uppercase letter and one lowercase letter</Text>
                </Animatable.View>
            }



            {/* Confirm Password field */}

            <View style={styles.fabArea}>
                <Ionicons
                    name='ios-lock-closed-outline'
                    size={20}
                    color='#666'
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder={'Confirm Password'}
                    textAlign={'left'}
                    onChangeText={(val1) => handleOnChangeConfirmPassword(val1)}
                    //  (val1) => handleOnChangePassword(val1)
                    // value={userpassword}
                    autoCapitalize={'none'}
                    secureTextEntry={data.secureConfirmPasswordTextEntry ? true : false}
                />
                <TouchableOpacity
                    onPress={updateConfirmPasswordSecureTextEntry}
                >
                    {data.secureConfirmPasswordTextEntry ?
                        <Feather
                            name='eye-off'
                            color='grey'
                            size={20}
                        />
                        :
                        <Feather
                            name='eye'
                            color='grey'
                            size={20}

                        />
                    }
                </TouchableOpacity>
            </View>

            {data.isValidConfirmPassword ? null :
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorTextStyle}>Confirm Password does not match Password</Text>
                </Animatable.View>
            }


            {/* Submit Button */}

            <View>
                <TouchableOpacity
                    disabled={!(data.isValidConfirmPasswordFlag && data.isValidPasswordFlag && data.isValidNumberFlag && data.isValidUserNameFlag && data.isValidCompanyNameFlag && data.isValidUserEmailIdFlag)}
                    style={styles.buttonStyle}
                    onPress={handleOnPressSubmit}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>


            {/* Login link */}

            <View style={styles.textContainer}>
                <Text>Already registered?</Text>
                <TouchableOpacity style={styles.signUplinkStyle}
                    onPress={() => navigation.navigate('Sign In')}
                >
                    <Text style={styles.linkTextStyle}> Sign In</Text>
                </TouchableOpacity>
            </View>


            {/* <View style={styles.lineStyle}></View> */}

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



export default SignUp