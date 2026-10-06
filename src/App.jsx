import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProblemList } from './components/ProblemList';
import { ProblemDetail } from './components/ProblemDetail';
import { AdminPanel } from './components/AdminPanel';
import { SubmissionsView } from './components/SubmissionsView';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { api } from './api';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'problem-detail' | 'submissions' | 'admin'
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch problems & check backend connection
  const fetchProblems = async () => {
    setIsLoadingProblems(true);
    setIsCheckingHealth(true);
    try {
      const res = await api.getProblems();
      setProblems(res.problems || []);
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend initial fetch failed, retrying...', err);
      setIsBackendConnected(false);
    } finally {
      setIsLoadingProblems(false);
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    fetchProblems();

    // Health check polling loop to handle Render cold-starts
    const interval = setInterval(async () => {
      const connected = await api.checkHealth();
      setIsBackendConnected(connected);
      if (connected && problems.length === 0) {
        const res = await api.getProblems().catch(() => null);
        if (res && res.problems) setProblems(res.problems);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    setActiveTab('problem-detail');
  };

  const handleSelectProblemById = (problemId) => {
    const found = problems.find(p => p.id === problemId);
    if (found) {
      setSelectedProblem(found);
      setActiveTab('problem-detail');
    } else {
      setActiveTab('problems');
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isBackendConnected={isBackendConnected}
        isCheckingHealth={isCheckingHealth}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'problems' && (
          <ProblemList
            problems={problems}
            isLoading={isLoadingProblems}
            onSelectProblem={handleSelectProblem}
            onRefresh={fetchProblems}
            onOpenAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'problem-detail' && selectedProblem && (
          <ProblemDetail
            problem={selectedProblem}
            onBack={() => setActiveTab('problems')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            problems={problems}
            onRefreshProblems={fetchProblems}
          />
        )}

        {activeTab === 'submissions' && (
          <SubmissionsView
            onSelectProblemById={handleSelectProblemById}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={fetchProblems}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
