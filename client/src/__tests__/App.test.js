import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import '../stubs/google';
import matchMedia from '../stubs/matchMedia';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});
