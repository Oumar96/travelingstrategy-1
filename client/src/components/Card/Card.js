import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card as RBCard } from 'react-bootstrap';
import logo from '../Navbar/logo.png';
import './Card.css';

const InfoCard = (props) => {
	const { toggle = '', info = '' } = props;
	return (
		<div className="popup">
			<RBCard className="popup_inner">
				<RBCard.Header className="iHeader">
					<button type="button" onClick={() => toggle()} className="iClose" />
				</RBCard.Header>
				<RBCard.Text class="iText">
					{info}
				</RBCard.Text>
				<RBCard.Footer className="iFooter">
					<img
						alt="error"
						src={logo}
						 width="22"
						 height="22"
					/>
				</RBCard.Footer>
			</RBCard>
		</div>
	   );
};

const Card = (props) => {
	const { header = '', footer, info = '', children, ...rest } = props;
	const [showInfo, setShowInfo] = useState(false);
	const infoWindow = () => {
		setShowInfo(!showInfo);
	};
	return (
		<RBCard {...rest} className="TSCard">
			{header && (
				<RBCard.Header className="cardHeader">{header}
					{info && <button onClick={infoWindow} className="iImage" type="button" />}
				</RBCard.Header>
			)}
			{children}
			{footer && <RBCard.Footer className="text-muted">{footer}</RBCard.Footer>}
			{showInfo ? <InfoCard toggle={infoWindow} info={info} /> : null}
		</RBCard>
	);
};


const CardBody = (props) => {
	const { children, title = '', subtitle = '', classExtra = '', ...rest } = props;
	return (
		<RBCard.Body
			{...rest}
			className={`TScardBody ${classExtra}`}
		>
			{title && <RBCard.Title>{title}</RBCard.Title>}
			{subtitle && (
				<RBCard.Subtitle className="mb-2 text-muted">
					{subtitle}
				</RBCard.Subtitle>
			)}
			<span className="card-text">{children}</span>
		</RBCard.Body>
	);
};

const Divider = () => {
	return <hr className="cardDivider" />;
};

Card.propTypes = {
	header: PropTypes.string,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	info: PropTypes.string,
	classExtra: PropTypes.string
};

InfoCard.propTypes = {
	info: PropTypes.string,
	toggle: PropTypes.func
};

export { Card, CardBody, Divider, InfoCard };
