import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
import './DangersDocument.css';
import DangersTableOne from './DangersTableOne';

const Dangers = [
  { id: 1, name: 'High Blood Pressure' },
  { id: 2, name: 'Bad Fire System' },
  { id: 3, name: 'Slippery Floor' },
  { id: 4, name: 'Electrical Hazards' },
  { id: 5, name: 'Chemical Exposure' },
  { id: 6, name: 'Noise Pollution' },
  { id: 7, name: 'Poor Ventilation' },
  { id: 8, name: 'Ergonomic Issues' },
  { id: 9, name: 'Lack of Safety Equipment' },
  { id: 10, name: 'Inadequate Lighting' },
  { id: 11, name: 'Biological Hazards' },
  { id: 12, name: 'Stress and Fatigue' },
];

const itemsPerPage = 12;

const DangersDocument = ({ name, fieldOfWork, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDanger, setSelectedDanger] = useState(null);
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    if (1) {
      fetch(`http://localhost:5000/api/risks/by-field?field_of_work=სკოლა`)
        .then(response => response.json())
        .then(data => {
          console.log('Risks fetched:', data);  // Console log the fetched risks
          setRisks(data);
        })
        .catch(error => console.error('Error fetching risks:', error));
    }
  }, [fieldOfWork]);

  const filteredDangers = Dangers.filter((danger) =>
    danger.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDangers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDangers = filteredDangers.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDangerSelect = (danger) => {
    setSelectedDanger(danger);
  };

  const handleBackToDangers = () => {
    setSelectedDanger(null);
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

  return (
    <div className="dangers-document">
      <Container className="dangers-container">
        {selectedDanger ? (
          <DangersTableOne
            danger={selectedDanger}
            onBack={handleBackToDangers}
          />
        ) : (
          <>
            <Row className='d-flex justify-content-between border-bottom'>
              <h2 className="text-center mb-4">აირჩიეთ საფთხე</h2>
              <div className="search-container d-flex align-items-center">
                <div className='me-4'>საფრთხეების გაფილტვრა:</div>
                <Form.Group controlId="searchTerm w-50">
                  <div className="search-input">
                    <Form.Control
                      id="filter-dangers"
                      type="text"
                      placeholder="მოძებნეთ საფრთხე..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  </div>
                </Form.Group>
              </div>
            </Row>
            <Row className="justify-content-center mt-4">
              {currentDangers.map((danger) => (
                <Col lg={4} md={6} sm={12} key={danger.id} className="mb-4">
                  <Card className="danger-card" onClick={() => handleDangerSelect(danger)}>
                    <Card.Body>
                      <div className="danger-icon">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                      </div>
                      <Card.Title>{danger.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {renderPagination()}
            <Button variant="secondary" onClick={onBack}>
              უკან
            </Button>
          </>
        )}
      </Container>
    </div>
  );
};

export default DangersDocument;