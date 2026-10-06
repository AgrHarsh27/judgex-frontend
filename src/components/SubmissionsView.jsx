import React, { useState } from 'react';
import { History, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SubmissionsView = ({ onSelectProblemById }) => {
  const { submissionsHistory } = useAuth();
  const [filterVerdict, setFilterVerdict] = useState('ALL');

  const filteredSubmissions = submissionsHistory.filter((sub) => {
    if (filterVerdict === 'ALL') return true;
    return sub.verdict?.toUpperCase() === filterVerdict.toUpperCase();
  });

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'Accepted':
        return (
          <span className="badge badge-accepted">
            <CheckCircle2 size={12} /> Accepted
          </span>
        );
      case 'Wrong Answer':
        return (
          <span className="badge badge-wrong">
            <XCircle size={12} /> Wrong Answer
          </span>
        );
      case 'Time Limit Exceeded':
        return (
          <span className="badge badge-tle">
            <Clock size={12} /> Time Limit Exceeded
          </span>
        );
      default:
        return (
          <span className="badge badge-error">
            <AlertCircle size={12} /> {verdict}
          </span>
        );
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div className="glass-panel hero-banner" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', items: 'center', gap: '16px' }}>
          <div className="brand-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <History size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Submission Audit Log</h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Review your code evaluation history and execution benchmarks.</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filter-tabs">
          {['ALL', 'ACCEPTED', 'WRONG ANSWER', 'TIME LIMIT EXCEEDED'].map((verdict) => (
            <button
              key={verdict}
              onClick={() => setFilterVerdict(verdict)}
              className={`filter-btn ${filterVerdict === verdict ? 'active' : ''}`}
            >
              {verdict === 'TIME LIMIT EXCEEDED' ? 'TLE' : verdict}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Empty State */}
      {filteredSubmissions.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <History size={42} style={{ color: '#64748b', margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            No Submissions Recorded
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Submissions evaluated during your session will automatically log here in real time.
          </p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Problem</th>
                  <th>Language</th>
                  <th>Verdict</th>
                  <th>Exec Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8' }}>
                      {new Date(sub.timestamp).toLocaleTimeString()}
                    </td>
                    <td>
                      <span 
                        onClick={() => onSelectProblemById && onSelectProblemById(sub.problem_id)}
                        style={{ fontWeight: 700, cursor: 'pointer', color: '#818cf8' }}
                      >
                        {sub.problem_title || `Problem #${sub.problem_id}`}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {sub.language}
                      </span>
                    </td>
                    <td>{getVerdictBadge(sub.verdict)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {sub.execution_time !== undefined ? `${sub.execution_time.toFixed(3)}s` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
