import { Link } from 'react-router-dom';
import { FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 2rem',
      color: 'var(--text-secondary)',
      fontSize: '0.85rem',
      backgroundColor: 'var(--bg-secondary)',
    }}>
      <style>
        {`
          .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
          }
          .footer-links {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            width: 100%;
          }
          .footer-socials {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            width: 100%;
          }
          .footer-center {
            text-align: center;
            width: 100%;
          }
          .footer-link {
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.2s;
            font-weight: 500;
          }
          .footer-link:hover {
            color: var(--brand-primary);
          }
          @media (min-width: 768px) {
            .footer-container {
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
            }
            .footer-links {
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: flex-start;
              align-items: flex-start;
              flex: 1;
            }
            .footer-center {
              flex: 1;
            }
            .footer-socials {
              justify-content: flex-end;
              flex: 1;
            }
          }
        `}
      </style>
      <div className="footer-container">

        {/* Left Side: Links */}
        <div className="footer-links">

          <Link to="#" className="footer-link">Terms & Conditions</Link>
          <Link to="#" className="footer-link">Privacy Policy</Link>
          <Link to="#" className="footer-link">Return Policy</Link>
        </div>

        {/* Center: Branding */}
        <div className="footer-center">
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>ShopVibe</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
            © {new Date().getFullYear()} ShopVibe. All rights reserved.
          </p>
        </div>

        {/* Right Side: Socials */}
        <div className="footer-socials">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="Twitter">
            <FiTwitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="Instagram">
            <FiInstagram size={20} />
          </a>
          <a href="mailto:contact@shopvibe.com" className="footer-link" aria-label="Email">
            <FiMail size={20} />
          </a>
        </div>

      </div>
    </footer>
  );
}
