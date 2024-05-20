import React, { useState } from "react";
import ProfileHeader from './ProfileHeader';
import DocumentHeader from "./DocumentHeader";
import DangersDocument from "./DangersDocument";
import { useNavigate } from 'react-router-dom';

export function NewDocument() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [fieldOfWork, setFieldOfWork] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [revisionDate, setRevisionDate] = useState('');
  const [showDangersDocument, setShowDangersDocument] = useState(false);

  const handleContinue = () => {
    const orgId = 2; // This should be dynamically determined
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    const postData = {
      name: name,
      evaluator: companyName,
      place_name: companyAddress,
      address: companyAddress,
      field_of_work: fieldOfWork,
      summary: workDescription,
      date: revisionDate
    };

    fetch(`http://localhost:5000/organizations/${orgId}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.id) {  // Check if data and id are available
        navigate(`/organization/${orgId}/document/${data.id}`);
      } else {
        console.error('Failed to create document:', data);
      }
    })
    .catch(error => {
      console.error('Error posting document:', error);
    });
  };


  const handleBack = () => {
    setShowDangersDocument(false);
  };

  return (
    <div>
      <ProfileHeader />
      {!showDangersDocument ? (
        <DocumentHeader
          name={name}
          setName={setName}
          companyName={companyName}
          setCompanyName={setCompanyName}
          companyAddress={companyAddress}
          setCompanyAddress={setCompanyAddress}
          fieldOfWork={fieldOfWork}
          setFieldOfWork={setFieldOfWork}
          workDescription={workDescription}
          setWorkDescription={setWorkDescription}
          revisionDate={revisionDate}
          setRevisionDate={setRevisionDate}
          onContinue={handleContinue}
        />
      ) : (
        <DangersDocument
          name={name}
          fieldOfWork={fieldOfWork}
          onBack={handleBack}
        />
      )}
    </div>
  );
}