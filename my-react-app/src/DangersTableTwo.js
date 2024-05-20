import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DangersTable from './DangersTable';
import ControlMechanisms from './ControlMechanisms';
import './DangersTableTwo.css';

const DangersTableTwo = ({ danger }) => {
    const [existingMechanisms, setExistingMechanisms] = useState([]);
    const [additionalMechanisms, setAdditionalMechanisms] = useState([]);
    const navigate = useNavigate();

    const handleMechanismSelection = (mechanism, option) => {
        if (option === 'yes') {
            setExistingMechanisms((prevMechanisms) => [...prevMechanisms, mechanism]);
            setAdditionalMechanisms((prevMechanisms) =>
                prevMechanisms.filter((m) => m.id !== mechanism.id)
            );
        } else if (option === 'no') {
            setAdditionalMechanisms((prevMechanisms) => [...prevMechanisms, mechanism]);
            setExistingMechanisms((prevMechanisms) =>
                prevMechanisms.filter((m) => m.id !== mechanism.id)
            );
        } else if (option === 'not-required') {
            setExistingMechanisms((prevMechanisms) =>
                prevMechanisms.filter((m) => m.id !== mechanism.id)
            );
            setAdditionalMechanisms((prevMechanisms) =>
                prevMechanisms.filter((m) => m.id !== mechanism.id)
            );
        }
    };

    const handleRemoveMechanism = (mechanismId) => {
        setExistingMechanisms((prevMechanisms) =>
            prevMechanisms.filter((m) => m.id !== mechanismId)
        );
        setAdditionalMechanisms((prevMechanisms) =>
            prevMechanisms.filter((m) => m.id !== mechanismId)
        );
    };

    const handleContinue = () => {
        navigate('/DangersDocument');
    };

    return (
        <Container className="dangers-table-two">
            <Row>
                <Col>
                    <h2>{danger.name}</h2>
                    <DangersTable
                        existingMechanisms={existingMechanisms}
                        additionalMechanisms={additionalMechanisms}
                    />
                    <ControlMechanisms
                        danger={danger}
                        onMechanismSelection={handleMechanismSelection}
                        existingMechanisms={existingMechanisms}
                        additionalMechanisms={additionalMechanisms}
                        onRemoveMechanism={handleRemoveMechanism}
                    />
                    <div className="text-center mt-4">
                        <Button variant="primary" size="lg" onClick={handleContinue}>
                            Continue and Choose Another Danger
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default DangersTableTwo;