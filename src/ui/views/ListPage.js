//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, BackAndroid, ListView, } from 'react-native';

//import from app
import { Toolbar, Avatar, Progress, ListItem, Badge, Toast } from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import { resolveRequest } from '../../helpers/InternetHelper.js';
import { APP_INFO, GET_ISSUES, GET_OPPORTUNITY } from '../../constants/AppConstant.js';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR } from '../../constants/AppColor.js'
import { getData, setData } from '../../helpers/AsyncStore.js';
import DatabaseHelper from '../../helpers/DatabaseHelper.js';
import AlertHelper from '../../helpers/AlertHelper.js';
import SocketHelper from '../../helpers/SocketHelper.js';

//socket-io fix
window.navigator.userAgent = "react-native"

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	chatList: PropTypes.array.isRequired,
	communications: PropTypes.array.isRequired,
	currentChat: PropTypes.object.isRequired,
};

const menuItems = [
	'Issues', 'Opportunity', 'Settings'
]


const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
class ChatListPage extends Component {

	constructor(params) {
		super(params);
		this.socket = {};
		this.state = {
			searchText: '',
			isLoading: true,
			dataSource: ds.cloneWithRows([]),
			title: 'Updating...',
			appInfo: null,
		};

		this.onSocketConnectCallback = this.onSocketConnectCallback.bind(this);
		this.onRoomJoinedCallback = this.onRoomJoinedCallback.bind(this);
		this.getIssues = this.getIssues.bind(this);
		this.onReceive = this.onReceive.bind(this);
		this.setStateData = this.setStateData.bind(this);

		this.getBadge = this.getBadge.bind(this);
		this.callback = this.callback.bind(this);
		this.onRightElementPress = this.onRightElementPress.bind(this);
		this.renderListItem = this.renderListItem.bind(this);
		this.renderElement = this.renderElement.bind(this);
	}

	componentWillMount() {
		getData(APP_INFO)
			.then((res) => {
				this.setState({ appInfo: res });
			});
	}

	componentDidMount() {
		this.socket = SocketHelper(this.onMessageReceive,
			this.onSocketConnectCallback,
			this.onRoomJoinedCallback);
	}

	onSocketConnectCallback() {
		getData(APP_INFO)
			.then((res) => {
				this.socket.joinRoom(res.email.toLowerCase().trim())
			})
	}

	onRoomJoinedCallback() {
		// get all issues
		this.getIssues();
	}

	getIssues() {
		const url = GET_ISSUES.format(this.state.appInfo.domain);
		const data = { email: this.state.appInfo.email }
		resolveRequest(url, data)
			.then((res) => {
				console.log(res);
			}).catch((rej) => {
				this.setState({ isLoading: false, title: "Kick" });
			})
	}

	onReceive(message) {
		// list_update logic if doctype if issue or opportunity then fetch again.
		console.log(message);
	}

	setStateData(__list) {
		this.setState({ chatList: __list, dataSource: ds.cloneWithRows(__list), isLoading: false });
	}


	getBadge(count = null) {
		if (count && count > 0) {
			return <Badge text={count.toString()} />
		}
		return null;
	}

	callback(from_page, chat = null) {
		//callback related logic
	}

	renderListItem(item) {
		// const title = getTitle(chat.title);
		// return (
		// 	<ListItem
		// 		divider
		// 		leftElement={<Avatar bgcolor={getTextColor(chat.title)} text={title} />}
		// 		centerElement={{
		// 			primaryElement: {
		// 				primaryText: chat.title,
		// 				icon: this.getBadgeAndIcon(null, chat.info.chat_type)
		// 			},
		// 			secondaryText: chat.sub_title,
		// 		}}

		// 		rightElement={{
		// 			upperElement: this.getLastMessageTime(chat.info.last_message_time),
		// 			lowerElement: this.getBadgeAndIcon(count = chat.info.new_message_count),
		// 		}}

		// 		onPress={() => {
		// 			const page = Page.CHAT_PAGE;
		// 			this.props.navigator.push({
		// 				id: page.id, name: page.name,
		// 				data: {
		// 					chat: chat,
		// 					callback: this.callback,
		// 					appInfo: this.state.appInfo
		// 				}
		// 			})
		// 		}} />
		// );
	}

	onRightElementPress(action) {
		const index = action.index;
		if (index == 2) {
			this.props.navigator.push({
				id: Page.SETTINGS_PAGE.id, name: Page.SETTINGS_PAGE.name,
				data: {
					appInfo: this.state.appInfo,
					callback: this.callback,
				},
			});
		}
	}

	renderElement() {
		if (this.state.isLoading) {
			return (
				<View style={style.progress_ring_centered_view}>
					<Progress />
				</View>)
		}
		return (
			<ListView
				dataSource={this.state.dataSource}
				keyboardShouldPersistTaps='always'
				keyboardDismissMode='interactive'
				enableEmptySections={true}
				ref={'LISTVIEW'}
				renderRow={(item) => this.renderListItem(item)}
			/>
		);
	}

	render() {
		return (
			<View style={style.container_with_flex_1}>
				<Toolbar
					centerElement={this.state.title}
					rightElement={{ menu: { labels: menuItems } }}
					onRightElementPress={(action) => this.onRightElementPress(action)} />
				{this.renderElement()}
			</View>
		)
	}
}

ChatListPage.propTypes = propTypes;
export default ChatListPage;