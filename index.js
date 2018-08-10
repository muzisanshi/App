/** @format */

import {AppRegistry} from 'react-native';
import App from './App';

import {name as appName} from './app.json';

import {createStackNavigator} from 'react-navigation';

const navigator = createStackNavigator({
	Home:{
		screen:App,
		navigationOptions:{
			header:null
		}
	},
	initialRouteName:"Home"
});


AppRegistry.registerComponent(appName, () => navigator);
