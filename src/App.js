import './App.css';
import React, { useState, useEffect } from 'react';
import QuizComponent from './QuizComponent';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProfilePage from './ProfilePage'; // Import the ProfilePage component
import LoggedIn from './LoggedIn'; // Import the LoggedIn component

function App() {
  const [defaultSettings, setDefaultSettings] = useState({ language: 'english', difficulty: 'beginner' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [difficulty, setDifficulty] = useState(defaultSettings.difficulty);
  const [language, setLanguage] = useState(defaultSettings.language);



  const [profile, setProfile] = useState(null);
  function generateRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  function handleAuthAction() {
    if (isLoggedIn) {
      // Log out the user by removing the access token from the URL and updating the isLoggedIn state
      window.location.hash = '';
      console.log(window.location.hash);

      setIsLoggedIn(false);
    } else {
      // Google's OAuth 2.0 endpoint for requesting an access token
      var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

      // Create <form> element to submit parameters to OAuth 2.0 endpoint.
      var form = document.createElement('form');
      form.setAttribute('method', 'GET'); // Send as a GET request.
      form.setAttribute('action', oauth2Endpoint);

      // Parameters to pass to OAuth 2.0 endpoint.
      var params = {
        'client_id': REACT_APP_CLIENT_ID,
        'redirect_uri': REACT_APP_REDIRECT_URI,
        'response_type': 'token id_token',
        'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly profile',
        'include_granted_scopes': 'true',
        'state': 'pass-through value',
        'nonce': generateRandomString()

      };

      // Add form parameters as hidden input values.
      for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
      }

      // Add form to page and submit it to open the OAuth 2.0 endpoint.
      document.body.appendChild(form);
      form.submit();
    }
  }
  
// Only one useEffect to get defaultSettings from local storage and set it once when the component mounts
useEffect(() => {
  const savedSettings = JSON.parse(localStorage.getItem('defaultSettings'));
  if (savedSettings) {
    setDefaultSettings(savedSettings);
  }
}, []);

useEffect(() => {
  localStorage.setItem('defaultSettings', JSON.stringify(defaultSettings));
}, [defaultSettings]);

useEffect(() => {
  if (isLoggedIn && defaultSettings) {
    setLanguage(defaultSettings.language);
    setDifficulty(defaultSettings.difficulty);
  }
}, [isLoggedIn, defaultSettings]);

  

  
    // Check if the user is logged in by checking the URL for an access token
    useEffect(() => {
      if (window.location.hash.includes('access_token')) {
        setIsLoggedIn(true);
    
        const hash = window.location.hash
          .substring(1)
          .split('&')
          .reduce((init, item) => {
            let parts = item.split('=');
            if (parts[1]) {
              init[parts[0]] = decodeURIComponent(parts[1]);
            }
            return init;
          }, {});
    
        if (hash && hash.id_token) {
          const idTokenPayload = hash.id_token.split('.')[1];
          if (idTokenPayload) {
            try {
              const idToken = JSON.parse(atob(idTokenPayload));
              setProfile({
                name: idToken.name,
                email: idToken.email,
                // ... other profile fields
              });
            } catch (e) {
              console.error('Failed to parse ID token payload', e);
            }
          } else {
            console.error('id_token payload is not present in the hash');
          }
        } else {
          console.error('id_token is not present in the hash');
        }
      }
    }, []);
    

  

  

 

  return (
    <Router>
    <div>
      <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="#someSectionID">Quiz App</a>

        {isLoggedIn && (
        <>
        
     
        <Link to="/" className="btn btn-outline-info">Home</Link>
            <Link to="/quizzes" className="btn btn-outline-info">Quizzes</Link>

            <Link to="/profile" className="btn btn-outline-info">Profile</Link>

      </>
        )}
                <button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={handleAuthAction}>{isLoggedIn ? 'Logout' : 'Login with Google'}</button>

                </nav>
                
       
      <div className="App">
      {isLoggedIn ? (
    <Routes>
            <Route path="/profile" element={<ProfilePage profile={profile} defaultSettings={defaultSettings} setDefaultSettings={setDefaultSettings} />} />
   <Route path="/quizzes" element={<QuizComponent difficulty={difficulty} language={language}  />} />
   <Route path="/" element={<LoggedIn profile={profile} defaultSettings={defaultSettings} />} />
  </Routes>
    


        ) : (
        <div style={{ width: '500px', margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <span>Unlock a world of language mastery with our intuitive quiz app! Choose from Spanish, French, English, or Italian and hone your skills in subjunctive usage, basic conjugation, and mastering the imperative - transforming your language learning journey into an engaging adventure.</span>
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" />

          </div>
        </div>
      )}
      </div>
    </div>
    </Router>
  );
}

export default App;