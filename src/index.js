import React from 'react';
import { render } from 'react-dom';


class Module extends React.Component {
	render() {
		return <div>Module 1</div>
	}
};

//
document.addEventListener( 'DOMContentLoaded', () => render( <Module />, document.body ) );

