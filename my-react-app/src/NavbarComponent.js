import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Offcanvas } from 'react-bootstrap';
import './NavbarComponent.css'
import { Link } from 'react-router-dom'
const AppNavbar = () => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleOffcanvasToggle = () => setShowOffcanvas(!showOffcanvas);
    const handleOffcanvasClose = () => setShowOffcanvas(false);

    return (
        <>
            <Navbar bg="light" expand="lg" className="mb-3">
                <Container fluid>
                    <h1 className="logo-container">
                        <Link to="/">
                            <img className="logo" src="https://oshe.ge/images/custom/logo-light.png" alt="Logo" />
                        </Link>
                    </h1>
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
                                    <Nav.Link className='nav-item option' href="#">Option 1</Nav.Link>
                                    <NavDropdown className='nav-item option' title="Option2" id="offcanvas-dropdown" >
                                        <NavDropdown.Item className='dropdown-child' href="#">Dropdown Item 1</NavDropdown.Item>
                                        <NavDropdown.Item className='dropdown-child' href="#">Dropdown Item 2</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item className='dropdown-child' href="#">Dropdown Item 3</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link className='nav-item option' href="#">Option 3</Nav.Link>
                                </div>

                                <Nav>
                                    <div className="header-content header-content-right" id="header-content-right">
                                        <Link to="/LogIn" className="btn btn-primary me-2">შესვლა</Link>
                                        <Link to="/Register" className="btn">რეგისტრაცია</Link>
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

export default AppNavbar;