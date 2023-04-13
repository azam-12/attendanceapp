import EmployeeContext from "./EmployeeContext"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOST } from '@env';


const EmployeeState = (props) => {


  const [empList, setEmpList] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)

  const [userRole, setUserRole] = useState(null)


  const [userCompany, setUserCompany] = useState(null)


  const login = async () => {

    setIsLoading(true)
    const userToken = await AsyncStorage.getItem('@login_userToken')
    setUserToken(userToken)

    const userCompany = await AsyncStorage.getItem('@login_company')
    setUserCompany(userCompany)

    const userRole = await AsyncStorage.getItem('@login_userRole')
    setUserRole(userRole)

    setIsLoading(false)

  }


  const logout = async () => {
    setIsLoading(true)
    setUserToken(null)
    await AsyncStorage.removeItem('@login_userToken')

    setUserCompany(null)
    await AsyncStorage.removeItem('@login_company')

    setUserRole(null)
    await AsyncStorage.removeItem('@login_userRole')
    setIsLoading(false)

  }



  const isLoggedIn = async () => {
    try {
      setIsLoading(true)
      let userToken = await AsyncStorage.getItem('@login_userToken')
      setUserToken(userToken)

      let userCompany = await AsyncStorage.getItem('@login_company')
      setUserCompany(userCompany)

      let userRole = await AsyncStorage.getItem('@login_userRole')
      setUserRole(userRole)

      setIsLoading(false)
    } catch (error) {
      console.log(`Error in isLoggedIn: ${error}`)
    }

  }


  useEffect(() => {
    (async () => {
      isLoggedIn()
      const company = await AsyncStorage.getItem('@login_company')
      setUserCompany(company)
    })()
  }, [])


  // Get All Employees 
  const getEmployees = async () => {

    // we want to fetch the staff of logged in admin's company only so we send the company to api for search criteria 

    //  API call
    try {


      const response = await fetch(`${HOST}/api/emp/fetchallemployees/${userCompany}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': userToken
        }
      })
      const json = await response.json();
      setEmpList(json)
    } catch (error) {
      console.log('EmployeeState : ', error.message)
    }
  }



  // Get PunchIn status 
  // const getPunchInStatus = async () => {
  //  API call
  // const response = await fetch(`${HOST}/api/emp/location/fetchpunchinstatus`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  // const json = await response.json();
  // setEmpList(json)
  // }









  // Add an Employee
  //   const addEmployees = async (name, mobileNumber) => {
  //     //  API call
  //     const response = await fetch(`${host}/api/emp/addemployee`, {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({name, mobileNumber})
  //     })
  //     const json = await response.json();        
  //     setEmpList(json)
  // }




  return (
    <EmployeeContext.Provider value={{ getEmployees, empList, isLoading, userToken, userRole, login, logout }}>
      {props.children}
    </EmployeeContext.Provider>
  )

}

export default EmployeeState

