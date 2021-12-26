// uniq name, fn
export function createSagas(o) {
	o = o || {};
	const actions = {};
	const sagas = [];
	Object.keys(o).map((key) => {
		if(typeof o[key] === 'function') {
			//sagas.push([key, o[key]]);
			sagas.push({pattern: key + '', saga: o[key]});
			actions[key] = ((constName) => {
				return (data) => ({type: constName, payload: data});
			})(key);
		}
	});

	return new SagaCreators(sagas, actions);
}

export class SagaCreators {
	#sagas = [];
	#actions = {};
	constructor(sagas, actions) {
		this.#sagas = sagas;
		this.#actions = actions;
	}
	get sagas() {
		return this.#sagas;
	}
	get actions() {
		return this.#actions;
	}
}
