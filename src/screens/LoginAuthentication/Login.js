import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


import EmployeeContext from '../../context/Employee/EmployeeContext';


import * as Animatable from 'react-native-animatable'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather';
import { HOST } from '@env';



const Login = ({ navigation }) => {


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
        checkPhoneNumberTextInputChange: false,
        isValidUser: true,
        isValidNumberFlag: false,

        userpassword: '',
        securePasswordTextEntry: true,
        isValidPassword: true,
        isValidPasswordFlag: false,
    })




    const handleOnChangeNumber = (val) => {
        const validFlag = /^\d+$/.test(val)
        if (validFlag && val.length === 10) {
            setData({
                ...data,
                usernumber: val,
                checkPhoneNumberTextInputChange: true,
                isValidUser: true,
                isValidNumberFlag: true
            })
        } else {
            setData({
                ...data,
                usernumber: val,
                checkPhoneNumberTextInputChange: false,
                isValidUser: false,
                isValidNumberFlag: false
            })
        }

    }



    const handleOnChangePassword = (val1) => {
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



    const updateSecurePasswordTextEntry = () => {
        // changed the value to opposite of secureTextEntry
        setData({
            ...data,
            securePasswordTextEntry: !data.securePasswordTextEntry
        })
    }



    const handleOnPressNext = async () => {

        //  API call to retrieve user_id, user_name and user_mobileNumber from database
        //  This api call also used in profile page

        try {


            const response = await fetch(`${HOST}/api/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mobileNumber: data.usernumber, password: data.userpassword })
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
            }
            else {
                Alert.alert('Invalid User!', 'Mobile Number or Password is incorrect', [{ text: 'Okay' }])
                // props.showAlert('Invalid credentials', "danger")
                return
            }
        } catch (error) {
            console.log('Login : ', error.message)
        }
    }




    return (
        <View style={styles.mainContainer}>


            {/* Mobile Number Field */}

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
                    keyboardType={'numeric'}
                />
                {data.checkTextInputChange ?
                    <Feather
                        name='check-circle'
                        color='green'
                        size={20}

                    />
                    : null}
            </View>
            {data.isValidUser ? null :
                <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorTextStyle}>Mobile Number must be 10 digit number</Text>
                </Animatable.View>
            }



            {/* Password Field */}


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
                    autoCapitalize={'none'}
                    secureTextEntry={data.securePasswordTextEntry ? true : false}
                />
                <TouchableOpacity
                    onPress={updateSecurePasswordTextEntry}
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




            <View>
                <TouchableOpacity style={styles.forgotLinkStyle}
                    onPress={() => navigation.navigate('Forgot Password')}
                >
                    <Text style={styles.linkTextStyle}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>



            <View>
                <TouchableOpacity
                    disabled={!(data.isValidPasswordFlag && data.isValidNumberFlag)}
                    style={styles.buttonStyle}
                    onPress={handleOnPressNext}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>



            <View style={styles.textContainer}>
                <Text>New to the app?</Text>
                <TouchableOpacity style={styles.signUplinkStyle}
                    onPress={() => navigation.navigate('Sign Up')}
                >
                    <Text style={styles.linkTextStyle}> Sign Up</Text>
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



export default Login