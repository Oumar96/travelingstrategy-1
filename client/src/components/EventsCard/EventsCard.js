import React, { useState } from 'react';
import { Card, Modal, ModalBody, Popover, OverlayTrigger } from 'react-bootstrap';
import './EventsCard.css';
import PropTypes from 'prop-types';
import { AwesomeButton } from 'react-awesome-button';
import IntelBot from './IntelBot/IntelBot';
import 'react-awesome-button/dist/styles.css';

const EventsCard = (props) => {
	const [modal, setModal] = useState(false);
	const [likedModal, setLikedModal] = useState(false);
	const [removed, setRemoved] = useState(false);
	const [removedModal, setRemovedModal] = useState(false);
	const [showBot, setShowBot] = useState(false);
	const {
		eventCategory = '',
		description = '',
		startDate = '',
		endDate = '',
		title = '',
		address = '',
		nameOfPlace = '',
		duration = '0',
		eventImg = '',
		isLiked = true,
		requestId = '',
		eventInfo
	} = props;

	/**
	 * This method uses arrays because some of the information are
	 * not passed as props. The array is the result from calling the
	 * event api
	 */
	async function addEvent() {
		await fetch(`${process.env.REACT_APP_BACKEND}graphql`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/graphql' },
			body: `mutation{
                    addEvents(request_id:"${eventInfo[0]}",
                    event_category:"${eventInfo[1]}", description:"${eventInfo[2]}",
                    duration:"${eventInfo[3]}", start_date:"${eventInfo[4]}",
                    end_date:"${eventInfo[5]}", title:"${eventInfo[6]}",
                    labels:"${eventInfo[7]}", address:"${eventInfo[8]}",
                    place_type:"${eventInfo[9]}", name_of_place:"${eventInfo[10]}",
                    image:"${eventInfo[11]}")
					{   request_id,
						event_category,
						description,
						duration,
						start_date,
						end_date,
						title,
						labels,
						address,
						place_type,
						name_of_place
					}
				}`
		});
	}

	async function removeEvent() {
		const body = {
			requestId,
			title
		};
		await fetch(`${process.env.REACT_APP_BACKEND}deleteEvent`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
	}

	const handleLike = () => {
		addEvent();
		setModal(false);
	};

	const handleDelete = () => {
		removeEvent();
		setModal(false);
		setRemoved(true);
	};

	const handleFavoriteModals = () => {
		setLikedModal(false);
		setRemovedModal(false);
	};

	const handleCloseBot = () => {
		setModal(true);
		setShowBot(false);
	};

	const handleShowBot = () => {
		setModal(false);
		setShowBot(true);
	};

	/**
	 * Dates are transformed to English format
	 */
	const getDateText = (date) => {
		const dateObject = new Date(date);
		const days = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		const dateText = `${days[dateObject.getDay()]} ${
			months[dateObject.getMonth()]
		} ${dateObject.getDate()} ${dateObject.getFullYear()}`;

		return dateText;
	};

	/**
	 *
	 * This method basically adds an 's' to the duration unit
	 * in case the value is more than. This allows the sentence
	 * to be grammatically correct
	 */
	const sentenceToDisplay = (durationToDisplay, monthOrDaysOrHours) => {
		const truncatedDuration = Math.trunc(durationToDisplay);
		if (truncatedDuration > 1) {
			return `${truncatedDuration} ${monthOrDaysOrHours}s`;
		}
		return `${truncatedDuration} ${monthOrDaysOrHours}`;
	};

	/**
	 * The duration is given in seconds.
	 * This method converts to duration to an appropriate duration unit
	 */
	const getDuration = () => {
		let durationToDisplay = duration / 60;

		if (durationToDisplay > 60) {
			durationToDisplay /= 60;
			if (durationToDisplay > 24) {
				durationToDisplay /= 24;
				if (durationToDisplay > 30) {
					durationToDisplay /= 30;
					return sentenceToDisplay(durationToDisplay, 'month');
				}
				return sentenceToDisplay(durationToDisplay, 'day');
			}
			return sentenceToDisplay(durationToDisplay, 'hour');
		}
		return sentenceToDisplay(durationToDisplay, 'minute');
	};

	/**
	 * This modal shows all the information regarding an event
	 */
	const InfoModal = () => {
		return (
			<Modal
				show={modal}
				onHide={() => setModal(false)}
				centered
				id="modal-info"
			>
				<div className="modal-overlay">
					<Modal.Header closeButton>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<img
							alt="Modal pic"
							id="image_with_shadow"
							variant="top"
							src={eventImg}
							className="responsive-more-info"
						/>
						<div className="card-body">
							<p className="card-category">
								<b>Start Date: </b>
								<p className="card-date">{getDateText(startDate)}</p>
							</p>
							<p className="card-category">
								<b>End Date: </b>
								<p className="card-date">{getDateText(endDate)}</p>
							</p>
							{address !== '' && (
								<p>
									<p className="card-category">
										<b>Address: </b>
									</p>
									<p className="card-date">{address}</p>
								</p>
							)}
							{nameOfPlace !== '' && (
								<p>
									<p className="card-category">
										<b>Venue Name: </b>
									</p>
									<p className="card-date">{nameOfPlace}</p>
								</p>
							)}
							{getDuration().charAt(0) !== '0' && (
								<p>
									<p className="card-category">
										<b>Duration: </b>
									</p>
									<p className="card-date">{getDuration()}</p>
								</p>
							)}
							{description !== '' && (
								<p className="body-content-modal">
									<p className="card-category">
										<b>Description: </b>
									</p>
									<p className="card-date">{description}</p>
								</p>
							)}
							<OverlayTrigger
								overlay={(
									<Popover
										id="popover-positioned-bottom"
										className="popover-context"
									>
										Learn more about the key points of this event
									</Popover>
								)}
							>
								<AwesomeButton
									type="secondary"
									size="small"
									onPress={handleShowBot}
									centered
								>
									<img
										alt="like button"
										src={require('../../assets/images/eventsImages/smart.png')}
										style={{ height: '3em' }}
									/>
								</AwesomeButton>
							</OverlayTrigger>
							{!isLiked ? (
								<AwesomeButton
									type="secondary"
									size="small"
									centered
									onPress={handleLike}
									style={{ float: 'right' }}
								>
									<img
										alt="like button"
										src={require('../../assets/images/eventsImages/heart.png')}
										style={{ height: '3em' }}
									/>
								</AwesomeButton>
							) : (
								<AwesomeButton
									type="secondary"
									size="small"
									centered
									onPress={handleDelete}
									style={{ float: 'right' }}
								>
									<img
										alt="like button"
										src={require('../../assets/images/eventsImages/broken-heart.png')}
										style={{ height: '3em' }}
									/>
								</AwesomeButton>
							)}
						</div>
					</Modal.Body>
				</div>
			</Modal>
		);
	};

	/**
	 * This modal is notification for when an event is liked or removed
	 */
	const LikedModal = () => {
		return (
			<Modal
				show={likedModal || removedModal}
				onHide={handleFavoriteModals}
				centered
				id="modal-notification"
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-lg">
						{likedModal ? (
							<h2>Added To your Favorites !!</h2>
						) : (
							<h2>
								Removed from your favorites
								<span role="img" aria-label="sad">
									😭
								</span>
							</h2>
						)}
					</Modal.Title>
				</Modal.Header>
				<ModalBody style={{ textAlign: 'center' }}>
					{likedModal ? (
						<img
							alt="Alert"
							src={require('../../assets/images/eventsImages/addedToFavorites.gif')}
						/>
					) : (
						<img
							alt="Alert"
							src={require('../../assets/images/eventsImages/sad-monkey.gif')}
						/>
					)}
				</ModalBody>
			</Modal>
		);
	};

	/**
	 * This is the main component. It's the cards displayed on the main Event page
	 */
	const EventCard = () => {
		return (
			!removed && (
				<Card className="card" id="eventcard" border="dark">
					<div className="card-overlay" />
					<Card.Img
						variant="top"
						id="image_with_shadow"
						src={eventImg}
						className="card-image"
						style={{ height: '21em' }}
					/>
					<div className="card-body" id="cardbody">
						<h2 className="card-title">{title}</h2>
						<p className="card-category">
							<b>
								{eventCategory.charAt(0).toUpperCase()
									+ eventCategory.slice(1, -1)}
							</b>
						</p>
						<p className="card-date">{getDateText(startDate)}</p>
						<AwesomeButton
							type="secondary"
							size="medium"
							onPress={() => setModal(true)}
						>
							Find out more
						</AwesomeButton>
						{!isLiked ? (
							<AwesomeButton
								type="secondary"
								size="small"
								onPress={handleLike}
								style={{ float: 'right' }}
							>
								<img
									alt="like button"
									src={require('../../assets/images/eventsImages/heart.png')}
									style={{ height: '3em' }}
								/>
							</AwesomeButton>
						) : (
							<AwesomeButton
								type="secondary"
								size="small"
								onPress={handleDelete}
								style={{ float: 'right' }}
							>
								<img
									alt="like button"
									src={require('../../assets/images/eventsImages/broken-heart.png')}
									style={{ height: '3em' }}
								/>
							</AwesomeButton>
						)}
					</div>
				</Card>
			)
		);
	};

	return (
		<>
			<EventCard />
			<InfoModal />
			<LikedModal />
			<IntelBot
				show={showBot}
				handleClose={handleCloseBot}
				eventCategory={eventCategory}
				description={description}
				title={title}
				address={address}
				nameOfPlace={nameOfPlace}
				eventImg={eventImg}
			/>
		</>
	);
};

EventsCard.propTypes = {
	eventCategory: PropTypes.string,
	description: PropTypes.string,
	startDate: PropTypes.string,
	endDate: PropTypes.string,
	title: PropTypes.string,
	address: PropTypes.string,
	nameOfPlace: PropTypes.string,
	duration: PropTypes.string,
	isLiked: PropTypes.bool,
	requestId: PropTypes.string,
	eventImg: PropTypes.string,
	eventInfo: PropTypes.instanceOf(Array)
};

export default EventsCard;
