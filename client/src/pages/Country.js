import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, Table, Nav } from 'react-bootstrap/';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import { Card, CardBody, Divider } from '../components/Card/Card';
import RateCalculator from '../components/RateCalculator/RateCalculator';
import Header from '../components/Header/Header';
import { CountryCard } from '../components/CountryCard/CountryCard';
import getCountryName from '../utils/ISOToCountry';
import getTimeDifference from '../utils/timeDifference';
import { compareSingle, compareDouble, percentDiffColor } from '../utils/healthComparison';
import { languages, flagSrc, getOtherTrafficSide, formatingVisa } from '../utils/parsingTools';
import getCountryName2 from '../utils/ISOToCountry2';
import '../App.css';

function Country({
	originCountry,
	destinationCountry,
	originCity,
	destinationCity,
	originLat,
	originLng,
	destinationLat,
	destinationLng
}) {
	const [advisoryInfo, setAdvisory] = useState('Not available yet');
	const [advisoryLink, setAdvisoryLink] = useState('');
	const [visaInfo, setVisa] = useState('Not available yet');
	const [languagesInfo, setLanguages] = useState({
		'Official Languages': 'TBD',
		'Regional Languages': 'TBD',
		'Widely Spoken Languages': 'TBD'
	});
	const [unsafeAreas, setUnsafeAreas] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [socketType, setSocketType] = useState('Not available yet');
	const [voltage, setVoltage] = useState('Not available yet');
	const [frequency, setFrequency] = useState('Not available yet');
	const [vaccines, setVaccines] = useState('Not available yet');
	const [timeOrigin, setTimeOrigin] = useState('Not available yet');
	const [timeDestination, setTimeDestination] = useState('Not available yet');
	const [currencyInfo, setCurrency] = useState({});
	const [originCurrencyInfo, setOriginCurrency] = useState({});
	const [financialInfo, setFinancial] = useState({});
	const [trafficSide, setTrafficSide] = useState('Not available yet');
	const [canabaisMedical, setcanabaisMedical] = useState({});
	const [canabaisRecreational, setcanabaisRecreational] = useState({});
	const [cocainePossession, setcocainePossession] = useState({});
	const [methaphetaminePossession, setmethaphetaminePossession] = useState({});
	const [rate, setRate] = useState('');
	const [destinationHealth, setDestinationHealth] = useState({});
	const [originHealth, setOriginHealth] = useState({});
	const [vaccineCard, setVaccinCard] = useState('');
	const [embassyInfo, setEmbassy] = useState('');
	const [emergencyInfo, setEmergency] = useState('');
	const destCountryName = getCountryName2(destinationCountry);
	const originCountryName = getCountryName2(originCountry);

	useEffect(() => {
		async function fetchRate(originCode, destinationCode) {
			fetch(`https://api.exchangeratesapi.io/latest?base=${originCode}&symbols=${destinationCode}`)
				.then(
					(response) => {
						if (response.status !== 200) {
							console.log('Exchange Rate API did not return HTTP 200');
							setIsLoading(false);
							return;
						}

						// Set the currency rate from origin to destination
						response.json().then((data) => {
							setRate(data.rates[destinationCode].toFixed(2));
							setIsLoading(false);
						});
					}
				)
				.catch((err) => {
					console.log('Fetch Error :-S', err);
					setIsLoading(false);
				});
		}

		async function fetchData() {
			setIsLoading(true);
			await fetch('http://localhost:4000/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query: `{
						countryToCountry(origin:"${originCountry}" destination: "${destinationCountry}") {
							name
							visa_info
							advisory_link
							advisory_text
						}
						country_languages(country_iso: "${destinationCountry}") {
							official_languages,
							regional_languages,
							minority_languages,
							national_languages,
							widely_spoken_languages
						}
						country_unsafe_areas(country_iso: "${destinationCountry}") {
							unsafe_areas
						}
						destinationCurrencies: currencies(country: "${destinationCountry}") {
							name
							symbol
							code
						}
						originCurrencies: currencies(country: "${originCountry}") {
							name
							symbol
							code
						}
						country_socket(country_iso: "${destinationCountry}") {
							plug_type,
							electric_potential,
							frequency
						}
						financials(country: "${destinationCountry}") {
							gasoline
							groceries
							rent
						}
						time_difference_origin(lat_origin:${originLat} lng_origin:${originLng} country_origin:"${originCountry}") {
							utc_offset
						}
						time_difference_destination(lat_destination:${destinationLat} lng_destination:${destinationLng} country_destination:"${destinationCountry}") {
							utc_offset
						}
						trafficSide(iso:"${destinationCountry}") {
							traffic_side
						}
						destinationHealth:unitedNations(country:"${destinationCountry}") {
							homicideRate
							infantMortality
							lifeExpectancy
							nbOfPhysicians
							sanitation
							water
						}
						originHealth:unitedNations(country:"${originCountry}") {
							homicideRate
							infantMortality
							lifeExpectancy
							nbOfPhysicians
							sanitation
							water
						}
						drugs(country_iso:"${destinationCountry}") {
							country_iso,
							name,
							methaphetamine_possession,
							methaphetamine_sale,
							methaphetamine_transport,
							methaphetamine_cultivation,
							cocaine_possession,
							cocaine_sale,
							cocaine_transport,
							cocaine_cultivation,
							canabais_recreational,
							canabais_medical
						}
						country_vaccines(country_iso:"${destinationCountry}") {
							vaccine_name
							vaccine_info
						}
						embassy(country: "${destCountryName}", operator: "${originCountryName}") {
							city
							type
							phone
							email
							website
						}
						emergency(country: "${destinationCountry}") {
							police
							ambulance
							fire
						}
					}`
				})
			})
				.then((res) => res.json())
				.then((res) => {
					(res.data.countryToCountry && res.data.countryToCountry.length !== 0) && setAdvisory(res.data.countryToCountry[0].advisory_text);
					(res.data.countryToCountry && res.data.countryToCountry.length !== 0) && setAdvisoryLink(res.data.countryToCountry[0].advisory_link);
					(res.data.countryToCountry && res.data.countryToCountry.length !== 0) && setVisa(res.data.countryToCountry[0].visa_info);
					(res.data.country_languages && res.data.country_languages.length !== 0) && setLanguages(res.data.country_languages[0]);
					(res.data.country_unsafe_areas && res.data.country_unsafe_areas.length !== 0) && setUnsafeAreas(res.data.country_unsafe_areas[0].unsafe_areas);
					(res.data.country_socket && res.data.country_socket.length !== 0) && setSocketType(res.data.country_socket[0].plug_type);
					(res.data.country_socket && res.data.country_socket.length !== 0) && setVoltage(res.data.country_socket[0].electric_potential);
					(res.data.country_socket && res.data.country_socket.length !== 0) && setFrequency(res.data.country_socket[0].frequency);
					(res.data.destinationCurrencies && res.data.destinationCurrencies.length !== 0) && setCurrency(res.data.destinationCurrencies[0]);
					(res.data.originCurrencies && res.data.originCurrencies.length !== 0) && setOriginCurrency(res.data.originCurrencies[0]);
					(res.data.financials && res.data.financials.length !== 0) && setFinancial(res.data.financials[0]);
					(res.data.time_difference_origin && res.data.time_difference_origin.length !== 0) && setTimeOrigin(res.data.time_difference_origin[0].utc_offset);
					(res.data.time_difference_destination && res.data.time_difference_destination.length !== 0) && setTimeDestination(res.data.time_difference_destination[0].utc_offset);
					(res.data.trafficSide && res.data.trafficSide.length !== 0) && setTrafficSide(res.data.trafficSide[0].traffic_side);
					(res.data.destinationHealth && res.data.destinationHealth.length !== 0) && setDestinationHealth(res.data.destinationHealth[0]);
					(res.data.originHealth && res.data.originHealth.length !== 0) && setOriginHealth(res.data.originHealth[0]);
					(res.data.drugs && res.data.drugs.length !== 0) && setcanabaisMedical(res.data.drugs[0].canabais_medical);
					(res.data.drugs && res.data.drugs.length !== 0) && setcanabaisRecreational(res.data.drugs[0].canabais_recreational);
					(res.data.drugs && res.data.drugs.length !== 0) && setcocainePossession(res.data.drugs[0].cocaine_possession);
					(res.data.drugs && res.data.drugs.length !== 0) && setmethaphetaminePossession(res.data.drugs[0].methaphetamine_possession);
					(res.data.country_vaccines && res.data.country_vaccines.length !== 0) && setVaccines(res.data.country_vaccines);
					(res.data.embassy && res.data.embassy.length !== 0) && setEmbassy(res.data.embassy[0]);
					(res.data.emergency && res.data.emergency.length !== 0) && setEmergency(res.data.emergency[0]);
					fetchRate(res.data.originCurrencies[0].code, res.data.destinationCurrencies[0].code);
				});
		}

		fetchData();
	}, [originCountry, destinationCountry, originLat, originLng, destinationLat, destinationLng, destCountryName, originCountryName]);

	const socketArray = socketType.replace(/\s/g, '').split(',');
	const formatedVisaInfo = formatingVisa(visaInfo);
	if (!originCountry || !destinationCountry) {
		return <Redirect to="/" />;
	}

	return (
		<div>
			{!isLoading && (
				<div className="parallax">
					<Header
						title={getCountryName(destinationCountry)}
						title2={destinationCity}
						title3={getTimeDifference(timeOrigin, timeDestination, originCity)}
					/>
					<Row className="justify-content-center">
						<Col style={{ backgroundColor: 'rgb(255, 255, 255)', borderRadius: '20px' }} lg={8}>
							<Row style={{ backgroundColor: 'rgb(247,	247,	247)', padding: '1em', borderRadius: '0px' }} className="justify-content-center sticky">
								<Nav variant="pills" className="flex-row">
									<Nav.Item>
										<Nav.Link href="#Important Basics">Important Basics</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link href="#Electricity & Financials">Electricity & Financials</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link href="#Miscellaneous">Miscellaneous</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link href="#Health & Safety">Health & Safety</Nav.Link>
									</Nav.Item>
								</Nav>
							</Row>
							<Row id="Important Basics" className="justify-content-center">
								<Col sm={4} style={{ padding: '25px' }}>
									<CountryCard
										flagSrc={flagSrc(destinationCountry)}
										title="Country Flag"
									>
										<CardBody>
											{languagesInfo !== 'Not available yet.'
											&& languages(languagesInfo)}
										</CardBody>
									</CountryCard>
								</Col>
								<Col sm={6} style={{ padding: '25px' }}>
									{!(visaInfo === null || visaInfo === 'Not available yet') && (
										<Card
											className="scrolling-card"
											header="Visa Info"
											style={{ maxHeight: '400px', overflow: 'scroll' }}
										>
											<CardBody
												className="scrolling-card"
												style={{ paddingTop: '0' }}
											>
												<div
													className="scrolling-card"
													dangerouslySetInnerHTML={{ __html: formatedVisaInfo }}
												/>
											</CardBody>
										</Card>
									)}
								</Col>
								<Col sm={6} style={{ padding: '25px' }}>
									{!(advisoryInfo === null || advisoryInfo === 'Not available yet') && (
										<Card
											className="scrolling-card"
											header="Advisory"
											style={{ maxHeight: '400px', overflow: 'scroll' }}
										>
											<CardBody>
												<ErrorOutlineOutlinedIcon style={{ color: '#dc3545' }} />
												<div
													style={{ display: 'inline' }}
													className="scrolling-card"
													dangerouslySetInnerHTML={{ __html: advisoryInfo }}
												/>
												<div
													dangerouslySetInnerHTML={{ __html: advisoryLink }}
												/>
											</CardBody>
										</Card>
									)}
								</Col>
							</Row>
							<hr />
							<div id="Electricity & Financials">
								<Row className="justify-content-center">
									<Col xs="10" sm="6" style={{ padding: '25px' }}>
										<Card header="Prices (in USD)">
											<CardBody>
												<pre style={{ textAlign: 'center' }}>
													<strong>Gasoline:</strong> {financialInfo.gasoline}$
										/ Gallon
												</pre>
												<pre style={{ textAlign: 'center' }}>
													<strong>Groceries:</strong>{' '}
													{financialInfo.groceries}$ / Week
												</pre>
												<pre style={{ textAlign: 'center' }}>
													<strong>Rent:</strong> {financialInfo.rent}$ / Day
												</pre>
											</CardBody>
										</Card>
									</Col>
								</Row>
								<Row className="justify-content-center">
									<Col sm={6} style={{ padding: '25px' }}>
										{!(advisoryInfo === null || advisoryInfo === 'Not available yet') && (
											<Card header="Currency">
												<CardBody>
													<Row className="justify-content-center">
														<pre>
															<strong>Name:</strong> {currencyInfo.name}
														</pre>
														<pre>
															<strong>	Code:</strong> {currencyInfo.code}
														</pre>
														<pre>
															<strong>	Symbol:</strong> {currencyInfo.symbol}
														</pre>
													</Row>
													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center'
														}}
													>
														<RateCalculator
															destinationRate={rate}
															originCurrency={originCurrencyInfo.code}
															destCurrency={currencyInfo.code}
														/>
													</div>
												</CardBody>
											</Card>
										)}
									</Col>
								</Row>
								<Row className="justify-content-center">
									<Col xs="10" sm="8" style={{ padding: '25px' }}>
										<Card header="Sockets & Plugs">
											<CardBody>
												<p>
													{getCountryName(destinationCountry)} uses{' '}
													<b style={{ color: '#FF9A8D' }}>{voltage}</b> and{' '}
													<b style={{ color: '#FF9A8D' }}>{frequency}</b> for
											electrical sockets. Plugs are of{' '}
													<b style={{ color: '#FF9A8D' }}>{socketType}</b>:
												</p>
												<Divider />
												<Row className="justify-content-center">
													{socketType !== 'Not available yet'
											&& socketArray.map((item) => (
												/* eslint-disable */
												// eslint is giving tab indent errors such as "Expected indentation of 27 tabs but found 14", which makes no sense
												<Col>
													<img
														key={item}
														src={require(`../socketImages/${item}.png`)}
														style={{width: '200px'}}
														alt=''
													/>
												</Col>
												/* eslint-enable */
											))}
												</Row>
											</CardBody>
										</Card>
									</Col>
								</Row>
							</div>
							<hr />
							<Row id="Miscellaneous" className="justify-content-center">
								<Col xs="10" sm="6" style={{ padding: '25px' }}>
									<Card
										header="Drug Laws"
									>
										<CardBody>
											<div
												className="scrolling-card"
												style={{ maxHeight: '400px', overflow: 'scroll' }}
											>
												<p>
													<strong>Canabais recreational:</strong> {JSON.stringify(canabaisRecreational).replace(/(^")|("$)/g, '')}
												</p>
												<p>
													<strong>Canabais medical:</strong> {JSON.stringify(canabaisMedical).replace(/(^")|("$)/g, '')}
												</p>
												<p>
													<strong>Cocaine possession:</strong> {JSON.stringify(cocainePossession).replace(/(^")|("$)/g, '')}
												</p>
												<p>
													<strong>Methaphetamine possession:</strong> {JSON.stringify(methaphetaminePossession).replace(/(^")|("$)/g, '')}
												</p>
											</div>
										</CardBody>
									</Card>
									<br />
									<Card header="Embassies and Consulates">
										<CardBody>
											{!embassyInfo ? <div>Note: We don&apos;t have any info on embassies or consulates in {destCountryName}. Try Googling instead.</div>
												:													(
													<span>
														{embassyInfo.type === 'embassy'
										&& (
											<strong>Embassy of <span style={{ color: '#FF1C00' }}>{originCountryName}</span></strong>
										)}
														{embassyInfo.type === 'consulate'
										&& (
											<strong>Consulate of <span style={{ color: '#FF1C00' }}>{originCountryName}</span></strong>
										)}
														{embassyInfo.type === 'consulate general'
										&& (
											<strong>Consulate General of <span style={{ color: '#FF1C00' }}>{originCountryName}</span></strong>
										)}
														{embassyInfo.type === 'honorary consulate'
										&& (
											<strong>Honorary Consulate of <span style={{ color: '#FF1C00' }}>{originCountryName}</span></strong>
										)}
														<div style={{ paddingBottom: '20px' }} />
														{(embassyInfo.city !== '')
										&& (
											<div style={{ paddingBottom: '5px' }}>City: {embassyInfo.city}</div>
										)}
														{(embassyInfo.phone !== '')
										&& (
											<div style={{ paddingBottom: '5px' }}>Phone: {embassyInfo.phone}</div>
										)}
														{(embassyInfo.email !== '')
										&& (
											<div style={{ paddingBottom: '5px' }}>Email: {embassyInfo.email}</div>
										)}
														{(embassyInfo.website !== '')
										&& (
											<div style={{ paddingBottom: '5px' }}>Website: {embassyInfo.website}</div>
										)}
													</span>
												)}
										</CardBody>
									</Card>
								</Col>
								<Col xs="10" sm="6" style={{ padding: '25px' }}>
									<Card header="Unsafe Areas">
										<CardBody>
											<div
												className="scrolling-card"
												style={{ maxHeight: '285px', overflow: 'scroll' }}
												dangerouslySetInnerHTML={{ __html: unsafeAreas }}
											/>
										</CardBody>
									</Card>
									<br />
									<Card header="Traffic Flow">
										<CardBody>
											{trafficSide !== 'Not available yet'
										&& (
											<p>
									In {getCountryName(destinationCountry)} the traffic flow is on the{' '}
												<b style={{ color: '#FF9A8D' }}>{trafficSide} hand</b> side
											</p>
										)}
											<Divider />
											{trafficSide !== 'Not available yet'
										&& (
											<img
												key={trafficSide}
												src={require(`../trafficImages/${trafficSide}.png`)}
												style={{ width: '200px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
												alt=""
											/>
										)}
											{trafficSide !== 'Not available yet'
										&& (
											<p style={{ textAlign: 'center' }}>
												<br />
												<b style={{ color: '#FF1C00' }}>
										Warning
												</b><br />
										Be sure to look {getOtherTrafficSide(trafficSide)} when crossing streets
											</p>
										)}
										</CardBody>
									</Card>
								</Col>
							</Row>
							<hr />
							<Row id="Health & Safety" className="justify-content-center">
								<Col xs="10" sm="6" style={{ padding: '25px' }}>
									<Card header="Emergency Contacts">
										<CardBody>
											<pre style={{ textAlign: 'center' }}><strong>Police: </strong>{emergencyInfo.police}</pre>
											<pre style={{ textAlign: 'center' }}><strong>Ambulance: </strong>{emergencyInfo.ambulance}</pre>
											<pre style={{ textAlign: 'center' }}><strong>Fire: </strong>{emergencyInfo.fire}</pre>
										</CardBody>
									</Card>
								</Col>
								<Col xs="10" sm="8" style={{ padding: '25px' }}>
									<Card header="General Health">
										<CardBody>
											<Table striped bordered hover>
												<tbody>
													<tr>
														<td><strong>Homicide Rate</strong></td>
														<td>{destinationHealth.homicideRate} <span style={{ color: percentDiffColor(String(destinationHealth.homicideRate), String(originHealth.homicideRate)) }}>{compareSingle(String(destinationHealth.homicideRate), String(originHealth.homicideRate))}</span></td>
													</tr>
													<tr>
														<td><strong>Infant Mortality (Per 1000)</strong></td>
														<td>{destinationHealth.infantMortality} <span style={{ color: percentDiffColor(String(destinationHealth.infantMortality), String(originHealth.infantMortality)) }}>{compareSingle(String(destinationHealth.infantMortality), String(originHealth.infantMortality))}</span></td>
													</tr>
													<tr>
														<td><strong>Life Expectancy (f/m, years)</strong></td>
														<td>{destinationHealth.lifeExpectancy} <span style={{ color: 'blue' }}>{compareDouble(destinationHealth.lifeExpectancy, originHealth.lifeExpectancy)}</span></td>
													</tr>
													<tr>
														<td><strong>Number of physicians (Per 1000)</strong></td>
														<td>{destinationHealth.nbOfPhysicians} <span style={{ color: percentDiffColor(String(destinationHealth.nbOfPhysicians), String(originHealth.nbOfPhysicians)) }}>{compareSingle(String(destinationHealth.nbOfPhysicians), String(originHealth.nbOfPhysicians))}</span></td>
													</tr>
													<tr>
														<td><strong>Sanitation (urban/rural, %)</strong></td>
														<td>{destinationHealth.sanitation} <span style={{ color: 'blue' }}>{compareDouble(destinationHealth.sanitation, originHealth.sanitation)}</span></td>
													</tr>
													<tr>
														<td><strong>Water (urban/rural, %)</strong></td>
														<td>{destinationHealth.water}  <span style={{ color: 'blue' }}>{compareDouble(destinationHealth.water, originHealth.water)}</span></td>
													</tr>
												</tbody>
											</Table>
										</CardBody>
									</Card>
								</Col>
								<Col xs="10" sm="8" style={{ padding: '25px' }}>
									{!(vaccines === null || vaccines === 'Not available yet') && (
										<Card header="Vaccines">
											<CardBody>
												<Row className="justify-content-center" style={{ padding: '0px 0px' }}>
													{vaccines.map((value, index) => {
														if (vaccineCard === '' && index === 0) {
															setVaccinCard(value.vaccine_info);
														}
														if ((vaccineCard === value.vaccine_info && index === 0)) {
															return (
																<button
																	type="button"
																	className="tablinks"
																	style={{ color: '#FF1C00' }}
																	onClick={() => setVaccinCard(value.vaccine_info)}
																>{value.vaccine_name}
																</button>
															);
														}


														return (
															<button
																type="button"
																className="tablinks"
																onClick={() => setVaccinCard(value.vaccine_info)}
															>
																{value.vaccine_name}
															</button>
														);
													})}
												</Row>

												<Divider /><br />
												<Row className="justify-content-center" style={{ padding: '0px 25px' }}>
													<p dangerouslySetInnerHTML={{ __html: vaccineCard }} style={{ fontSize: `${1}rem` }} />
												</Row>
											</CardBody>
										</Card>
									)}
								</Col>
							</Row>
						</Col>
					</Row>
					<footer id="footer" />
				</div>
			)}
		</div>
	);
}

export default Country;
