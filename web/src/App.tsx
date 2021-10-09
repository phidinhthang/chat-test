import React, { useState, useEffect } from 'react';
import { Routes } from './Routes';
import { setAccessToken } from './lib/accessToken';

export const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/refresh_token', {
      method: 'post',
      credentials: 'include',
    })
      .then(async (x) => {
        const data: { accessToken: string } = await x.json();
        console.log(data);
        setAccessToken(data.accessToken);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return <Routes />;
};
