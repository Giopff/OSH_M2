import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const sidebarLinkStyle = {
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  };

  return (
    <div
      className="bg-light border-right sidebar d-flex flex-column"
      style={{
        height: '80vh',
        width: '250px',
        marginLeft: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
      }}
    >
      <div className="sidebar-heading mb-4">
        <h4 className="font-weight-bold text-primary">My App</h4>
      </div>
      <div className="list-group list-group-flush flex-grow-1 overflow-auto">
        <a
          href="#"
          className="list-group-item list-group-item-action bg-light my-2"
          style={sidebarLinkStyle}
        >
          <FontAwesomeIcon icon={faHome} className="mr-3" />
          Dashboard
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-light my-2"
          style={sidebarLinkStyle}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-3" />
          Users
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-light my-2"
          style={sidebarLinkStyle}
        >
          <FontAwesomeIcon icon={faChartBar} className="mr-3" />
          Analytics
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-light my-2"
          style={sidebarLinkStyle}
        >
          <FontAwesomeIcon icon={faCog} className="mr-3" />
          Settings
        </a>
      </div>
    </div>
  );
};

export default Sidebar;