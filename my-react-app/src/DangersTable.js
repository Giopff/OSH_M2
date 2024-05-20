import React from 'react';
import { Card, Table, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './DangersTable.css';

const categoryOrder = [
    'Elimination',
    'Lessening',
    'Isolating',
    'Administrative control',
    'Individual protection',
];

const DangersTable = ({ existingMechanisms, additionalMechanisms }) => {
    const sortedAdditionalMechanisms = [...additionalMechanisms].sort((a, b) => {
        const categoryA = categoryOrder.indexOf(a.category);
        const categoryB = categoryOrder.indexOf(b.category);
        return categoryA - categoryB;
    });

    return (
        <Card className="dangers-table">
            <Card.Body>
                <Table bordered responsive className="w-100">
                    <thead>
                        <tr>
                            <th>Existing Control Mechanisms</th>
                            <th colSpan={3}>Existing Risk</th>
                            <th>Additional Control Mechanisms</th>
                            <th colSpan={3}>Risk Left</th>
                            <th>Revision Date</th>
                        </tr>
                        <tr>
                            <th></th>
                            <th>P</th>
                            <th>R</th>
                            <th>Risk Level</th>
                            <th></th>
                            <th>P</th>
                            <th>R</th>
                            <th>Risk Level</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {existingMechanisms.map((mechanism) => (
                                    <div key={mechanism.id} className="mechanism-item bg-success text-white">
                                        <div className="d-flex align-items-center justify-content-center mb-2">
                                            <FontAwesomeIcon
                                                icon={faExclamationTriangle}
                                                className="text-white me-2"
                                            />
                                            <span>{mechanism.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </td>
                            <td colSpan={3}></td>
                            <td>
                                {sortedAdditionalMechanisms.map((mechanism) => (
                                    <div key={mechanism.id} className="mechanism-item bg-warning text-dark">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon
                                                    icon={faExclamationTriangle}
                                                    className="text-dark me-2"
                                                />
                                                <span>{mechanism.name}</span>
                                            </div>
                                            <span className="text-muted">{mechanism.category}</span>
                                        </div>
                                        <div className="mechanism-fields">
                                            <Form.Group controlId={`personResponsible-${mechanism.id}`}>
                                                <Form.Label>
                                                    Person Responsible 
                                                </Form.Label>
                                                <Form.Control type="text" required />
                                            </Form.Group>
                                            <Form.Group controlId={`completionDate-${mechanism.id}`}>
                                                <Form.Label>
                                                    Completion Date 
                                                </Form.Label>
                                                <Form.Control type="date" required />
                                            </Form.Group>
                                        </div>
                                    </div>
                                ))}
                            </td>
                            <td colSpan={3}></td>
                            <td>
                                <Form.Group controlId="revisionDate">
                                    <Form.Label>
                                        Revision Date <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control type="date" required />
                                </Form.Group>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default DangersTable;