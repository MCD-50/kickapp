//import from system
import Fluxify from 'fluxify';

const StateClient = Fluxify.createStore({
	id: 'StateClient',
	initialState: {
		appData: null,
		currentPageId: null,
		currentChat : null,
		chatList: [],
		communications: [],

	},

	actionCallbacks: {
		updateAppData: (updater, appData) => {
			const obj = Object.assign({}, appData);
			updater.set({ appData: obj });
		},
		updateCurrentPageId: (updater, currentPageId) => {
			updater.set({ currentPageId: currentPageId })
		},
		updateCurrentChat: (updater, currentChat) => {
			const obj = Object.assign({}, currentChat);
			updater.set({ currentChat: obj });
		},
		updateChatList: (updater, chatList) => {
			const list = chatList.slice();
			updater.set({ chatList: list });
		},
		updateCommunications: (updater, communications) => {
			const list = communications.slice();
			updater.set({  communications: list });
		},
		removeData: (updater) => {
			updater.set({
				currentChat: null,
				communications: []
			});
		}
	}
});

export default StateClient;