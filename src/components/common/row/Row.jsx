import React from 'react';

const Row = ({ label, children }) => {
  return (
    <div className="row">
      <h2 className="label">
        <hr/>
        <span className="label-itself">{label}</span>
        <hr/>
      </h2>
      <div className="content">{children}</div>
    </div>
  );
};


export default Row;
