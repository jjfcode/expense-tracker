import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Designed by <span className="designer">jjfcode</span>
          <span className="version">v1.18.25</span>
          <span className="copyright">&copy; {currentYear} jjfcode. All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer; 