import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Card, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import './MyCompanies.css';

const itemsPerPage = 11;

const MyCompanies = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [showOrganizationModal, setShowOrganizationModal] = useState(false);
  const [newOrganization, setNewOrganization] = useState({ name: '', description: '' });
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const [organizations, setOrganizations] = useState([]);

  const handleSelectedOrganizationChange = (value, field) => {
    setSelectedOrganization(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };
  
  const handleChange = (e) => {
    setNewOrganization({ ...newOrganization, [e.target.name]: e.target.value });
  };
  

  console.log(currentData);
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('http://localhost:5000/organizations', {
          headers: new Headers({
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }),
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const fetchedOrganizations = await response.json();
        setOrganizations(fetchedOrganizations);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);
  
  const fetchOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:5000/organizations', {
        headers: new Headers({
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const fetchedOrganizations = await response.json();
      setOrganizations(fetchedOrganizations);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBurgerMenuClick = (event, index) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenDropdownIndex(index === openDropdownIndex ? null : index);
  };

  const handleLinkClick = (event, index) => {
    if (openDropdownIndex !== null) {
      setOpenDropdownIndex(null);
    }
  };

  const handleUpdateOrganization = async (organization) => {

    if (!organization.id) {
      console.error('Organization ID is undefined.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/organizations/${organization.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(organization),
      });
      if (!response.ok) throw new Error('Failed to update organization');
      
      const updatedOrganization = await response.json();
      
      // Update the local state to reflect the change
      setOrganizations(prevOrgs => prevOrgs.map(org => 
        org.id === updatedOrganization.id ? updatedOrganization : org
      ));
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };
  

  // Function to create a new organization
  const handleCreateOrganization = async (organizationData) => {
    try {
      const response = await fetch('http://localhost:5000/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(organizationData),
      });
  
      if (!response.ok) throw new Error('Failed to create organization');
      
      // The server should respond with the created organization, including its ID
      const createdOrganization = await response.json();
      
      // Update the state to include the new organization
      setOrganizations(prevOrganizations => [
        ...prevOrganizations,
        createdOrganization
      ]);
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  // Unified submit function for both create and update actions
  // Unified submit function for both create and update actions
const handleOrganizationSubmit = async () => {
  // Check if we are updating an existing organization or creating a new one
  if (selectedOrganization && selectedOrganization.id) {
    await handleUpdateOrganization(selectedOrganization);
  } else {
    await handleCreateOrganization(newOrganization);
  }

  // Close the modal and reset form states
  setNewOrganization({ name: '', description: '' });
  setSelectedOrganization(null);
  setShowOrganizationModal(false);
  
  // Refetch the updated list of organizations
  await fetchOrganizations();
};

  

  // Function to delete an organization
  const handleDeleteOrganization = async (orgId) => {
    try {
      const response = await fetch(`http://localhost:5000/organizations/${orgId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete organization');
      // Remove the organization from the local state
      setOrganizations(organizations.filter(org => org.id !== orgId));
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };
  const editOrganization = (org) => {
    // When editing, make sure to set a copy of the organization object
    setSelectedOrganization({ ...org });
    setShowOrganizationModal(true);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <Button variant="link" className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </Button>
        </li>
      );
    }
    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">{pages}</ul>
      </nav>
    );
  };

  const renderCards = () => {
    // Calculate current page data
    const currentOrganizations = organizations.slice(startIndex, endIndex);
  
    const cards = currentOrganizations.map((org, index) => (
      <Col lg={4} xs={12} className="mb-4" key={org.id}>
        <Link
          to={`/organization/${org.id}`}
          className="card-link"
          onClick={(event) => handleLinkClick(event, index)}
        >
          <BurgerMenu
            handleBurgerMenuClick={(event) => handleBurgerMenuClick(event, index)}
            isOpen={openDropdownIndex === index}
            item={org}
          />
  
          <Card className="my-companies-card">
            <Card.Body>
              <Card.Title className="border-bottom pb-3">{org.name}</Card.Title>
              <Card.Text>{org.description}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    ));
    
    
  
    // Handle adding new organization card
    if (currentPage === 1) {
      cards.unshift(
        <Col lg={4} m={5} xs={12} className="mb-4" key="add-new">
          <div className="card-link" onClick={() => setShowOrganizationModal(true)}>
            <Card className="my-companies-card add-new-card">
              <Card.Body>
                <Card.Title className="border-bottom pb-3">ახალი ორგანიზაცია</Card.Title>
                <Card.Text>
                  დამატება <FontAwesomeIcon className="ms-1 add-organization" icon={faPlus} />
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Col>
      );
    }
  
    return cards;
  };
  

 const BurgerMenu = ({ handleBurgerMenuClick, isOpen, item }) => {
  return (
    <Dropdown className="burger-menu" show={isOpen} onToggle={() => setOpenDropdownIndex(null)}>
      <Dropdown.Toggle variant="link" id="burger-menu-dropdown" onClick={handleBurgerMenuClick}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item>
          <Button
            variant="primary"
            className="input-block-level form-control"
            onClick={() => {editOrganization(item)
            }}
          >
            რედაქტირება
          </Button>
        </Dropdown.Item>
        <Dropdown.Item>
          <Button
            variant="danger"
            className="input-block-level form-control"
            onClick={() => handleDeleteOrganization(item.id)}
          >
            წაშლა
          </Button>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};


  return (
    <div>
      <Container fluid className="mt-3">
        <Row className="justify-content-center main-card-container">
          <div className="card-container">
            <div className="card-content">
              <Row className="text-center">{renderCards()}</Row>
              <div className="pagination-container">{renderPagination()}</div>
            </div>
          </div>
        </Row>
<Modal show={showOrganizationModal} onHide={() => {
  setSelectedOrganization(null);
  setShowOrganizationModal(false);
}}>
  <Modal.Header closeButton>
    <Modal.Title>
      {selectedOrganization ? 'რედაქტირება' : 'ახალი ორგანიზაციის დამატება'}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="organizationName">
        <Form.Label>დასახელება:</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={selectedOrganization ? selectedOrganization.name : newOrganization.name}
          onChange={(e) => {
            selectedOrganization ? handleSelectedOrganizationChange(e.target.value, 'name') : handleChange(e)
          }}
        />
      </Form.Group>
      <Form.Group controlId="organizationDescription">
        <Form.Label>აღწერა:</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={selectedOrganization ? selectedOrganization.description : newOrganization.description}
          onChange={(e) => {
            selectedOrganization ? handleSelectedOrganizationChange(e.target.value, 'description') : handleChange(e)
          }}
        />
      </Form.Group>
    </Form>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => {
      setSelectedOrganization(null);
      setShowOrganizationModal(false);
    }}>
      გაუქმება
    </Button>
    <Button variant="primary" onClick={handleOrganizationSubmit}>
      შენახვა
    </Button>
  </Modal.Footer>
</Modal>
      </Container>
    </div>
  );
};

export default MyCompanies;