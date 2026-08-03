import React from 'react';
import LoginComponent from '../components/LoginComponent';

const HomePage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col  items-center justify-center">
        <h1 className="text-4xl  font-bold text-gray-800 mt-8">Welcome to the Blending Room</h1> 

        <LoginComponent/>
      </div>
    </main>
  );
};

export default HomePage;
