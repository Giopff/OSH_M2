import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faUpload } from '@fortawesome/free-solid-svg-icons';
import DangersTableTwo from './DangersTableTwo';
import './DangersTableOne.css';

const DangersTableOne = ({ danger, onBack }) => {
  const [image, setImage] = useState(null);
  const [damageType, setDamageType] = useState('');
  const [responsiblePeople, setResponsiblePeople] = useState('');
  const [showTableTwo, setShowTableTwo] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleContinue = () => {
    setShowTableTwo(true);
  };

  const handleBackToTableOne = () => {
    setShowTableTwo(false);
  };

  return (
    <Container className="dangers-table-one">
      {!showTableTwo ? (
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">{danger.name}</h3>
                <Form>
                  <Form.Group controlId="image" className="mb-4">
                    <Form.Label>საფრთხის სურათი:</Form.Label>
                    <div className="image-preview-container">
                      {previewUrl ? (
                        <div className="image-preview">
                          <Image src={previewUrl} alt="Preview" fluid />
                        </div>
                      ) : (
                        <div className="image-placeholder">
                          <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                          <span>ატვირთეთ საფრთხის სურათი</span>
                        </div>
                      )}
                      <Form.Control type="file" onChange={handleImageUpload} />
                    </div>
                  </Form.Group>
                  <Form.Group controlId="damageType" className="mb-4">
                    <Form.Label>შესაძლო ზიანი/ზიანის ტიპი:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={damageType}
                      onChange={(e) => setDamageType(e.target.value)}
                      placeholder="აღწერეთ შესაძლო ზიანი ან ზიანის ტიპი"
                    />
                  </Form.Group>
                  <Form.Group controlId="responsiblePeople" className="mb-4">
                    <Form.Label>პასუხისმგებელი პირები:</Form.Label>
                    <Form.Control
                      type="text"
                      value={responsiblePeople}
                      onChange={(e) => setResponsiblePeople(e.target.value)}
                      placeholder="მიუთითეთ პასუხისმგებელი პირები"
                      required
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={onBack}>
                      <FontAwesomeIcon icon={faArrowLeft} /> უკან
                    </Button>
                    <Button variant="primary" onClick={handleContinue}>
                      გაგრძელება <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <DangersTableTwo
          danger={danger}
          image={image}
          damageType={damageType}
          responsiblePeople={responsiblePeople}
          onBack={handleBackToTableOne}
        />
      )}
    </Container>
  );
};

export default DangersTableOne;