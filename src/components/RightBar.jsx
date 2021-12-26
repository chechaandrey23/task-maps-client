import React, {Component, useState} from 'react';
import {Button, Row, Col, Card} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';

import useWindowDimensions from '../helpers/useWindowDimensions';

import ViewMarker from './ViewMarker';

export default function RightBar() {
	const {height} = useWindowDimensions();

	const width = 250;

	const units = useSelector(state => state.units.units);
	const unitsLoading = useSelector(state => state.units.unitsLoading);

	const [viewMarker, setViewMarker] = useState(null);

	return (<>
		<Scrollbars style={{width, height}}>
			{units.length === 0?<div><h2>Not Found</h2></div>:null}
			{unitsLoading?<div><h2>Loading...</h2></div>:null}
			{units.map((entry) => {
				return <Card style={{width: width}}>
					<Card.Img variant="top" src={'/images/'+entry.image} />
					<Card.Body>
						<Card.Title>{entry.title}</Card.Title>
						<Card.Text>{entry.title}</Card.Text>
						<Button variant="primary" onClick={() => {
							setViewMarker(entry);
						}}>View</Button>
					</Card.Body>
				</Card>
			})}
		</Scrollbars>
		{viewMarker?<ViewMarker onHide={() => {setViewMarker(null)}} markerEntry={viewMarker} />:null}
	</>);
}
