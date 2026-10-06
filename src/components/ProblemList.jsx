import React, { useState } from 'react';
import { Search, Code2, ArrowRight, RefreshCw, PlusCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProblemList = ({ 
  problems = [], 
  isLoading, 
  onSelectProblem, 
  onRefresh, 
  onOpenAdmin 
}) => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');

  const filteredProblems = problems.filter((prob) => {
    const matchesSearch = 
      prob.problem_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prob.problem_statement?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty = 
      difficultyFilter === 'ALL' || 
      prob.difficulty?.toUpperCase() === difficultyFilter.toUpperCase();

    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyBadge = (difficulty) => {
    const diff = (difficulty || '').toLowerCase();
    if (diff === 'easy') return <span className="badge badge-easy">Easy</span>;
    if (diff === 'medium') return <span className="badge badge-medium">Medium</span>;
    if (diff === 'hard') return <span className="badge badge-hard">Hard</span>;
    return <span className="badge badge-easy">{difficulty}</span>;
  };

  const totalCount = problems.length;
  const easyCount = problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
  const mediumCount = problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
  const hardCount = problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;

  return (
    <div className="main-content">
      {/* Hero Banner */}
      <div className="glass-panel hero-banner">
        <div>
          <div className="hero-subtitle">
            <Sparkles size={16} />
            <span>Competitive Coding Arena</span>
          </div>
          <h1 className="hero-title">Problem Archives</h1>
          <p className="hero-desc">
            Master data structures and algorithms with real-time Docker-sandboxed automated execution.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-box">
            <div className="stat-value easy">{easyCount}</div>
            <div className="stat-label">Easy</div>
          </div>
          <div className="stat-box">
            <div className="stat-value medium">{mediumCount}</div>
            <div className="stat-label">Med</div>
          </div>
          <div className="stat-box">
            <div className="stat-value hard">{hardCount}</div>
            <div className="stat-label">Hard</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Admin Controls */}
      <div className="toolbar-container">
        {/* Search */}
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search problems by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Difficulty Tabs & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="filter-tabs">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`filter-btn ${difficultyFilter === diff ? 'active' : ''}`}
              >
                {diff}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            className="btn btn-secondary btn-icon"
            title="Refresh Problems"
          >
            <RefreshCw size={18} style={isLoading ? { animation: 'spin 1s linear infinite' } : {}} />
          </button>

          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={16} />
              <span>Add Problem</span>
            </button>
          )}
        </div>
      </div>

      {/* Problems Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px auto', display: 'block' }} />
          <div>Connecting to backend & fetching problems...</div>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center', marginTop: '24px' }}>
          <Code2 size={42} style={{ color: '#6366f1', margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            No Problems Found
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 20px auto' }}>
            {problems.length === 0
              ? 'There are currently no problems in the database. Log in as an Administrator to add your first problem and testcases.'
              : 'No problems match your current search query or difficulty filter.'}
          </p>
          {isAdmin && (
            <button onClick={onOpenAdmin} className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create First Problem</span>
            </button>
          )}
        </div>
      ) : (
        <div className="problems-grid">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="glass-panel problem-card"
              onClick={() => onSelectProblem(problem)}
            >
              <div>
                <div className="card-header">
                  <span className="problem-tag">PROBLEM #{problem.id}</span>
                  {getDifficultyBadge(problem.difficulty)}
                </div>

                <h3 className="problem-card-title">{problem.problem_title}</h3>
                <p className="problem-card-statement">{problem.problem_statement}</p>
              </div>

              <div className="card-footer">
                <div className="card-stats">
                  <span><strong>{problem.test_case_ids ? problem.test_case_ids.length : 0}</strong> Testcases</span>
                  <span>•</span>
                  <span><strong>{problem.submission_ids ? problem.submission_ids.length : 0}</strong> Submissions</span>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProblem(problem);
                  }}
                >
                  <span>Solve</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
