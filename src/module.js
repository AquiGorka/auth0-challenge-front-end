import React from 'react';
import $ from 'jquery';
import Auth0Lock from 'auth0-lock';
import Auth0 from 'auth0-js';
import config from '../config.js';
import Spinner from './components/spinner/spinner.js';
import PasswordTable from './components/password-failure/password-failure.js';
import UsernameTable from './components/username-failure/username-failure.js';
import LoginTable from './components/login-count/login-count.js';
import Search from './components/search/search.js';

const auth0Lock = new Auth0Lock(config.clientID, config.domain);
const auth0 = new Auth0({clientID: config.clientID, domain: config.domain});

const NavBars = props => {
  return (
      <div className="widget-title title-with-nav-bars">
        <ul className="nav nav-tabs">
          <li className="active"><a data-toggle="tab" href="#password" aria-expanded="true"><span className="tab-title">Passwords</span></a></li>
          <li><a data-toggle="tab" href="#username"><span className="tab-title">Usernames</span></a></li>
          <li><a data-toggle="tab" href="#count"><span className="tab-title">Login Count</span></a></li>
        </ul>
      </div>
  );
};

class Data extends React.Component {
	constructor(props) {
		super(props);
		//
		this.state = { passwordFailure: null, usernameFailure: null, loginCount: null, filter: null };
	}
  //
  _onChange(value) {
    this.setState({ filter: value });
  }
  //
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
  //
	render() {
    return (
      <div>
        <Search onChange={this._onChange.bind(this)} filter={this.state.filter} />
        <NavBars />
  			<div id="content-area" className="tab-content">
  				<PasswordTable data={this.state.passwordFailure} filter={this.state.filter} />
          <UsernameTable data={this.state.usernameFailure} filter={this.state.filter} />
  				<LoginTable data={this.state.loginCount} filter={this.state.filter} />
        </div>
      </div>
		);
	}
};

export default class Login extends React.Component {
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
				console.warn("Error signing in: ", authHash);
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
  //
	render() {
		let content = <Spinner />;
		if (this.state.idToken) {
			content = <Data />;
		}
		return content;
	}
};
