//import from system
import React, { Component, PropTypes } from 'react';
import { View, BackAndroid } from 'react-native';
var format = require('string-format')


//import from app
import { Toolbar, Progress } from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import { APP_INFO, GET_COMMUNICATION, SEND_MESSAGE } from '../../constants/AppConstant.js';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR } from '../../constants/AppColor.js'
import { loadAsync, convertToAirchatObject, createIssueChatAlert } from '../../helpers/CollectionHelper.js';
import { AirChatUI } from '../customUI/airchat/AirChatUI.js';
import AlertHelper from '../../helpers/AlertHelper.js';
import Send from '../components/Send.js';
import Fluxify from 'fluxify';

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	chatList: PropTypes.array.isRequired,
	communications: PropTypes.array.isRequired,
	currentChat: PropTypes.object.isRequired,
};


const menuItems = ['View Info'];

class ChatPage extends Component {
	constructor(params) {
		super(params);
		const item = this.props.route.data.item;
		Fluxify.doAction('currentChat', item);

		this.state = {
			item: item,
			progress: true,
			messages: [],
			appInfo: this.props.route.data.appInfo,
		};

		this.addBackEvent = this.addBackEvent.bind(this);
		this.removeBackEvent = this.removeBackEvent.bind(this);
		this.popPage = this.popPage.bind(this);
		this.loadData = this.loadData.bind(this);
		this.setStateData = this.setStateData.bind(this);
		this.renderSend = this.renderSend.bind(this);
		this.onSend = this.onSend.bind(this);
		this.onRespond = this.onRespond.bind(this);
		this.callback = this.callback.bind(this);
		this.onRightElementPress = this.onRightElementPress.bind(this);
	}

	componentWillMount() {
		this.addBackEvent();
	}

	componentWillUnmount() {
		this.removeBackEvent();
	}

	addBackEvent() {
		BackAndroid.addEventListener('hardwareBackPress', () => {
			this.popPage();
		});
	}

	removeBackEvent() {
		BackAndroid.removeEventListener('hardwareBackPress', () => {
			this.popPage();
		});
	}

	popPage() {
		if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
			if (this.props.route.data.callback)
				this.props.route.data.callback(Page.CHAT_PAGE);
			this.props.navigator.pop();
			return true;
		}
		return false;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps !== this.props) {
			const communications = convertToAirchatObject(nextProps.communications.slice()) || [];
			const with_alert = communications.concat(createIssueChatAlert(this.state.item));
			if (this.props.route.data.doctype == "Issue") {
				setTimeout(() => this.setStateData(with_alert), 1000);
			} else {
				setTimeout(() => this.setStateData(communications), 1000);
			}
		}
		return nextState != this.state;
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {
		const url = format(GET_COMMUNICATION, this.state.appInfo.domain);
		let data = {
			doctype: this.props.route.data.doctype,
			name: this.state.item.name,
			limit_start: 0,
			after: null
		};
		loadAsync(url, data)
			.then((res) => {
				if (res) {
					Fluxify.doAction('updateCommunications', res);
				} else {
					this.setState({ progress: false });
				}
			}).catch((rej) => {
				this.setState({ progress: false });
		});
	}

	setStateData(__list) {
		this.setState({ messages: __list, progress: false });
	}

	callback(from_page) {
		//callback related logic
	}

	onSend(messages = []) {
		console.log(messages);
	}

	onRespond(message) {
		console.log(message);
	}

	renderSend(props) {
		return (<Send {...props } />);
	}

	onRightElementPress(action) {
		const index = action.index;
		if (index == 0) {
			this.props.navigator.push({
				id: Page.INFO_PAGE.id, name: Page.INFO_PAGE.name,
				data: {
					item: this.state.item,
					appInfo: this.state.appInfo,
					callback: this.callback,
				},
			});
		}
	}

	render() {
		return (
			<View style={style.container_with_flex_1}>
				<Toolbar
					leftElement="arrow-back"
					onLeftElementPress={() => this.popPage()}
					centerElement={{
						upperText: this.props.route.data.doctype == "Issue" ? this.state.item.raised_by :
							(this.state.item.contact_display ? this.state.item.contact_display : this.state.item.contact_email || this.state.item.name),
						lowerText: this.state.item.name
					}}
					rightElement={{ menu: { labels: menuItems } }}
					onRightElementPress={(action) => this.onRightElementPress(action)} />

				<AirChatUI
					messages={this.state.messages}
					onSend={this.onSend}
					user={{
						_id: this.state.appInfo.email,
						name: this.state.appInfo.user_name,
					}}
					keyboardDismissMode='interactive'
					enableEmptySections={true}
					renderSend={this.renderSend} />
			</View>
		)
	}
}

ChatPage.propTypes = propTypes;
export default ChatPage;

