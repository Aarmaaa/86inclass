import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "../navigation/DrawerNavigator";

export default function DashBoard() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
