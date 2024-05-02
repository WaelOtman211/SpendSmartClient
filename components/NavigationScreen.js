import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native"; // Import Text and View from react-native
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import GoalManagement from "../screens/GoalManagement";
import { AuthContext } from "../context/auth";
import HeaderTabs from "./header/HeaderTabs.js";
import Account from "../screens/Account";
import SavingsPage from "../screens/SavingsPage";
import LoanDetails from "../screens/LoanDetails";
import OptionPage from "../screens/OptionPage";
import InvestmentPage from "../screens/InvestmentPage";
import ExpensesInsert from "../screens/ExpensesInsert";
import IncomesInsert from "../screens/IncomesInsert";
import ExpensesDetailsPage from "../screens/ExpensesDetailsPage.js";
import IncomesDetailsPage from "../screens/IncomesDetailsPage.js";
import ExpensesCircularGraph from "../screens/ExpensesCircularGraph.js";
import GoalsInsertPage from "../screens/GoalsInsertPage.js";
import CalendarComponent from "../screens/CalendarPage.js";
import ViewGoalDetails from "../screens/ViewGoalDetails.js";
import IncomesCircularGraph from "../screens/IncomesCircularGraph.js";


const Stack = createNativeStackNavigator();

const CustomHeaderTitle = () => (
  <View style={{ flexDirection: "row", alignItems:"center" }}>
    <Text style={{ color: "#67C28D", fontSize: 30,fontWeight: "bold" }}>Spend</Text>
    <Text style={{ color: "#8FE388", fontSize: 40, fontWeight: "bold" }}>Smart</Text>
  </View>
);

const screens = {
  
  OptionPage,
  InvestmentPage,
  GoalManagement,
  ExpensesDetailsPage,
  IncomesDetailsPage,
  ExpensesCircularGraph,
  IncomesCircularGraph,
  GoalsInsertPage,
  LoanDetails,
  SavingsPage,
  CalendarPage: CalendarComponent,
  IncomesInsert,
  Account,
  HeaderTabs,
  ExpensesInsert,
  ViewGoalDetails,
 
};

const NavigationScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const authenticated = state && state.token !== "" && state.user !== null;

  const initialRouteName = authenticated ? "OptionPage" : "SignIn";

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {authenticated ? (
        Object.entries(screens).map(([name, component]) => (
          <Stack.Screen
            key={name}
            name={name}
            component={component}
            options={{
              headerTitle: CustomHeaderTitle,
              headerRight: () => <HeaderTabs />,
            }}
          />
        ))
      ) : (
        <>
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default NavigationScreen;
