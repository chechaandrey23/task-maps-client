import React, {useState, useCallback, useEffect, useRef, useLayoutEffect} from 'react'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import {useSelector, useDispatch} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';

import {Button, Row, Col, Modal, Alert, Form, Spinner} from 'react-bootstrap';

import {errorNewUnit} from '../redux/units.js';
import {sagaNewUnit, sagaGetUnits} from '../redux/saga/units.js';

const containerStyle = {
	//width: '400px',
	height: '400px'
};

const center = {
	lat: 50.42,
	lng: 30.52
};

export default function TopBar() {
	const dispatch = useDispatch();

	const [modal, setModal] = useState(false);
	const [marker, setMarker] = useState(null);

	const newUnitError = useSelector(state => state.units.newUnitError);
	const newUnitLoading = useSelector(state => state.units.newUnitLoading);
	const newUnit = useSelector(state => state.units.newUnit);

	const {register, handleSubmit, reset, control, formState: {errors}} = useForm({});

	const refNewMarker = useRef(null);

	useLayoutEffect(() => {
		if(newUnit && modal) {
			setModal(false);
			dispatch(errorNewUnit(false));
			refNewMarker.current = null;
			reset();
		}
	}, [newUnit]);

	return (<>
		<Row style={{height: 50}} className="justify-content-end align-items-center">
			<Col sm="auto">
				<Button variant="success" disabled={newUnitLoading} onClick={() => {setModal(true);}}>New Content</Button>
			</Col>
		</Row>
		<Modal show={modal} onHide={() => {
			setModal(false);
			dispatch(errorNewUnit(false));
			refNewMarker.current = null;
			reset();
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
							<Form.Group as={Row} className="mb-3" controlId="formLatLng">
								<Form.Label column sm="3">Maps(dbl-click)</Form.Label>
								<Col sm="9">
									<Controller name="group"
												control={control}
												isInvalid={!!errors.latLng}
												render={({ field: {onChange, onBlur, value, ref}, fieldState: {error} }) => {
													return <GoogleMap mapContainerStyle={containerStyle}
														options={{disableDoubleClickZoom: true}}
														center={center}
														zoom={11}
														onDblClick={(e) => {
															refNewMarker.current = {lat: e.latLng.lat(), lng: e.latLng.lng()};
															setMarker(refNewMarker.current);
														}}
														>
														{(marker && refNewMarker.current)?<Marker position={{lat: marker.lat, lng: marker.lng}} />:null}
													</GoogleMap>
												}} />
									<Form.Control.Feedback type="invalid">
										{errors.latLng?.message}
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
					refNewMarker.current = null;
					reset();
				}} >Close</Button>
				<Button variant="success" type="submit" form="hook-modal-form" disabled={newUnitLoading}>Create Content</Button>
			</Modal.Footer>
		</Modal>
	</>);
}
