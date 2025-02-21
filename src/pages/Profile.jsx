import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Profile() {
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/collection/')
      .then(res => {
        setCollection(res.data);
      })
      .catch(err => {
        setError('Failed to load collection. Are you logged in?');
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Collection</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {collection.map((item) => (
        <div key={item.id} style={{ marginBottom: '0.5rem' }}>
          <strong>{item.movie.title}</strong> - Your Rating: {item.rating || 'N/A'}
        </div>
      ))}
    </div>
  );
}

export default Profile;
