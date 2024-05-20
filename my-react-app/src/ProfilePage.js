import React, { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader'
import Sidebar from './Sidebar';
import MyCompanies from './MyCompanies';
import { alignPropType } from 'react-bootstrap/esm/types';

function Profile() {
  const [userDetails, setUserDetails] = useState({ name: '', lastName: '' });
  const data = [
    { title: 'Item 1', description: 'This is item 1' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 1', description: 'This is item 1' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
    { title: 'Item 2', description: 'This is item 2' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/profile', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).catch(error => { console.error('AAAAAAA', error) })
      .then(data => {
        console.log('Profile data:', data);
        setUserDetails({ name: data.name, lastName: data.last_name });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error)
      });
  }, []);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: 'column',
    }

    }>
      <ProfileHeader fname={userDetails.name} lname={userDetails.lastName} />
      <MyCompanies data={data} />
    </div>
  );
}

export default Profile;
