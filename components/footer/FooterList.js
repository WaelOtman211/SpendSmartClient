
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { AuthContext } from "../../context/auth";
import React, { useContext } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FooterItem from "./FooterItem";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FooterList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [state, setState] = useContext(AuthContext);

    const signOut = async () => {
        setState({ token: "", user: null });
        await AsyncStorage.removeItem("auth-rm");
    };



    return (
        <View style={styles.container}>
            <SafeAreaView>
                <TouchableOpacity onPress={signOut}>
                    <FontAwesome5 name="sign-out-alt" size={35} />
                </TouchableOpacity>
            </SafeAreaView>
            <TouchableOpacity onPress={signOut}>
                    <FontAwesome5 name="bell" size={35} />
                </TouchableOpacity>
            <FooterItem text="Calendar" name="calendar" screenName="CalendarPage" handlePress={() => navigation.navigate("CalendarPage")} routeName={route.name} />
            <FooterItem text="Account" name="user" screenName="Account" handlePress={() => navigation.navigate("Account")} routeName={route.name} />
            <FooterItem text="Home" name="home" screenName="Home" handlePress={() => navigation.navigate("OptionPage")} routeName={route.name} />

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        margin: 10,
        marginHorizontal: 30,
        justifyContent: "space-between"
    }
})

export default FooterList;
