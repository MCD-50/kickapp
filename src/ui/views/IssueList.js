//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ListView } from 'react-native';
var format = require('string-format')

//import from app
import { Toolbar, Avatar, Progress, ListItem, Badge, Toast } from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import { resolveRequest } from '../../helpers/InternetHelper.js';
import { APP_INFO, GET_ISSUES } from '../../constants/AppConstant.js';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR } from '../../constants/AppColor.js'
import { getData, setData } from '../../helpers/AsyncStore.js';
import { getTextColor, getTitle, getAvatarText, getSubtitle, loadAsync } from '../../helpers/CollectionHelper.js';
import Empty from '../components/Empty.js';
import AlertHelper from '../../helpers/AlertHelper.js';
import SocketHelper from '../../helpers/SocketHelper.js';
import Fluxify from 'fluxify';

//socket-io fix
window.navigator.userAgent = "react-native"

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	chatList: PropTypes.array.isRequired,
	communications: PropTypes.array.isRequired,
	currentChat: PropTypes.object.isRequired,
};

const menuItems = ['Opportunity', 'Settings'];

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });

class IssueList extends Component {
	constructor(params) {
		super(params);
		this.socket = {};
		this.state = {
			progress: true,
			dataSource: ds.cloneWithRows([]),
			appInfo: null,
		};

		this.onSocketConnectCallback = this.onSocketConnectCallback.bind(this);
		this.onRoomJoinedCallback = this.onRoomJoinedCallback.bind(this);
		this.loadData = this.loadData.bind(this);
		this.onReceive = this.onReceive.bind(this);
		this.setStateData = this.setStateData.bind(this);

		this.callback = this.callback.bind(this);
		this.onRightElementPress = this.onRightElementPress.bind(this);
		this.renderElement = this.renderElement.bind(this);
		this.renderListItem = this.renderListItem.bind(this);
	}

	componentWillMount() {
		getData(APP_INFO)
			.then((res) => {
				const obj = Object.assign({}, JSON.parse(res));
				this.setState({ appInfo: obj });
			});
	}

	shouldComponentUpdate(nextProps, nextState) {
		const chatList = nextProps.chatList.filter((x) => x.naming_series.includes('ISS')).slice() || []
		if (nextProps !== this.props) {
			setTimeout(() => this.setStateData(chatList), 1000);
		}
		return nextState != this.state;
	}

	componentDidMount() {
		this.socket = SocketHelper(this.onReceive, this.onSocketConnectCallback, this.onRoomJoinedCallback);
		setTimeout(() => this.setState({ progress: false }), 10000);
	}

	onSocketConnectCallback() {
		getData(APP_INFO)
			.then((res) => {
				res = JSON.parse(res);
				this.socket.joinRoom("kickapp@list_update:all")
			});
	}

	onRoomJoinedCallback() {
		this.loadData();
	}

	onReceive(message) {
		//check doctype and then update props of them accordingly.
		console.log(message);
	}

	setStateData(__list) {
		this.setState({
			dataSource: ds.cloneWithRows(__list),
			progress: false
		});
	}

	loadData() {
		const url = format(GET_ISSUES, this.state.appInfo.domain);
		const data = { "email": this.state.appInfo.email }
		loadAsync(url, data)
			.then((res) => {
				if (res) {
					const chatList = this.props.chatList.filter((x) => x.naming_series.includes('OPTY')).slice() || []
					Fluxify.doAction('updateChatList', chatList.concat(res));
				} else {
					this.setState({ progress: false });
				}
			}).catch((rej) => {
				this.setState({ progress: false });
			})
	}

	callback(from_page, chat = null) {
		//callback related logic
	}

	renderListItem(item) {
		if (typeof item == 'object') {
			const title = getTitle(item, "subject", "raised_by");
			return (
				<ListItem
					divider
					leftElement={<Avatar bgcolor={getTextColor(title)} text={getAvatarText(item, "subject", "raised_by")} />}
					centerElement={{
						primaryElement: {
							primaryText: title,
						},
						secondaryText: getSubtitle(item, "description"),
					}}
					onPress={() => {
						const page = Page.CHAT_PAGE;
						this.props.navigator.push({
							id: page.id, name: page.name,
							data: {
								item: item,
								doctype: 'Issue',
								callback: this.callback,
								appInfo: this.state.appInfo,
							}
						})
					}} />
			);
		}
		return null;
	}

	onRightElementPress(action) {
		const index = action.index;
		if (index == 0) {
			this.props.navigator.push({
				id: Page.OPPORTUNITY_LIST.id, name: Page.OPPORTUNITY_LIST.name,
				data: {
					appInfo: this.state.appInfo,
					callback: this.callback,
				},
			});
		}
		else if (index == 1) {
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
		if (this.state.progress) {
			return (
				<View style={[style.align_center_justify_center, style.container_with_flex_1]}>
					<Progress />
				</View>)
		} else if (!this.state.progress && this.state.dataSource._cachedRowCount > 0) {
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
		} else {
			return (
				<View style={[style.container_with_flex_1, style.align_center_justify_center]}>
					<Empty message={"It's empty in here, try again in little bit."} />
				</View>
			)
		}
	}

	render() {
		return (
			<View style={style.container_with_flex_1}>
				<Toolbar
					centerElement={this.props.route.name}
					rightElement={{ menu: { labels: menuItems } }}
					onRightElementPress={(action) => this.onRightElementPress(action)} />
				{this.renderElement()}
			</View>
		)
	}
}

IssueList.propTypes = propTypes;
export default IssueList;