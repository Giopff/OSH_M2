import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CompanyFiles from './CompanyFiles';
import './CompanyFilesPage.css';
import ProfileHeader from './ProfileHeader';

const CompanyFilesPage = () => {

    const data = [
        { id: 1, date: '2022-02-17', title: 'File 1', description: 'Description for File 1' },
        { id: 2, date: '2022-02-17', title: 'File 2', description: 'Description for File 2' },
        { id: 3, date: '2022-02-16', title: 'File 3', description: 'Description for File 3' },
        { id: 4, date: '2022-02-16', title: 'File 4', description: 'Description for File 4' },
        { id: 5, date: '2022-02-15', title: 'File 5', description: 'Description for File 5' },
        { id: 6, date: '2022-02-17', title: 'File 1', description: 'Description for File 1' },
        { id: 7, date: '2022-02-11', title: 'File 2', description: 'Description for File 2' },
        { id: 8, date: '2022-02-16', title: 'File 3', description: 'Description for File 3' },
        { id: 9, date: '2022-02-13', title: 'File 4', description: 'Description for File 4' },
        { id: 10, date: '2022-02-15', title: 'File 5', description: 'Description for File 5' },
        { id: 11, date: '2022-02-27', title: 'File 1', description: 'Description for File 1' },
        { id: 12, date: '2022-02-15', title: 'File 2', description: 'Description for File 2' },
        { id: 13, date: '2022-02-11', title: 'File 3', description: 'Description for File 3' },
        { id: 14, date: '2022-02-12', title: 'File 4', description: 'Description for File 4' },
        { id: 15, date: '2022-02-13', title: 'File 5', description: 'Description for File 5' },
        { id: 16, date: '2022-02-14', title: 'File 1', description: 'Description for File 1' },
        { id: 17, date: '2022-02-15', title: 'File 2', description: 'Description for File 2' },
        { id: 18, date: '2022-02-16', title: 'File 3', description: 'Description for File 3' },
        { id: 19, date: '2022-02-17', title: 'File 4', description: 'Description for File 4' },
        { id: 20, date: '2022-02-18', title: 'File 5', description: 'Description for File 5' },
        { id: 21, date: '2022-02-17', title: 'File 1', description: 'Description for File 1' },
        { id: 22, date: '2022-02-17', title: 'File 2', description: 'Description for File 2' },
        { id: 23, date: '2022-02-16', title: 'File 3', description: 'Description for File 3' },
        { id: 24, date: '2022-02-16', title: 'File 4', description: 'Description for File 4' },
        { id: 25, date: '2022-02-15', title: 'File 5', description: 'Description for File 5' }
    ];

    return (
        <div className="company-files-page">
            <ProfileHeader></ProfileHeader>
            <Container >
                <Row>

                </Row>
                <Row>
                    <Col>
                        <CompanyFiles data={data} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CompanyFilesPage;