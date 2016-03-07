import React from 'react';
import md5 from 'md5';
import Spinner from '../spinner/spinner.js';

const UsernameTable = props => {
  let content = <Spinner />;
  if (props.data != null) {
    content = (
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
    );
  }
  return (
    <div id="username" className="tab-pane">
      <div>Top users with failed attempts because of usernames</div>
      {content}
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

export default UsernameTable;
