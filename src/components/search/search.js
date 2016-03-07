import React from 'react';
import styles from './styles.styl';

export default props => {
    return (
      <div className={styles.wrapper}>
        <div className="js-users-search advanced-search-control">
          <span className="search-area">
            <i className="icon-budicon-489"></i>
            <input value={props.filter} className="js-user-input user-input" type="text" placeholder="Filter by name" spellCheck="false" onInput={ e => { props.onChange(e.target.value) }} />
          </span>
          <span className="controls pull-right">
            <button type="reset" onClick={ () => props.onChange(null) }>
              Reset <i className="icon-budicon-471"></i>
            </button>
          </span>
        </div>
      </div>
    );
};
