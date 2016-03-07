import React from 'react';
import md5 from 'md5';

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

export default PasswordTable;
