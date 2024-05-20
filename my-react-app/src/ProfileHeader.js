import React, { useState } from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileHeader.css';

const ProfileHeader = (props) => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const navigate = useNavigate();

    const handleOffcanvasToggle = () => setShowOffcanvas(!showOffcanvas);
    const handleOffcanvasClose = () => setShowOffcanvas(false);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/LogIn'); // Use navigate to redirect to login page
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="mb-3">
                <Container fluid>
                    <h5>{props.fname} {props.lname}</h5>
                    <Navbar.Toggle aria-controls="navbar-nav" onClick={handleOffcanvasToggle} />
                    <Navbar.Offcanvas
                        show={showOffcanvas}
                        onHide={handleOffcanvasClose}
                        placement="end"
                        scroll={true}
                        backdrop={false}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-between flex-grow-1 pe-3 menu-items" >
                                <br></br>
                                <div className='options'>
                                    <Link to="/my-organizations" className='nav-link option'>ჩემი ორგანიზაციები</Link>
                                    <Link to="/MyProfile" className='nav-link option'>ჩემი პროფილი</Link>
                                </div>
                                <Nav>
                                    <div className="header-content header-content-right" id="header-content-right">
                                        <button onClick={handleLogout} className="btn btn-danger me-2">გასვლა</button>
                                    </div>
                                </Nav>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
};

export default ProfileHeader;
