import React from 'react';
import $ from 'jquery';
import Auth0Lock from 'auth0-lock';
import Auth0 from 'auth0-js';
import config from '../config.js';
import styles from './module.styl';

const auth0Lock = new Auth0Lock(config.clientID, config.domain);
const auth0 = new Auth0({clientID: config.clientID, domain: config.domain});

const Spinner = props => {
  return <div>spinner</div>;
};

const PasswordTable = props => {
  return (
    <div id="password" className="tab-pane active">
      <div>Top users with failed attempts because of password</div>
      <table className={styles.module}>
        <thead>
        <tr>
        </tr>
        </thead>
        <tbody>
        {props.data.map( (item, index) => {
          return <tr key={'p' + index}><td><Password item={item} /></td></tr>;
        })}
        </tbody>
      </table>
    </div>
  );
};
const Password = props => {
	return <div>{JSON.stringify(props.item)}</div>;
};
const Usernames = props => {
	return <div>{JSON.stringify(props.item)}</div>;
};
const MoreLogins = props => {
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
							auth0.refreshToken(refreshToken, (err, delegationResult) => {
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
			<div id="content-area" className="tab-content">
				<PasswordTable data={this.state.passwordFailure} />
				<div id="username" className="tab-pane">
					<div>Top users with failed attempts because of usernames</div>
					<ul>
						{this.state.usernameFailure.map( (item, index) => {
							return <li key={'u' + index}><Password item={item} /></li>;
						})}
					</ul>
				</div>
				<div id="count" className="tab-pane">
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
