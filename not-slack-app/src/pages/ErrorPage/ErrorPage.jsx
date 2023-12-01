import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/ErrorPage.css';

function ErrorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1);
    }, 2000);

    // Clear the timeout on unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section>
      <div className="error-page-container">
        <h1>404 Error</h1>
        <span>eye connect can't see you</span>
      </div>
    </section>
  );
}

export default ErrorPage;
