import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Pagination, Button, Dropdown, Form } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown, faChevronRight, faCopy, faEllipsisV, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CompanyFiles.css';

const CompanyFiles = ({}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const datesPerPage = 6;
  const [data, setData] = useState([]);


  const { orgId } = useParams();  // This assumes your route is something like `/organization/:orgId`

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/organizations/${orgId}/documents`, {
          headers: new Headers({
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        });
        if (!response.ok) throw new Error('Failed to fetch documents');
        const documents = await response.json();
        console.log("Fetched documents:", documents);
        setData(documents);  // Assuming you have a state called `data` to hold the fetched documents
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [orgId]);  

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    const start = startDate ? parseISO(startDate) : null;
    const end = endDate ? parseISO(endDate) : null;

    if (start && end) {
      return itemDate >= start && itemDate <= end;
    } else if (start) {
      return itemDate >= start;
    } else if (end) {
      return itemDate <= end;
    }
    return true;
  });

  const groupedData = filteredData.reduce((acc, item) => {
    const date = format(new Date(item.date), 'dd/MM/yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

  const indexOfLastDate = currentPage * datesPerPage;
  const indexOfFirstDate = indexOfLastDate - datesPerPage;
  const currentDates = sortedDates.slice(indexOfFirstDate, indexOfLastDate);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleFilter = () => {
    setCurrentPage(1);
  };

  const renderFiles = (files) => {
    return files.map((file, index) => (
      <Col key={index} md={4} className="mb-4">
        <Link to={`/file/${file.id}`} className="card-link" onClick={(event) => handleLinkClick(event, index)}>
          <BurgerMenu
            handleBurgerMenuClick={(event) => handleBurgerMenuClick(event, index)}
            isOpen={openDropdownIndex === index}
            file={file}
          />
          <Card className="files-card">
            <Card.Body className="text-center">
              <Card.Title className="border-bottom pb-3">{file.title}</Card.Title>
              <Card.Text>{file.description}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    ));
  };

  const BurgerMenu = ({ handleBurgerMenuClick, isOpen, file }) => {
    return (
      <Dropdown className="burger-menu" show={isOpen} onToggle={() => setOpenDropdownIndex(null)}>
        <Dropdown.Toggle variant="link" id="burger-menu-dropdown" onClick={handleBurgerMenuClick}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Item>
            <Button variant="primary" className="input-block-level form-control">
              რედაქტირება
            </Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Button variant="danger" className="input-block-level form-control">
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
        <div className="card-container">
          <div className="card-content">
            <Row className="mb-4 filtration border-bottom pb-4 d-flex justify-content-around mt-1">
              <Col md={4} className="d-flex align-items-center justify-content-center">
                <h5>
                  ობიექტის სახელი
                </h5>
              </Col>
              <Col md={4} className='mb-2'>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                />
              </Col>
              <Col md={4} className='mb-2'>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                />
              </Col>
            </Row>
            {currentPage === 1 && (
              <Row className="mb-4">
                <Col md={6} className="text-center mb-3">
                  <Link to="/NewDocument" className="card-link">
                    <Card className="add-new-card">
                      <Card.Body>
                        <Card.Title>
                          ახალი ფაილის შექმნა <FontAwesomeIcon className="ms-1 add-organization" icon={faPlus} />
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col md={6} className="text-center mb-3">
                  <Link to="/copy-file" className="card-link">
                    <Card className="add-new-card">
                      <Card.Body>
                        <Card.Title>
                          არსებული ფაილის კოპირება <FontAwesomeIcon className="ms-1 add-organization" icon={faCopy} />
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              </Row>
            )}
            {currentDates.map((date) => (
              <div key={date}>
                <Row
                  className={`date-header ${selectedDate === date ? 'active' : ''}`}
                  onClick={() => setSelectedDate(date === selectedDate ? null : date)}
                >
                  <Col className="text-center d-flex align-items-center justify-content-center">
                    <h5 className="mb-0 me-2">{date}</h5>
                    <FontAwesomeIcon
                      icon={selectedDate === date ? faChevronDown : faChevronRight}
                      className="arrow-icon"
                    />
                  </Col>
                </Row>
                {selectedDate === date && <Row>{renderFiles(groupedData[date])}</Row>}
              </div>
            ))}
          </div>
          <Pagination className="d-flex justify-content-center">
            {Array.from({ length: Math.ceil(sortedDates.length / datesPerPage) }).map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </Container>
    </div>
  );
};

export default CompanyFiles;