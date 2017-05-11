//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ListView } from 'react-native';
var format = require('string-format')

//import from app
import { Toolbar, Avatar, Progress, ListItem, Badge, Toast } from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import { resolveRequest } from '../../helpers/InternetHelper.js';
import { APP_INFO, GET_ISSUES, GET_OPPORTUNITY } from '../../constants/AppConstant.js';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR } from '../../constants/AppColor.js'
import { getData, setData } from '../../helpers/AsyncStore.js';
import { getTextColor, getTitle, getAvatarText, getSubtitle } from '../../helpers/CollectionHelper.js';
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

class ListPage extends Component {
	constructor(params) {
		super(params);
		this.socket = {};
		this.state = {
			searchText: '',
			isLoading: true,
			chatList: [],
			dataSource: ds.cloneWithRows([]),
			title: 'Updating...',
			appInfo: null,
			roomJoined: false,

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

	componentDidMount() {
		this.socket = SocketHelper(this.onReceive,
			this.onSocketConnectCallback,
			this.onRoomJoinedCallback);
	}

	onSocketConnectCallback() {
		this.setState({ isLoading: false });
		getData(APP_INFO)
			.then((res) => {
				res = JSON.parse(res);
				this.socket.joinRoom(res.email.toLowerCase().trim())
			});
	}

	onRoomJoinedCallback() {
		this.setStateData({ roomJoined: true });
		this.loadData();
	}

	onReceive(message) {
		//notify on new issue or opportunity
		console.log(message);
	}

	setStateData(__list) {
		this.setState({
			chatList: __list,
			dataSource: ds.cloneWithRows(__list),
			isLoading: false
		});
	}

	loadData() {
		const url = format(GET_ISSUES, this.state.appInfo.domain);
		const data = { "email": this.state.appInfo.email }
		resolveRequest(url, data)
			.then((res) => {
				if (res && res.message && res.message.length > 0) {
					this.setState({ title: "Kick" });
					this.setStateData(res.message);
				} else {
					this.setState({ isLoading: false, title: "Kick" });
				}
			}).catch((rej) => {
				console.log(rej);
				this.setState({ isLoading: false, title: "Kick" });
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
								callback: this.callback,
								appInfo: this.state.appInfo
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
			this.setState({ isOpportunity: false });
		} else if (index == 1) {
			this.setState({ isOpportunity: true });
		}
		else if (index == 2) {
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

ListPage.propTypes = propTypes;
export default ListPage;