import React from 'react';
import { Link } from 'react-router-dom';
import './CookiesPage.css';

export default function CookiesPage({ darkMode }) {
  const handleOpenCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  return (
    <div className={`cookies-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="cookies-hero">
        <div className="cookies-hero-badge">Legal & Privacy</div>
        <h1 className="cookies-hero-title">Cookies Policy</h1>
        <p className="cookies-hero-subtitle">
          Learn how SnapPass AI utilizes cookies and local storage to protect your session, power AI photo processing, and respect your privacy preferences.
        </p>
        <div className="cookies-hero-meta">
          <span>Effective Date: August 2, 2026</span>
          <span className="dot-separator">•</span>
          <span>Last Updated: August 2026</span>
        </div>
      </div>

      <div className="cookies-container">
        {/* Quick Action Preference Card */}
        <div className="cookie-action-card">
          <div className="cookie-action-text">
            <h3>Manage Cookie Preferences</h3>
            <p>You can update your consent choices for non-essential cookies anytime.</p>
          </div>
          <button
            type="button"
            className="cookie-action-btn"
            onClick={handleOpenCookieSettings}
          >
            🍪 Open Cookie Settings
          </button>
        </div>

        <section className="cookies-section">
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your computer, smartphone, or browser when you visit a website. They allow the platform to remember your actions, preferences, and authentication status over a period of time, eliminating the need to re-enter settings whenever you return to the site.
          </p>
          <p>
            In addition to HTTP cookies, SnapPass AI may use modern local web storage technologies (such as <code>localStorage</code> and <code>sessionStorage</code>) to save non-sensitive operational state like your visual theme preference or processing queue history.
          </p>
        </section>

        <section className="cookies-section">
          <h2>2. Why We Use Cookies</h2>
          <p>We use cookies and related storage technologies to:</p>
          <ul className="cookies-list">
            <li>Ensure secure login authentication and session validation.</li>
            <li>Protect sensitive image sharing links with one-time view keys and password verification.</li>
            <li>Retain active AI photo processing job states across page refreshes.</li>
            <li>Remember user preferences such as Dark Mode / Light Mode and country passport presets.</li>
            <li>Gather aggregated, non-identifying telemetry to detect processing bottlenecks and system anomalies.</li>
          </ul>
        </section>

        <section className="cookies-section">
          <h2>3. Categories of Cookies Used</h2>
          <p>The table below summarizes the categories of cookies and web storage used by SnapPass AI:</p>

          <div className="cookies-table-wrapper">
            <table className="cookies-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Purpose</th>
                  <th>Examples & Storage Keys</th>
                  <th>Type & Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="table-badge required">Essential</span>
                  </td>
                  <td>Strictly necessary for security, NoSQL injection protection, session verification, and temporary expiring link validation.</td>
                  <td>
                    <code>snappass_token</code>, <code>CSRF-TOKEN</code>
                  </td>
                  <td>First-Party / Session (expires on exit)</td>
                </tr>
                <tr>
                  <td>
                    <span className="table-badge functional">Functional</span>
                  </td>
                  <td>Stores application preferences, custom visual themes, active photo presets, and processing queue history.</td>
                  <td>
                    <code>theme_preference</code>, <code>snappass_job_queue</code>, <code>snappass_cookie_consent</code>
                  </td>
                  <td>First-Party / Persistent (up to 1 year)</td>
                </tr>
                <tr>
                  <td>
                    <span className="table-badge analytics">Analytics</span>
                  </td>
                  <td>Aggregates anonymous metrics regarding page load speed, error rates, and feature usage to optimize photo generation performance.</td>
                  <td>
                    <code>_snappass_analytics_id</code>
                  </td>
                  <td>First-Party / Persistent (30 days)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="cookies-section">
          <h2>4. Retention Periods</h2>
          <p>Cookies and local storage data remain on your device for varying durations:</p>
          <ul className="cookies-list">
            <li>
              <strong>Session Cookies / Storage:</strong> Temporary items that automatically clear when you close your browser tab or log out.
            </li>
            <li>
              <strong>Persistent Storage:</strong> Items saved to <code>localStorage</code> (such as theme preferences and cookie consent status) remain on your device until manually cleared or up to 12 months.
            </li>
          </ul>
        </section>

        <section className="cookies-section">
          <h2>5. Managing & Disabling Cookies</h2>
          <p>
            You can control, block, or delete cookies at any time through your web browser settings. Please note that disabling essential cookies may impact core functionality such as user authentication and temporary share link validation.
          </p>
          <div className="browser-links-grid">
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="browser-link-card"
            >
              Google Chrome Cookie Guide →
            </a>
            <a
              href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
              target="_blank"
              rel="noopener noreferrer"
              className="browser-link-card"
            >
              Mozilla Firefox Cookie Guide →
            </a>
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="browser-link-card"
            >
              Apple Safari Cookie Guide →
            </a>
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40cf-4235-9d4e-77a3899147d0"
              target="_blank"
              rel="noopener noreferrer"
              className="browser-link-card"
            >
              Microsoft Edge Cookie Guide →
            </a>
          </div>
        </section>

        <section className="cookies-section">
          <h2>6. Contact Us</h2>
          <p>
            If you have any questions or privacy concerns regarding our Cookies Policy or data protection practices, please contact our privacy compliance team:
          </p>
          <div className="contact-box">
            <p><strong>SnapPass AI Privacy & Security Team</strong></p>
            <p>Email: <a href="mailto:privacy@snappass.ai">privacy@snappass.ai</a></p>
            <p>Support Portal: <Link to="/terms">Terms of Service</Link> | <Link to="/privacy">Privacy Policy</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
}
