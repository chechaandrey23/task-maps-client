import React, {Component} from 'react';

import Maps from './components/Maps';
import RightBar from './components/RightBar';

export default function App() {
	return (<div style={{display: 'flex'}}>
		<Maps />
		<RightBar />
	</div>);
}
