import React, { useState, useEffect } from 'react';
import { PlusCircle, Shield, FileText, CheckCircle2, AlertCircle, RefreshCw, Users, Layers } from 'lucide-react';
import { api } from '../api';

export const AdminPanel = ({ problems = [], onRefreshProblems }) => {
  const [activeTab, setActiveTab] = useState('add-problem');
  
  // New Problem Form
  const [problemTitle, setProblemTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);
  const [problemMessage, setProblemMessage] = useState(null);

  // Testcase Form
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [inputData, setInputData] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [isSubmittingTestcase, setIsSubmittingTestcase] = useState(false);
  const [testcaseMessage, setTestcaseMessage] = useState(null);

  // Users List
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    if (problems.length > 0 && !selectedProblemId) {
      setSelectedProblemId(problems[0].id.toString());
    }
  }, [problems]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setUserError(null);
    try {
      const res = await api.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      setUserError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    if (!problemTitle || !problemStatement || !inputFormat || !outputFormat) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmittingProblem(true);
    setProblemMessage(null);

    try {
      const res = await api.addProblem({
        problem_title: problemTitle,
        problem_statement: problemStatement,
        difficulty,
        input_format: inputFormat,
        output_format: outputFormat
      });

      setProblemMessage({
        type: 'success',
        text: `Problem "${problemTitle}" created successfully! Problem ID: #${res.problem_id}`
      });

      setProblemTitle('');
      setProblemStatement('');
      setInputFormat('');
      setOutputFormat('');
      onRefreshProblems();
    } catch (err) {
      setProblemMessage({
        type: 'error',
        text: err.message || 'Failed to create problem.'
      });
    } finally {
      setIsSubmittingProblem(false);
    }
  };

  const handleAddTestcase = async (e) => {
    e.preventDefault();
    if (!selectedProblemId || !inputData || !expectedOutput) {
      alert('Please select a problem and fill out both input and expected output.');
      return;
    }

    setIsSubmittingTestcase(true);
    setTestcaseMessage(null);

    try {
      const res = await api.addTestCase(selectedProblemId, {
        input_data: inputData,
        expected_output: expectedOutput
      });

      setTestcaseMessage({
        type: 'success',
        text: res.message || 'TestCase successfully added!'
      });

      setInputData('');
      setExpectedOutput('');
      onRefreshProblems();
    } catch (err) {
      setTestcaseMessage({
        type: 'error',
        text: err.message || 'Failed to add testcase.'
      });
    } finally {
      setIsSubmittingTestcase(false);
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="brand-icon-box" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Administrator Console</h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Publish problem statements, attach test cases, and manage accounts.</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="filter-tabs">
          <button
            onClick={() => setActiveTab('add-problem')}
            className={`filter-btn ${activeTab === 'add-problem' ? 'active' : ''}`}
          >
            <PlusCircle size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Add Problem
          </button>
          <button
            onClick={() => setActiveTab('add-testcase')}
            className={`filter-btn ${activeTab === 'add-testcase' ? 'active' : ''}`}
          >
            <Layers size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Add Testcase
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`filter-btn ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Users
          </button>
        </div>
      </div>

      {/* Add Problem Form */}
      {activeTab === 'add-problem' && (
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#a855f7" />
            Create Problem Statement
          </h2>

          {problemMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: problemMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: problemMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
              color: problemMessage.type === 'success' ? '#34d399' : '#f87171'
            }}>
              {problemMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{problemMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleCreateProblem}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hello World"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty *</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="form-select"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Problem Statement *</label>
              <textarea
                required
                rows={5}
                placeholder="Describe the problem, input constraints, and objective..."
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Input Format *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe standard input structure..."
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                className="form-textarea"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Output Format *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe standard output structure..."
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="form-textarea"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingProblem}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px', background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' }}
            >
              {isSubmittingProblem ? 'Publishing Problem...' : 'Publish Problem'}
            </button>
          </form>
        </div>
      )}

      {/* Add Testcase Form */}
      {activeTab === 'add-testcase' && (
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#a855f7" />
            Attach Test Case
          </h2>

          {testcaseMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: testcaseMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: testcaseMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
              color: testcaseMessage.type === 'success' ? '#34d399' : '#f87171'
            }}>
              {testcaseMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{testcaseMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleAddTestcase}>
            <div className="form-group">
              <label className="form-label">Target Problem *</label>
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="form-select"
              >
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - {p.problem_title} ({p.difficulty})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Input Data (stdin) *</label>
              <textarea
                required
                rows={4}
                placeholder="Input data string provided to standard input..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="form-textarea"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Output (stdout) *</label>
              <textarea
                required
                rows={4}
                placeholder="Exact output string expected..."
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                className="form-textarea"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingTestcase || problems.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px', background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' }}
            >
              {isSubmittingTestcase ? 'Saving Test Case...' : 'Save Test Case'}
            </button>
          </form>
        </div>
      )}

      {/* Users List */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Registered Users</h2>
            <button onClick={fetchUsers} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} style={isLoadingUsers ? { animation: 'spin 1s linear infinite' } : {}} />
              <span>Refresh</span>
            </button>
          </div>

          {userError && (
            <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '16px' }}>{userError}</div>
          )}

          {isLoadingUsers ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading users...</div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>#{u.id}</td>
                      <td style={{ fontWeight: 700 }}>{u.username}</td>
                      <td>
                        {u.is_admin ? (
                          <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                            Administrator
                          </span>
                        ) : (
                          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            Coder
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
