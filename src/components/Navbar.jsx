import React from 'react';
import { Code2, Terminal, Shield, LogOut, User, History, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenAuth, 
  onOpenSettings,
  isBackendConnected,
  isCheckingHealth 
}) => {
  const { isAuthenticated, username, isAdmin, logoutUser } = useAuth();

  return (
    <nav className="glass-nav">
      <div className="nav-wrapper">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('problems')}
          className="brand-logo"
        >
          <div className="brand-icon-box">
            <Code2 size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="brand-title">
                Judge<span>X</span>
              </span>
              <span className="brand-badge">PRO</span>
            </div>
            <div className="brand-subtitle">Online Code Evaluator</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
            onClick={() => setActiveTab('problems')}
            className={`nav-btn ${activeTab === 'problems' || activeTab === 'problem-detail' ? 'active' : ''}`}
          >
            <Terminal size={16} />
            Problems
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`nav-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          >
            <History size={16} />
            Submissions
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`nav-btn nav-btn-admin ${activeTab === 'admin' ? 'active' : ''}`}
            >
              <Shield size={16} />
              Admin Console
            </button>
          )}
        </div>

        {/* Status Indicator & User Controls */}
        <div className="nav-actions">
          {/* Clickable Status Pill for Settings */}
          <button
            onClick={onOpenSettings}
            className={`status-pill cursor-pointer transition-all hover:brightness-110 ${
              isCheckingHealth 
                ? 'status-connecting' 
                : isBackendConnected 
                  ? 'status-online' 
                  : 'status-offline'
            }`}
            title="Click to configure backend API settings"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {isCheckingHealth ? (
              <>
                <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Connecting...</span>
              </>
            ) : isBackendConnected ? (
              <>
                <CheckCircle2 size={13} />
                <span>Backend Online</span>
              </>
            ) : (
              <>
                <XCircle size={13} />
                <span>Backend Offline</span>
              </>
            )}
          </button>

          {/* User Account Button or Badge */}
          {isAuthenticated ? (
            <div className="user-profile-badge">
              <div className="avatar-box">
                {username ? username[0].toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <span className="user-name">{username}</span>
                <span className="user-role">{isAdmin ? 'Admin' : 'Coder'}</span>
              </div>
              <button
                onClick={logoutUser}
                className="btn btn-secondary btn-sm btn-icon"
                title="Log Out"
                style={{ marginLeft: '6px' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary"
            >
              <User size={16} />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
