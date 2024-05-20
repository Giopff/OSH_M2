import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './DocumentHeader.css';

const fieldOfWorkOptions = ['Construction', 'School', 'Retail', 'Healthcare', 'Manufacturing', 'Technology', 'Finance'];

const DocumentHeader = ({
  name,
  setName,
  companyName,
  setCompanyName,
  companyAddress,
  setCompanyAddress,
  fieldOfWork,
  setFieldOfWork,
  workDescription,
  setWorkDescription,
  revisionDate,
  setRevisionDate,
  onContinue,
}) => {
  const [fieldOfWorkError, setFieldOfWorkError] = useState('');
  const [fileName, setFileName] = useState('');

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : fieldOfWorkOptions.filter(option =>
      option.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const [suggestions, setSuggestions] = useState([]);

  const renderSuggestion = (suggestion, { query, isHighlighted }) => (
    <div className={`suggestion ${isHighlighted ? 'suggestion-highlighted' : ''}`}>
      {suggestion}
    </div>
  );

  const inputProps = {
    placeholder: 'Field of Work',
    value: fieldOfWork,
    onChange: (_, { newValue }) => setFieldOfWork(newValue),
    className: 'form-control',
  };

  const validateFieldOfWork = () => {
    if (!fieldOfWorkOptions.includes(fieldOfWork)) {
      setFieldOfWorkError('Please select a valid field of work.');
    } else {
      setFieldOfWorkError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFieldOfWork();
    if (fieldOfWorkError === '' && fileName !== '') {
      onContinue();
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center mb-4">დოკუმენტის შექმნა</h5>
              <p className="text-center">{getCurrentDate()}</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="fileName" className="mb-1">დოკუმენტის სახელი:</label>
                  <input type="text" className="form-control" id="fileName" value={fileName} onChange={e => setFileName(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="name" className="mb-1">შემფასებლის(ების) სახელი და გვარი:</label>
                  <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="companyName" className="mb-1">ობიექტის დასახელება:</label>
                  <input type="text" className="form-control" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="companyAddress" className="mb-1">ობიექტის მისამართი :</label>
                  <input type="text" className="form-control" id="companyAddress" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="fieldOfWork" className="mb-1">სამუშაოს სფერო:</label>
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={suggestion => suggestion}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onBlur={validateFieldOfWork}
                    required
                  />
                  {fieldOfWorkError && <div className="text-danger">{fieldOfWorkError}</div>}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="workDescription" className="mb-1">სამუშაოს მოკლე აღწერა:</label>
                  <input type="text" className="form-control" id="workDescription" value={workDescription} onChange={e => setWorkDescription(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="revisionDate" className="mb-1">გადახედვის სავარაუდო თარიღი:</label>
                  <input type="date" className="form-control" id="revisionDate" value={revisionDate} onChange={e => setRevisionDate(e.target.value)} required />
                </div>

                <div className="row document-header-buttons">
                  <div className="col">
                    <Link to="/CompanyFiles" className='nav-link option'>
                      <button type="button" className="btn btn-danger btn-block mt-4 w-100 py-2">
                        გაუქმება
                      </button>
                    </Link>
                  </div>
                  <div className="col">
                    <button type="submit" className="btn btn-primary btn-block mt-4 w-100 py-2">
                      გაგრძელება
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;