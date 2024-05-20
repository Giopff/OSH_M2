import React, { useState } from 'react';
import { Card, ListGroup, ListGroupItem, Form, Pagination } from 'react-bootstrap';
import './ControlMechanisms.css';

const ControlMechanisms = ({
    danger,
    onMechanismSelection,
    existingMechanisms,
    additionalMechanisms,
    onRemoveMechanism,
}) => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const controlMechanisms = [
        { id: 1, name: 'Get a medkit', category: 'Individual protection' },
        { id: 2, name: 'Hire a doctor', category: 'Administrative control' },
        { id: 3, name: 'Isolate wires', category: 'Isolating' },
        { id: 4, name: 'Provide safety training', category: 'Administrative control' },
        { id: 5, name: 'Use protective gear', category: 'Individual protection' },
        { id: 6, name: 'Install safety barriers', category: 'Isolating' },
        { id: 7, name: 'Implement emergency protocols', category: 'Administrative control' },
        { id: 8, name: 'Conduct regular inspections', category: 'Elimination' },
        { id: 9, name: 'Use non-slip flooring', category: 'Lessening' },
        { id: 10, name: 'Provide first-aid kits', category: 'Individual protection' },
    ];

    const mechanismsPerPage = 5;
    const totalPages = Math.ceil(controlMechanisms.length / mechanismsPerPage);

    const handleOptionChange = (mechanismId, option) => {
        setSelectedOptions((prevOptions) => ({
            ...prevOptions,
            [mechanismId]: option,
        }));

        const selectedMechanism = controlMechanisms.find(
            (mechanism) => mechanism.id === mechanismId
        );
        onMechanismSelection(selectedMechanism, option);

        if (option === 'not-required') {
            onRemoveMechanism(mechanismId);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderMechanisms = () => {
        const startIndex = (currentPage - 1) * mechanismsPerPage;
        const endIndex = startIndex + mechanismsPerPage;
        const currentMechanisms = controlMechanisms.slice(startIndex, endIndex);

        return currentMechanisms.map((mechanism) => (
            <ListGroupItem
                key={mechanism.id}
                className={`d-flex justify-content-between align-items-center ${
                    selectedOptions[mechanism.id] === 'yes' ? 'bg-success text-white' :
                    selectedOptions[mechanism.id] === 'no' ? 'bg-warning text-dark' :
                    ''
                }`}
            >
                <div>{mechanism.name}</div>
                <Form className="control-mechanisms-form">
                    <Form.Check
                        className="control-mechanisms-option"
                        type="radio"
                        id={`yes-${mechanism.id}`}
                        label="Yes"
                        checked={selectedOptions[mechanism.id] === 'yes'}
                        onChange={() => handleOptionChange(mechanism.id, 'yes')}
                        disabled={existingMechanisms.some((m) => m.id === mechanism.id)}
                    />
                    <Form.Check
                        className="control-mechanisms-option"
                        type="radio"
                        id={`no-${mechanism.id}`}
                        label="No"
                        checked={selectedOptions[mechanism.id] === 'no'}
                        onChange={() => handleOptionChange(mechanism.id, 'no')}
                        disabled={additionalMechanisms.some((m) => m.id === mechanism.id)}
                    />
                    <Form.Check
                        className="control-mechanisms-option"
                        type="radio"
                        id={`not-required-${mechanism.id}`}
                        label="Not Required"
                        checked={selectedOptions[mechanism.id] === 'not-required'}
                        onChange={() => handleOptionChange(mechanism.id, 'not-required')}
                    />
                </Form>
            </ListGroupItem>
        ));
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        return <Pagination>{pages}</Pagination>;
    };

    return (
        <div className="control-mechanisms">
            <Card>
                <Card.Header as="h5" className="text-center bg-primary text-white">
                    Control Mechanisms
                </Card.Header>
                <ListGroup variant="flush">{renderMechanisms()}</ListGroup>
            </Card>
            <div className="pagination-container">{renderPagination()}</div>
        </div>
    );
};

export default ControlMechanisms;