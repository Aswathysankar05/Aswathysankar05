// Footer.tsx
import React from 'react';
import image5 from '../../Images/PublicImages/image-2.png';
import './Footer.css'; // Import the CSS file for styling

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
          <a target='_blank' href="https://www.cloudplusinfotech.com/" aria-label="Home">
              <img src={image5} alt="MyCompany Logo" className="logo-image" />
            </a>
            
          </div>
          <nav className="footer-nav">
            <ul>
              <li><a target='_blank' href="https://www.cloudplusinfotech.com/index.html#about">About Us</a></li>
              <li><a target='_blank' href="https://www.cloudplusinfotech.com/index.html#services">Services</a></li>
              <li><a target='_blank' href="https://www.cloudplusinfotech.com/index.html#contact">Contact</a></li>
            </ul>
          </nav>
          {/* <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/path-to-facebook-icon.svg" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <img src="/path-to-twitter-icon.svg" alt="Twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/path-to-instagram-icon.svg" alt="Instagram" />
            </a>
          </div> */}
        </div>
        <div className="footer-bottom">
        
          <p><a target='_blank' href="https://www.cloudplusinfotech.com/privacypolicy.html" >Privacy | </a>
          <a target='_blank' href="https://www.cloudplusinfotech.com/termsofuse.html">Site Terms | </a>
          &copy; {new Date().getFullYear()} Cloudplus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
