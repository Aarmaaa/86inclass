import * as React from "react";
import * as firebase from 'firebase';
import {View,Text} from 'react-native';

export default class LoadingScreen extends React.Component{

    checkIfLoggedin = () => {
        firebase.auth().onAuthStateChanged((user) =>{
            if(user){
                this.props.navigation.navigate("Dashboard")
            } else {
                this.props.navigation.navigate("Login")
            }
        })
    }

    componentDidMount(){
        this.checkIfLoggedin()
    }

    render(){
        return (
            <View style = {{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text>Loading...</Text>
            </View>
        )
    }
}