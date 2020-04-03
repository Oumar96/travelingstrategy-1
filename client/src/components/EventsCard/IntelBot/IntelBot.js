import React, { useState } from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import PropTypes from 'prop-types';
import BotSlider from '../BotSlider/BotSlider'
import './IntelBot.css';

const IntelBotResult = (props) => {
	const {
        show = '',
		handleClose = '',
		knowledge = '',
	} = props;

	return(
		<Modal
			show={show}
			onHide={handleClose}
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="example-modal-sizes-title-lg" className="bot">
					<h2>Here's What I know</h2>
					<img alt="monkey icon" src={require('../../../eventsImages/monkey-icon.png')} className="monkey-icon"></img>
				</Modal.Title>
			</Modal.Header>
			<ModalBody style={{ textAlign: 'center' }}>
				{knowledge.length !== 0
					?	<BotSlider
							knowledge={knowledge}
						></BotSlider>
					:	<p>I did not find anything. Try another event</p>
				}
			</ModalBody>
		</Modal>
	)
}
const IntelBot = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [botKnowledge, setBotKnowledge] = useState([]);
	const [botCalled, setBotCalled] = useState(false);

    const {
        show = '',
        handleClose = '',
        eventCategory = '',
        description = '',
        title = '',
        address = '',
        nameOfPlace = ''
	} = props;

    async function getBotInfo(){
		setIsLoading(true);
        const eventInfo = eventCategory+" "+description+" "+title+" "+address+" "+nameOfPlace;
        const body = {
            eventInfo
        }

		await fetch(`${process.env.REACT_APP_BACKEND}intelInfo`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		})
		.then((res) => res.json())
		.then((res) => {
			setIsLoading(false);
			setBotKnowledge(res);
			setBotCalled(true)
		})
	}

    return(
			<>{botCalled === false
				?
				<Modal
					show={show}
					onHide={handleClose}
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title id="example-modal-sizes-title-lg" className="bot">
							{!isLoading
								? <h2>Scratch my head to find out what I know about this event</h2>
								: <h2>Let me think a moment</h2>
							}
							<img alt="monkey logo" src={require('../../../eventsImages/monkey-icon.png')} className="monkey-icon"></img>
						</Modal.Title>
					</Modal.Header>
					{!isLoading
					?<ModalBody style={{ textAlign: 'center' }} onClick={getBotInfo}>
						<img alt="smart monkey" src={require('../../../eventsImages/smart-monkey.gif')} />
					</ModalBody>
					: <ModalBody style={{ textAlign: 'center' }}>
						<img alt="thinking monkey" src={require('../../../eventsImages/thinky-monkey.gif')} />
					</ModalBody>
					}
				</Modal>
				:
				<IntelBotResult
					show={show}
					handleClose={handleClose}
					knowledge={botKnowledge}
				/>
			}
			</>
    )
}

IntelBot.propTypes = {
    show: PropTypes.bool,
	eventCategory: PropTypes.string,
	description: PropTypes.string,
	title: PropTypes.string,
	address: PropTypes.string,
	nameOfPlace: PropTypes.string,
};

export default IntelBot;