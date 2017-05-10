//import from app
import StateClient from './StateClient.js';

class StateHelper {
	constructor() {
		this.stateChangeCallbacks = {
			chatListCallback: [],
			communicationsCallback: [],
			currentChatCallback: []
		}
		StateClient.on('change:chatList', (chatList) => {
			this.onChatListChanged(chatList);
		});
		StateClient.on('change:communications', (communications) => {
			this.onCommunicationsChanged(communications);
		});
		StateClient.on('change:currentChat', (currentChat) => {
			this.onCurrentChatChanged(currentChat);
		});
	}

	onChatListChanged = (chatList) => {
		let callbacks = this.stateChangeCallbacks.chatListCallback;
		callbacks.forEach(callback => callback(chatList));
	}

	onCommunicationsChanged = (communications) => {
		let callbacks = this.stateChangeCallbacks.communicationsCallback;
		callbacks.forEach(callback => callback(communications));
	}

	onCurrentChatChanged = (currentChat) => {
		let callbacks = this.stateChangeCallbacks.currentChatCallback;
		callbacks.forEach(callback => callback(currentChat));
	}

	setOnChatListChanged = (callback) => {
		this.stateChangeCallbacks.chatListCallback.push(callback)
	}

	setOnCommunicationsChanged = (callback) => {
		this.stateChangeCallbacks.communicationsCallback.push(callback)
	}

	setOnCurrentChatChanged = (callback) => {
		this.stateChangeCallbacks.currentChatCallback.push(callback)
	}

	removeChatListChanged = () => {
		this.stateChangeCallbacks.chatListCallback.pop();
	}

	removeCommunicationsChanged = () => {
		this.stateChangeCallbacks.communicationsCallback.pop();
	}

	removeCurrentChatChanged = () => {
		this.stateChangeCallbacks.currentChatCallback.pop();
	}

}

const stateHelper = new StateHelper();
export default stateHelper;
