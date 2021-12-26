import React, {useState, useCallback, useEffect, useRef, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Button, Row, Col, Modal, Alert, Form, Spinner, Card} from 'react-bootstrap';

export default function ViewMarker(props) {

	return (<>
		<Modal show={true} onHide={() => {
			props.onHide.call();
		}} animation={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Full Info for Marker</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col>
						<Card style={{width: '100%'}}>
							<Card.Img variant="top" src={'/images/'+props.markerEntry.image} />
							<Card.Body>
								<Card.Title>{props.markerEntry.title}</Card.Title>
								<Card.Text>{props.markerEntry.title}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer className="justify-content-center">
				<Button variant="secondary" onClick={() => {
					props.onHide.call();
				}} >Close</Button>
			</Modal.Footer>
		</Modal>
	</>)
}
