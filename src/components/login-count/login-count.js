import React from 'react';
import md5 from 'md5';

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
              <th dataColumn="attempts" className="pointer"># of Logins</th>
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

export default LoginTable;