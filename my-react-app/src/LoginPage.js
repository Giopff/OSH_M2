import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import NavbarComponent from './NavbarComponent';

import { Link } from 'react-router-dom'


function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login Success:', data);
        localStorage.setItem('token', data.token);
        navigate('/my-organizations');
      } else {
        const errorData = await response.json();
        console.log('Login Failed:', errorData);
        alert('Failed to login. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login. Please check your connection and try again.');
    }
  };


  return (
    <div className="d-flex flex-column vh-100">
      <NavbarComponent></NavbarComponent>
      <div className="container-fluid flex-grow-1 overflow-auto">
        <div className="row justify-content-center mt-5">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="card" style={{ width: '100%' }}>
              <div className="card-body">
                <h5 className="card-title text-center mb-4">შესვლა</h5>
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="email" className='mb-1'>ელ-ფოსტა:</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      className="form-control"
                      id="email"
                      placeholder="შეიყვანეთ ელ-ფოსტა"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password" className='mb-1'>პაროლი:</label>
                    <input
                      required
                      type="password"
                      className="form-control"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      id="password"
                      placeholder="შეიყვანეთ პაროლი"
                    />
                  </div>
                  <div className="text-right mb-3">
                    <a href="#" className="text-muted">
                      დაგავიწყდათ პაროლი?
                    </a>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block w-100 mt-2">
                    შესვლა
                  </button>
                  <div className="text-center my-2">
                    <span className="text-muted">ან</span>
                  </div>
                  <Link to="/Register" className="btn btn-secondary btn-block w-100" id="login-button">
                    რეგისტრაცია
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

export default Login;
