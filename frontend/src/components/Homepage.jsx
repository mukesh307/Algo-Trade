import React from 'react';
import HomeBg from '../assets/op.jpg'; // ✅ apne image ka correct path likhna

function Homepage() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <h1 className="text-4xl font-extrabold text-white bg-black bg-opacity-50 p-4 rounded-lg">
        Welcome to Homepage
      </h1>
    </div>
  );
}

export default Homepage;
