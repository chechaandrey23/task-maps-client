import { call, takeEvery, put, all, spawn, take, cancel } from 'redux-saga/effects';

import {unitsSagas} from './units.js';

// takeLatest
// takeLatest
export default function* rootSaga() {
	//yield fork(socketFetchSaga);
	const sagas = [
		...unitsSagas,
	];
	
	yield all(sagas.map((o) => {
		return spawn(function *() {
			while(true) {
				try {
					if(o.pattern) {
						let lastTask
						while(true) {
							const action = yield take(o.pattern);
							// cancel is no-op if the task has already terminated
							if(lastTask) yield cancel(lastTask);
							//lastTask = yield fork(saga, ...args.concat(action));
							lastTask = yield call(o.saga, action);
						}
					} else {
						yield call(o);
					}
					break;
				} catch(e) {
					// error
					//console.error(e);
					throw e;
				}
			}
		});
	}));
}
