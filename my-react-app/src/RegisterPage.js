import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './NavbarComponent';
import { Link } from 'react-router-dom'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setShowAlert(true);
      return;
  }
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration. Please check your connection and try again.');
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
            <NavbarComponent></NavbarComponent>

            <div className="container-fluid flex-grow-1 overflow-auto ">
                <div className="row justify-content-center mt-5">
                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card  position-relative" style={{ width: '100%' }}>
                            {showAlert && (
                                <div className="alert alert-danger d-flex justify-content-center align-self-center align-items-center w-100  position-absolute" role="alert">
                                    <div>
                                        პაროლები არ ემთხვევა!
                                    </div>
                                </div>
                            )}
                            <div className="card-body">
                                <h5 className="card-title text-center mb-4">რეგისტრაცია</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className='row mb-3'>
                                        <div className="form-group col">
                                            <label htmlFor="FirstName" className='mb-1'>სახელი:</label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control"
                                                id="FirstName"
                                                placeholder="შეიყვანეთ სახელი"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group col">
                                            <label htmlFor="LastName" className='mb-1'>გვარი:</label>
                                            <input
                                                required
                                                type="text"
                                                className="form-control"
                                                id="LastName"
                                                placeholder="შეიყვანეთ გვარი"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email" className='mb-1'>ელ-ფოსტის მისამართი:</label>
                                        <input
                                            required
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="შეიყვანეთ ელ-ფოსტის მისამართი"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="phone" className='mb-1'>ტელეფონის ნომერი:</label>
                                        <input
                                            required
                                            type="tel"
                                            className="form-control"
                                            id="phone number"
                                            placeholder="შეიყვანეთ ნომერი"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group mb-3" >
                                        <label htmlFor="password" className='mb-1'>პაროლი:</label>
                                        <input
                                            required
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder='შეიყვანეთ პაროლი'
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="confirmPassword" className='mb-1'>გაიმეორეთ პაროლი:</label>
                                        <input
                                            required
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            placeholder="გაიმეორეთ პაროლი"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block w-100 mt-2">
                                        რეგისტრაცია
                                    </button>
                                    <div className="text-center my-2">
                                        <span className="text-muted">ან</span>
                                    </div>
                                    <Link to="/LogIn" className="btn btn-secondary btn-block w-100" id="login-button">
                                        შესვლა
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default Register;
