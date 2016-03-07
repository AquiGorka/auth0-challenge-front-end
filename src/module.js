import React from 'react';
import $ from 'jquery';
import Auth0Lock from 'auth0-lock';
import Auth0 from 'auth0-js';
import config from '../config.js';
import styles from './module.styl';
import md5 from 'md5';

const auth0Lock = new Auth0Lock(config.clientID, config.domain);
const auth0 = new Auth0({clientID: config.clientID, domain: config.domain});

const Spinner = props => {
  return <div>spinner</div>;
};

const PasswordTable = props => {
  return (
    <div id="password" className="tab-pane active">
      <div>Top users with failed attempts because of password</div>
      <div className="dataTables_wrapper" role="grid">
        <table className="table data-table dataTable">
          <thead>
            <tr>
              <th dataColumn="picture"></th>
              <th dataColumn="name" className="pointer">Name</th>
              <th dataColumn="email" className="pointer">Email</th>
              <th dataColumn="attempts" className="pointer"># of Attempts</th>
              <th className="pointer"></th>
            </tr>
          </thead>
          <tbody>
          {props.data.map( (item, index) => {
            return <PasswordItem key={index} item={item} />;
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const PasswordItem = props => {
	return (
    <tr>
      <td>
        <a href={props.item.url_dashboard}>
          <img className="img-circle" src={'https://s.gravatar.com/avatar/' + md5(props.item.email)} alt={props.item} width="32" />
        </a>
      </td>
      <td className="truncate" title={props.item.email}>
        <a href={props.item.url_dashboard}>
          {props.item.user_name}
        </a>
      </td>
      <td className="truncate" title={props.item.email}>{props.item.email}</td>
      <td>{props.item.failed_pass}</td>
      <td className='actions'>
        <a href={'mailto:' + props.item.email}>
          <i className='icon-budicon-778'></i>
        </a>
      </td>
    </tr>
  );
};

const UsernameTable = props => {
  return (
    <div id="username" className="tab-pane">
      <div>Top users with failed attempts because of usernames</div>
      <div className="dataTables_wrapper" role="grid">
        <table className="table data-table dataTable">
          <thead>
            <tr>
              <th dataColumn="picture"></th>
              <th dataColumn="name" className="pointer">Name</th>
              <th dataColumn="attempts" className="pointer"># of Attempts</th>
              <th className="pointer"></th>
            </tr>
          </thead>
          <tbody>
          {props.data.map( (item, index) => {
            return <UsernameItem key={index} item={item} />;
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const UsernameItem = props => {
  return (
    <tr>
      <td>
        <a href={props.item.url_dashboard}>
          <img className="img-circle" src={'https://s.gravatar.com/avatar/' + md5(props.item.email)} alt={props.item} width="32" />
        </a>
      </td>
      <td className="truncate" title={props.item.email}>
        <a href={props.item.url_dashboard}>
          {props.item.user_name}
        </a>
      </td>
      <td>{props.item.failed_user}</td>
      <td className='actions'>
        <a href={'mailto:' + props.item.email}>
          <i className='icon-budicon-778'></i>
        </a>
      </td>
    </tr>
  );
};

const LoginTable = props => {
  return (
    <div id="count" className="tab-pane">
      <div>Top users with more logins</div>
      <div className="dataTables_wrapper" role="grid">
        <table className="table data-table dataTable">
          <thead>
            <tr>
              <th dataColumn="picture"></th>
              <th dataColumn="name" className="pointer">Name</th>
              <th dataColumn="email" className="pointer">Email</th>
              <th dataColumn="attempts" className="pointer"># of Attempts</th>
              <th className="pointer"></th>
            </tr>
          </thead>
          <tbody>
          {props.data.map( (item, index) => {
            return <LoginItem key={index} item={item} />;
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const LoginItem = props => {
  return (
    <tr>
      <td>
        <a href={props.item.url_dashboard}>
          <img className="img-circle" src={'https://s.gravatar.com/avatar/' + md5(props.item.email)} alt={props.item} width="32" />
        </a>
      </td>
      <td className="truncate" title={props.item.email}>
        <a href={props.item.url_dashboard}>
          {props.item.user_name}
        </a>
      </td>
      <td className="truncate" title={props.item.email}>{props.item.email}</td>
      <td>{props.item.logins}</td>
      <td className='actions'>
        <a href={'mailto:' + props.item.email}>
          <i className='icon-budicon-778'></i>
        </a>
      </td>
    </tr>
  );
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
        <UsernameTable data={this.state.usernameFailure} />
				<LoginTable data={this.state.loginCount} />
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
