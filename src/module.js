import React from 'react';
import $ from 'jquery';
import Auth0Lock from 'auth0-lock';
import config from '../config.js'

const auth0Lock = new Auth0Lock(config.clientID, config.domain);

const Spinner = (props) => {
	return <div>spinner</div>;
};
const Password = (props) => {
	return <div>{JSON.stringify(props.item)}</div>;
};
const Usernames = (props) => {
	return <div>{JSON.stringify(props.item)}</div>;
};
const MoreLogins = (props) => {
	return <div>{JSON.stringify(props.item)}</div>;
};
class Data extends React.Component {
	constructor(props) {
		super(props);
		//
		this.state = { passwordFailure: [], usernameFailure: [], loginCount: [] };
	}
	componentDidMount() {
		var that = this,
			login = function() {
				$.get(config.api.endPoint)
					.done( res => that.setState(res) )
					.fail( err => {
						// if we've reach this far I believe we should try again - maybe our token has expired
						let refreshToken = localStorage.getItem('refreshToken');
						if (refreshToken) {
							auth0Lock.refreshToken(refreshToken, (err, delegationResult) => {
								localStorage.setItem('userToken', delegationResult.id_token);
								login();
							});
						} else {
							// how did this happen?
							auth0Lock.showSignin({ authParams: { scope: 'openid offline_access'} });
						}
					});
			};
		login();
	}
	render() {
		return (
			<div>
				<div>
					<div>Top Users with failed attempts because of password</div>
					<ul>
						{this.state.passwordFailure.map( (item, index) => {
							return <li key={'p' + index}><Password item={item} /></li>;
						})}
					</ul>
				</div>
				<div>
					<div>Top users with failed attempts because of usernames</div>
					<ul>
						{this.state.usernameFailure.map( (item, index) => {
							return <li key={'u' + index}><Password item={item} /></li>;
						})}
					</ul>
				</div>
				<div>
					<div>Top users with more logins</div>
					<ul>
						{this.state.loginCount.map( (item, index) => {
							return <li key={'l' + index}><Password item={item} /></li>;
						})}
					</ul>
				</div>
			</div>
		);
	}
};

export default class Module extends React.Component {
	constructor(props) {
		super(props);
		//
		this.state = { idToken: null };
	}
	//
	getIdToken() {
		let idToken = localStorage.getItem('userToken');
		let authHash = auth0Lock.parseHash(window.location.hash);
		if (!idToken && authHash) {
			if (authHash.id_token) {
				idToken = authHash.id_token
				localStorage.setItem('userToken', authHash.id_token);
			}
			if (authHash.refresh_token) {
				localStorage.setItem('refreshToken', authHash.refresh_token);
			}
			if (authHash.error) {
				console.log("Error signing in", authHash);
			}
		}
		return idToken;
	}
	//
	componentDidMount() {
		if (!this.state.idToken) {
			auth0Lock.showSignin({ authParams: { scope: 'openid offline_access'} });
		}
	}
	componentWillMount() {
		//
		$.ajaxSetup({
			'beforeSend': function(xhr) {
				if (localStorage.getItem('userToken')) {
					xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
				}
			}
		});
		//
		this.setState({ idToken: this.getIdToken() });
	}
	render() {
		let content = <Spinner />;
		if (this.state.idToken) {
			content = <Data />;
		}
		return content;
	}
};
