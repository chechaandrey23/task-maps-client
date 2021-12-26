import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas} from './helpers/helper.saga.js';

import {getUnits, startLoadUnits, endLoadUnits,
		newUnit, startLoadNewUnit, endLoadNewUnit, errorNewUnit} from "../units.js";

const unitSagas = createSagas({
	sagaGetUnits: function* ({payload = {}}) {
		//o = o || {};
		//const payload = o.payload || {};
		yield put(startLoadUnits());
		const res = yield call(request, {
			method: 'get',
			url: `/guest/api/units`,
			params: payload,
			...defaultRequestSettings
		});
		yield put(getUnits(res.data));
		yield put(endLoadUnits());
	},
	sagaNewUnit: function* ({payload = {}}) {
		//o = o || {};
		//const payload = o.payload || {};
		try {
			yield put(startLoadNewUnit());
			const res = yield call(request, {
				method: 'post',
				url: `/guest/api/unit/add`,
				data: payload,
				...defaultRequestSettings
			});
			yield put(newUnit(res.data));
		} catch(e) {
			yield put(errorNewUnit(e));
		} finally {
			yield put(endLoadNewUnit());
		}
	}
});

export const unitsSagas = unitSagas.sagas;

export const {sagaGetUnits, sagaNewUnit} = unitSagas.actions;
