//loggedin.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoggedIn({ profile, defaultSettings }) {
    const [language, setLanguage] = useState(defaultSettings.language);
    const [difficulty, setDifficulty] = useState(defaultSettings.difficulty);
  return (
    <div>
      <h1>Welcome {profile.name}</h1>
      <div>You're learning: {language.charAt(0).toUpperCase() + language.slice(1)}</div>
      <div>With Level Settings: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
      <div>Change Your <Link to="/quizzes">Settings</Link> or...</div>
      <Link to="/quizzes">Go to Quizzes</Link>
    </div>
  );
}

export default LoggedIn;
