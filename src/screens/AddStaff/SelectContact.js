import { StyleSheet, View, FlatList, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Contacts from 'expo-contacts'
import { StackActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'



const SelectContact = ({ navigation, route }) => {

    const [contacts, setContacts] = useState([])


    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);


    // UseEffect in the end paranthesis
    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync()
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    // fields: [Contacts.PHONE_NUMBERS],   // depricated
                    fields: [Contacts.Fields.PhoneNumbers],
                })
                if (data.length > 0) {
                    setContacts(data)
                    // const ccc = data[10];
                    // console.log(ccc);
                    setFilteredDataSource(data);
                    setMasterDataSource(data);
                }
            }
        })()
    }, [])



    //  useEffect(() => {
    //     if (route.params?.post) {
    //         // Post updated, do something with `route.params.post`
    //         // For example, send the post to the server
    //         const data = route.params?.post
    //         console.log(data)
    //     }
    // }, []);



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

        return (
            <View>
                <TouchableOpacity
                    // To autofill name and number when contact selected
                    // Method 2: Passing parameter(concatenating name and number) to routes 
                    // onPress={() => {
                    //     //When contact name is saved but no contact number
                    //     // if (staffListFlag === false) {
                    //         if (contact.phoneNumbers !== undefined) {
                    //             navigation.navigate({
                    //                 name: 'AddEmployeeDetails',
                    //                 params: { post: contact.name + '.' + contact.phoneNumbers[0].number },
                    //                 merge: true,
                    //             })
                    //     //     }
                    //     // }else {
                    //     //     navigation.navigate({
                    //     //         name: 'EmployeeDetailsTab',
                    //     //         params: { post: contact.id },
                    //     //         merge: true,
                    //     //     })
                    //     }
                    // }
                    // }

                // To autofill name and number when contact selected
                // Method 1: using useState, useEffect in AddEmployeeDetails and StackActions.replace, StackActions.pop in SelectContact
                onPress={async () => {
                    if(contact.phoneNumbers !== undefined){
                    try {
                        await AsyncStorage.setItem('@contact_name', contact.name)
                        await AsyncStorage.setItem('@contact_phoneNumber', contact.phoneNumbers && contact.phoneNumbers[0] && contact.phoneNumbers[0].number)
                    } catch (e) {
                        // saving error
                        console.log('There was error storing name or number',e)
                    }
                    navigation.dispatch(StackActions.pop(1))
                    // navigation.dispatch(StackActions.replace('AddEmployeeDetails'))
                    navigation.replace('AddEmployeeDetails')
                }        
                }}
                >
                    <View style={styles.contactCon}>
                        <View style={styles.imgCon}>
                            <View style={styles.placeholder}>
                                <Text style={styles.txt}>{contact?.name[0]}</Text>
                            </View>
                        </View>
                        <View style={styles.contactDat}>
                            <Text style={styles.name}>{contact?.name}</Text>
                            <Text style={styles.phoneNumber}>
                                {/* {contact?.phoneNumbers[0]?.number} */}
                                {/* Evaluation of below line */}
                                {contact.phoneNumbers && contact.phoneNumbers[0] && contact.phoneNumbers[0].number}
                                {/* {contact.phoneNumbers[10].number} */}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    const keyExtractor = (item, idx) => {
        return item?.id?.toString() || idx.toString();
    };

    // const renderItem = ({ item, index }) => {
    //     return <ContactCard contact={item} navigation={navigation}  />;
    // };


    return (
        <View style={{ flex: 1 }}>
            <View>
                <TextInput style={styles.inputStyle}
                    placeholder={'Search here..'}
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                />
                {/* <Image
                    style={styles.iconStyle}
                    source={require('../../../assets/icons/search.png')}
                /> */}
            </View>
            <View>
                <FlatList
                    data={filteredDataSource} //contacts
                    renderItem={ContactCard}
                    // renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    style={styles.list}
                />
            </View>
        </View>
    )

}


const styles = StyleSheet.create({

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



    iconStyle: {
        width: '100%',
        height: 30,
        aspectRatio: 1,
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
})



export default SelectContact