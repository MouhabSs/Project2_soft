import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="theme-toggle"
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        padding: 'var(--spacing-sm)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        fontSize: '1.2rem',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }
      }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle; 