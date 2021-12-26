import {createSlice} from '@reduxjs/toolkit'

export const storeUnits = createSlice({
	name: 'units',
	initialState: {
		units: [],
		unitsLoading: false,

		newUnit: null,
		newUnitLoading: false,
		newUnitError: false
	},
	reducers: {
		getUnits(state, action) {
			state.units = action.payload || [];
		},
		startLoadUnits(state, action) {
			state.unitsLoading = true;
		},
		endLoadUnits(state, action) {
			state.unitsLoading = false;
		},

		newUnit(state, action) {
			state.newUnit = action.payload;
			state.units = [state.newUnit, ...state.units];
		},
		startLoadNewUnit(state, action) {
			state.newUnitLoading = true;
			state.newUnit = null;
		},
		endLoadNewUnit(state, action) {
			state.newUnitLoading = false;
		},
		errorNewUnit(state, action) {
			state.newUnitError = action.payload;
		}
	}
});

export const {  getUnits, startLoadUnits, endLoadUnits,
				newUnit, startLoadNewUnit, endLoadNewUnit, errorNewUnit} = storeUnits.actions;

export default storeUnits.reducer;
