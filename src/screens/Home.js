import { StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList, RefreshControl, Alert } from 'react-native'
import React from 'react';
import Menu from '../components/Menu';
import EmployeeContext from '../context/Employee/EmployeeContext';
import { useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'


const Home = ({ navigation }) => {

  //EmployeeContext is UseContext, getEmployees is method and empList is the staff list retrieved using getEmployees method 
  const context = useContext(EmployeeContext)
  const { getEmployees, empList } = context



  //SearchFilterFunction uses masterDataSource and filteredDataSource as entire list and filtered list respectively
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);


  // To set the company name as the admin's company name, filled up storage during login.  
  const [companyName, setCompanyName] = useState()

  useEffect(() => {
    (async () => {
      const company = await AsyncStorage.getItem('@login_company')
      setCompanyName(company)
    })()
  }, [])



  // To get all the staff list once component is loaded and send it to masterDataSource
  //SearchFilterFunction uses masterDataSource and filteredDataSource as entire list and filtered list respectively
  useEffect(() => {
    getEmployees()
  }, [])


  //Due to asynchronous nature of fetcallemployees in getemployees the component is loaded later empList is populated so in getemployees useeffect does not work as expected so we need below useEffect to initialise these two useStates
  useEffect(() => {
    setFilteredDataSource(empList)
    setMasterDataSource(empList)
  }, [empList])


  //setSearch is used to set the text typed in searchbox
  const [search, setSearch] = useState('');



  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };




  const ContactCard = ({ item }) => {

    const contact = item
    // console.log(item)

    return (
      <View>
        <TouchableOpacity
          // To autofill name and number when contact selected
          // Method 2: Passing parameter(concatenating name and number) to routes 
          // onPress={ ()=> {
          //     //When contact name is saved but no contact number
          //     if(contact.phoneNumbers !== undefined){
          //     navigation.navigate({
          //         name: 'AddEmployeeDetails',
          //         params: {post: contact.name + '.' + contact.phoneNumbers[0].number },
          //         merge: true,
          //     })}
          // }
          // }

          // To autofill name and number when contact selected
          // Method 1: using useState, useEffect in AddEmployeeDetails and navigation.replace in SelectContact
          // onPress={async () => {
          //     try {
          //         await AsyncStorage.setItem('@storage_Key', contact.name)
          //     } catch (e) {
          //         // saving error
          //     }empList
          //     navigation.replace('AddEmployeeDetails')
          // }}
          onPress={() => navigation.navigate('EmployeeDetailsTab', { pressedStaffNumber: item.mobileNumber })}
        >
          <View style={styles.contactCon}>
            <View style={styles.imgCon}>
              <View style={styles.placeholder}>
                <Text style={styles.txt}>{item?.name[0]}</Text>
              </View>
            </View>
            <View style={styles.contactDat}>
              <Text style={styles.name}>{item?.name}</Text>
              <Text style={styles.phoneNumber}>
                {/* {contact?.phoneNumbers[0]?.number} */}
                {/* Evaluation of below line */}
                {item.mobileNumber}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }










  return (
    <View style={styles.mainContainer}>

      <View style={styles.headerContainer}>
        <Text style={styles.headerContainerText}>{companyName}</Text>
      </View>

      <View style={styles.newContainer}>
        <View style={styles.firstContainer}>
          <Text style={styles.firstContainerText}>Manage Attendance</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonText}>Start free trial</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lineStyleOne}></View>

      <View style={styles.referContainer}>
        <Text style={styles.referContainerText}>Refer a business!</Text>
      </View>

      <View style={styles.lineStyleOne}></View>

      <View>
        <TextInput
          style={styles.inputStyle}
          placeholder={'Search employee'}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          textAlign={'left'}
        />
        <View>
          <FlatList
            style={styles.flatlist}
            keyExtractor={(item) => item._id}
            data={filteredDataSource}
            renderItem={ContactCard}

          >
          </FlatList>
        </View>
      </View>


      <TouchableOpacity
        onPress={() => navigation.navigate('AddEmployeeDetails')}
        style={styles.fab}
      >
        <Text style={styles.fabIcon}>+ Add Staff</Text>
      </TouchableOpacity>

      {/* onPress={() => {}} */}

      <View>
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

  mainContainer: {
    flex: 1,
  },

  flatlist: {
    width: '100%',
    height: 250,
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },

  headerContainer: {
    // marginTop: 5,
    height: 30,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerContainerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500'
  },

  newContainer: {
    // backgroundColor: 'coral',
    backgroundColor: '#f7f8f7',
  },

  firstContainer: {
    marginTop: 10,
    backgroundColor: 'black',
    height: 120,
    marginHorizontal: 10,
    borderRadius: 5,
  },

  referContainer: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#d8e7f5',
    height: 100,
    marginHorizontal: 10,
    borderRadius: 5,
  },

  referContainerText: {
    marginLeft: 5,
    marginTop: 5,
    fontWeight: '400'
  },

  inputStyle: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 0.8,
    borderColor: '#c2c4c3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    // fontFamily: 'regular',
    fontSize: 18,
  },

  lineStyleOne: {
    marginTop: 20,
    marginBottom: 20,
    // borderWidth: 1,
    backgroundColor: '#dadddb',
    height: 5,
    // borderRadius: 5,
  },


  firstContainerText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 5,
  },

  buttonContainer: {
    display: 'flex',
    marginVertical: 10,
    marginHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },

  buttonStyle: {
    marginVertical: 10,
    marginHorizontal: 10,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#00ff9f',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontWeight: '400'
  },


  lineStyle: {
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  fab: {
    position: 'absolute',
    width: 156,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 12,
    bottom: 65,
    backgroundColor: '#00ff9f',
    borderRadius: 30,
    elevation: 2,
    zIndex: 1,// set zindex to 1 means it will not show underneath contents if 0 then it shows
  },
  fabIcon: {
    fontSize: 20,
    color: 'black'
  },


  //StyleSheet for ContactCard
  contactCon: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d9d9d9",
  },
  imgCon: {},
  placeholder: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5
  },
  txt: {
    fontSize: 18,
  },
  name: {
    fontSize: 16,
  },
  contactDat: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
  },
  phoneNumber: {
    color: "#888",
  },



})

export default Home

