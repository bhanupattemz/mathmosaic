import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      backgroundColor: '#333',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',  
      width: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding:"15px" }}>
        <span>Developed by Bhanu Prakash Pattem</span>
        <span style={{ marginLeft: '10px', fontSize: '12px' }}></span>
      </div>
    </footer>
  );
};

export default Footer;