import React, {Component} from 'react';

import Maps from './components/Maps';
import RightBar from './components/RightBar';
import TopBar from './components/TopBar';

export default function App() {
	return (<>
		<div><TopBar /></div>
		<div style={{display: 'flex'}}>
			<Maps />
			<RightBar />
		</div>
	</>);
}
