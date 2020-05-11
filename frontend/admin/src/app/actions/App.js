import { store } from 'store';
export const loadingSwitch = (visible) => {
	let data =  {
		type: 'LOAD_SWITCH',
		payload: {
			visible
		}
  };
  store.dispatch(data);
}