//import from system.
import React, { Component } from 'react';
import { Navigator } from 'react-native';
import Fluxify from 'fluxify';
const UIManager = require('UIManager');

//import from app
import { ThemeProvider } from 'react-native-material-component';
import { Page } from './src/enums/Page.js';
import { uiTheme } from './src/constants/AppStyle.js';
import StateHelper from './src/helpers/StateHelper.js';


//pages 
import SplashPage from './src/ui/views/SplashPage.js';
import LoginPage from './src/ui/views/LoginPage.js';
import ListPage from './src/ui/views/ListPage.js';
import ChatPage from './src/ui/views/ChatPage.js';
import SettingsPage from './src/ui/views/SettingsPage.js';
import InfoPage from './src/ui/views/InfoPage.js';


class Kick extends Component {
	constructor(params) {
		super(params);
		this.state = {
			chatList: [],
			communications: [],
			currentChat: null
		}

		this.onChatListChanged = this.onChatListChanged.bind(this);
		this.onCommunicationsChanged = this.onCommunicationsChanged.bind(this);
		this.onCurrentChatChanged = this.onCurrentChatChanged.bind(this);
	}

	componentDidMount() {
		if (UIManager.setLayoutAnimationEnabledExperimental) {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}

		StateHelper.setOnChatListChanged(this.onChatListChanged)
		StateHelper.setOnCommunicationsChanged(this.onCommunicationsChanged);
		StateHelper.setOnCurrentChatChanged(this.onCurrentChatChanged);
	}

	onChatListChanged(list) {
		this.setState({ chatList: list.splice() });
	}

	onCurrentChatChanged(list) {
		this.setState({ communications: list.splice() });
	}

	onCurrentChatChanged(chat) {
		this.setState({ currentChat: chat });
	}

	renderNavigation(route, navigator) {
		const id = route.id;
		Fluxify.doAction('updateCurrentPageId', id);
		if (id == 1)
			return <SplashPage navigator={navigator} route={route} chatList={this.state.chatList} communications={this.state.communications} currentChat={this.state.currentChat} />
		else if (id == 2)
			return <LoginPage navigator={navigator} route={route} chatList={this.state.chatList} communications={this.state.communications} currentChat={this.state.currentChat} />
		else if (id == 3)
			return <ListPage navigator={navigator} route={route} chatList={this.state.chatList} communications={this.state.communications} currentChat={this.state.currentChat} />
		else if (id == 4)
			return <ChatPage navigator={navigator} route={route} chatList={this.state.chatList} communications={this.state.communications} currentChat={this.state.currentChat} />
		else if (id == 5)
			return <SettingsPage navigator={navigator} route={route} chatList={this.state.chatList} communications={this.state.communications} currentChat={this.state.currentChat} />
	}

	render() {
		return (
			<ThemeProvider uiTheme={uiTheme}>
				<Navigator initialRoute={{ id: 1, name: 'Splash' }}
					renderScene={this.renderNavigation.bind(this)}
					configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottomAndroid} />
			</ThemeProvider>
		);
	}
}

export default Kick;