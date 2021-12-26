import React, {useState, useCallback, useEffect, useRef, useLayoutEffect} from 'react'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import {useSelector, useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

import {Button, Row, Col, Modal, Alert, Form, Spinner} from 'react-bootstrap';

import useWindowDimensions from '../helpers/useWindowDimensions';

import ViewMarker from './ViewMarker';

import {errorNewUnit} from '../redux/units.js';
import {sagaNewUnit, sagaGetUnits} from '../redux/saga/units.js';

const containerStyle = {
	width: '400px',
	height: '400px'
};

const center = {
	lat: 50.42,
	lng: 30.52
};

function Maps() {
	const {height, width} = useWindowDimensions();

	let newWidth = width - 250;

	const refMap = useRef(null);

	const dispatch = useDispatch();

	const refNewMarker = useRef(null);

	const [modal, setModal] = useState(false);

	const {register, handleSubmit, watch, formState: {errors}} = useForm({});

	const units = useSelector(state => state.units.units);

	const newUnitError = useSelector(state => state.units.newUnitError);
	const newUnitLoading = useSelector(state => state.units.newUnitLoading);
	const newUnit = useSelector(state => state.units.newUnit);

	useEffect(() => {
		if(newUnit && modal) {
			setModal(false);
		}
	}, [newUnit]);

	const fn = useCallback(throttle(() => {
		let bounds = refMap.current.getBounds();
		// add debaunce
		dispatch(sagaGetUnits({
			NELat: bounds.getNorthEast().lat(),
			NELng: bounds.getNorthEast().lng(),
			SWLat: bounds.getSouthWest().lat(),
			SWLng: bounds.getSouthWest().lng()
		}));
	}, 1000), []);

	const [viewMarker, setViewMarker] = useState(null);

	return (<>
		<LoadScript style={{width: newWidth, height}} googleMapsApiKey="XXX">
			<GoogleMap mapContainerStyle={{width: newWidth, height}}
				options={{disableDoubleClickZoom: true}}
				center={center}
				zoom={11}
				onLoad={(map) => {
					refMap.current = map;
					console.log(map);
				}}
				onBoundsChanged={fn}
				onUnmount={() => {refMap.current = null;}}
				onDblClick={(e) => {
					setModal(true);
					refNewMarker.current = {lat: e.latLng.lat(), lng: e.latLng.lng()};
				}}
				>
				{units.map((entry) => {
					return <Marker 	key={entry.id}
									position={{lat: entry.lat, lng: entry.lng}}
					 				onClick={(e) => {
										setViewMarker(entry);
										console.log({lat: e.latLng.lat(), lng: e.latLng.lng()})
									}}/>
				})}
			</GoogleMap>
		</LoadScript>
		{viewMarker?<ViewMarker onHide={() => {setViewMarker(null)}} markerEntry={viewMarker} />:null}
		<Modal show={modal} onHide={() => {
			setModal(false);
			dispatch(errorNewUnit(false));
		}} animation={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Add Marker to Google Maps</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{newUnitError?<Row>
					<Col>
						<Alert variant="danger" onClose={() => dispatch(errorNewUnit(false))} dismissible>
							<Alert.Heading>Server Error Message</Alert.Heading>
							<p>{newUnitError.data.message || newUnitError.data.reason}</p>
						</Alert>
					</Col>
				</Row>:null}
				{newUnitLoading?<Row>
					<Col>
						<Spinner animation="border" size="6rem" />
					</Col>
				</Row>:null}
				{!newUnitLoading?<Row>
					<Col>
						<Form id="hook-modal-form" onSubmit={handleSubmit((data) => {
							console.log(data, refNewMarker.current);
							const formData = new FormData();
							formData.append("images[]", data.image[0]);
							formData.append("title", data.title);
							if(refNewMarker.current) {
								formData.append("lat", refNewMarker.current.lat);
								formData.append("lng", refNewMarker.current.lng);
							}
							dispatch(sagaNewUnit(formData));
						})}>
							<Form.Group as={Row} className="mb-3" controlId="formTitle">
								<Form.Label column sm="3">Title</Form.Label>
								<Col sm="9">
									<Form.Control {...register("title")} type="text" placeholder="Enter Title" isInvalid={!!errors.title} />
									<Form.Control.Feedback type="invalid">
										{errors.title?.message}
									</Form.Control.Feedback>
								</Col>
							</Form.Group>
							<Form.Group as={Row} className="mb-3" controlId="formImage">
								<Form.Label column sm="3">Image</Form.Label>
								<Col sm="9">
									<Form.Control {...register("image")} type="file" placeholder="Enter Image" isInvalid={!!errors.image} />
									<Form.Control.Feedback type="invalid">
										{errors.image?.message}
									</Form.Control.Feedback>
								</Col>
							</Form.Group>
						</Form>
					</Col>
				</Row>:null}
			</Modal.Body>
			<Modal.Footer className="justify-content-center">
				<Button variant="secondary" onClick={() => {
					setModal(false);
					dispatch(errorNewUnit(false));
				}} >Close</Button>
				<Button variant="success" type="submit" form="hook-modal-form" disabled={newUnitLoading}>Add to Map</Button>
			</Modal.Footer>
		</Modal>
	</>);
}

export default React.memo(Maps)
