import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Send, RotateCcw, Copy, Check, Clock, 
  AlertCircle, CheckCircle2, XCircle, Code, FileText
} from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const STARTER_CODE = {
  python: `# Write your Python 3 solution here
import sys

def main():
    lines = sys.stdin.read().split()
    if not lines:
        return
    # Add your logic here
    print(lines[0])

if __name__ == "__main__":
    main()
`,
  cpp: `// Write your C++ solution here
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Add your logic here
    
    return 0;
}
`
};

export const ProblemDetail = ({ problem, onBack, onOpenAuth }) => {
  const { isAuthenticated, recordSubmission } = useAuth();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE.python);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(STARTER_CODE[newLang] || '');
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to default starter template?')) {
      setCode(STARTER_CODE[language] || '');
      setSubmissionResult(null);
      setSubmissionError(null);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    if (!code.trim()) {
      alert('Please enter your solution before submitting!');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);
    setSubmissionError(null);

    const startTime = performance.now();

    try {
      const res = await api.submitCode(problem.id, code, language);
      const duration = ((performance.now() - startTime) / 1000).toFixed(3);
      
      setSubmissionResult({
        ...res,
        clientDuration: duration
      });

      recordSubmission({
        problem_id: problem.id,
        problem_title: problem.problem_title,
        language,
        verdict: res.verdict || 'Unknown',
        execution_time: res.execution_time
      });

      if (res.verdict === 'Accepted') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setSubmissionError(err.message || 'Failed to submit code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerdictCard = (verdict) => {
    switch (verdict) {
      case 'Accepted':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          icon: <CheckCircle2 size={24} color="#34d399" />,
          title: 'ACCEPTED',
          desc: 'All test cases passed successfully!'
        };
      case 'Wrong Answer':
        return {
          bg: 'rgba(244, 63, 94, 0.12)',
          border: 'rgba(244, 63, 94, 0.3)',
          color: '#f87171',
          icon: <XCircle size={24} color="#f87171" />,
          title: 'WRONG ANSWER',
          desc: 'Output did not match expected testcase output.'
        };
      case 'Time Limit Exceeded':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          icon: <Clock size={24} color="#fbbf24" />,
          title: 'TIME LIMIT EXCEEDED',
          desc: 'Solution exceeded the maximum allowed execution time.'
        };
      default:
        return {
          bg: 'rgba(217, 70, 239, 0.12)',
          border: 'rgba(217, 70, 239, 0.3)',
          color: '#f0abfc',
          icon: <AlertCircle size={24} color="#f0abfc" />,
          title: verdict ? verdict.toUpperCase() : 'ERROR',
          desc: 'Execution finished with a runtime or compilation error.'
        };
    }
  };

  return (
    <div className="main-content-wide">
      {/* Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '16px' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Problems</span>
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
            Problem ID: <strong style={{ color: '#fff' }}>#{problem.id}</strong>
          </span>
          <span className={`badge ${
            problem.difficulty?.toLowerCase() === 'easy' ? 'badge-easy' :
            problem.difficulty?.toLowerCase() === 'medium' ? 'badge-medium' : 'badge-hard'
          }`}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Split Pane IDE */}
      <div className="split-pane-container">
        {/* Left Pane: Problem Description */}
        <div className="glass-panel ide-panel">
          <div className="ide-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
              <FileText size={16} color="#818cf8" />
              <span>Problem Statement</span>
            </div>
          </div>

          <div className="ide-body">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              {problem.problem_title}
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.925rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '24px' }}>
              {problem.problem_statement}
            </p>

            {/* Input Format */}
            <div style={{ background: 'rgba(11, 15, 25, 0.7)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code size={14} /> Input Format
              </h4>
              <pre style={{ color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', margin: 0 }}>
                {problem.input_format || 'Standard Input (stdin)'}
              </pre>
            </div>

            {/* Output Format */}
            <div style={{ background: 'rgba(11, 15, 25, 0.7)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code size={14} /> Output Format
              </h4>
              <pre style={{ color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', margin: 0 }}>
                {problem.output_format || 'Standard Output (stdout)'}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor & Execution */}
        <div className="glass-panel ide-panel">
          {/* Toolbar */}
          <div className="ide-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Language:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
              >
                <option value="python">Python 3 (3.10)</option>
                <option value="cpp">C++ (GCC g++)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={handleCopyCode} className="btn btn-secondary btn-sm">
                {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button onClick={handleResetCode} className="btn btn-secondary btn-sm">
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="ide-editor-wrapper">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : 'python'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* IDE Footer & Verdict Card */}
          <div className="ide-footer">
            {submissionResult && (() => {
              const card = getVerdictCard(submissionResult.verdict);
              return (
                <div style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {card.icon}
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: card.color, letterSpacing: '0.04em' }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#e2e8f0', opacity: 0.9 }}>
                        {card.desc}
                      </div>
                    </div>
                  </div>

                  {submissionResult.execution_time !== undefined && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fff' }}>
                        {submissionResult.execution_time.toFixed(3)}s
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Exec Time
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {submissionError && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#f87171',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertCircle size={18} />
                <span>{submissionError}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
              <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                {!isAuthenticated && (
                  <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <AlertCircle size={14} /> Sign in required to submit code
                  </span>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ marginLeft: 'auto', padding: '10px 24px' }}
              >
                {isSubmitting ? (
                  <>
                    <RotateCcw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Evaluating Code...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
