import React, { useState, useEffect } from 'react';

  
function ProfilePage({ profile, defaultSettings, setDefaultSettings }) {
    const [language, setLanguage] = useState(defaultSettings.language);
    const [difficulty, setDifficulty] = useState(defaultSettings.difficulty);
    const [saveMessage, setSaveMessage] = useState('');

    const handleSave = () => {
        setDefaultSettings({
          language: language,
          difficulty: difficulty,
        });
      
        setSaveMessage('Saved');
        setTimeout(() => {
          setSaveMessage('');
        }, 2000);
      };
      
  return (
    <div>
      <h1>Welcome, {profile.name}</h1>
      <h2>Set Your Default Preferences</h2>
      <label>
        Language: 
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="german">German</option>
          <option value="italian">Italian</option>
          <option value="dutch">Dutch</option>
          {/* Add other options here */}
        </select>
      </label>
      <label>
        Difficulty: 
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          {/* Add other options here */}
        </select>
      </label>
      <div>
      <button onClick={handleSave}>Save</button>
      <div>{saveMessage}</div>
    </div>

    </div>
  );
}

export default ProfilePage;
