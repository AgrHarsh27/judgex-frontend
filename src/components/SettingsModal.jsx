import React, { useState } from 'react';
import { X, Server, CheckCircle2, XCircle, RefreshCw, Globe, RotateCcw } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, api } from '../api';

export const SettingsModal = ({ isOpen, onClose, onConfigSaved }) => {
  const [urlInput, setUrlInput] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Save temporarily to test
    setApiBaseUrl(urlInput);

    const ok = await api.checkHealth();
    setTesting(false);
    setTestResult(ok);
  };

  const handleSave = () => {
    setApiBaseUrl(urlInput);
    if (onConfigSaved) onConfigSaved();
    onClose();
  };

  const handleResetDefault = () => {
    const defaultUrl = 'https://judgex-backend-kcdo.onrender.com';
    setUrlInput(defaultUrl);
    setApiBaseUrl(defaultUrl);
    setTestResult(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Server size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Backend Connection</h2>
            <p className="text-xs text-slate-400">Configure JudgeX Backend API Endpoint</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label flex items-center justify-between">
              <span>Backend Base URL</span>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw size={12} /> Reset Default
              </button>
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://judgex-backend-kcdo.onrender.com"
                className="form-input pl-10 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Default deployed backend: <code className="text-indigo-300">https://judgex-backend-kcdo.onrender.com</code>
            </p>
          </div>

          {/* Test connection results */}
          {testResult !== null && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              testResult
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {testResult ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Connection successful! Backend is online.</span>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-rose-400" />
                  <span>Connection failed. Please check backend URL or CORS settings.</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="btn btn-secondary flex-1 text-xs"
            >
              <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
              {testing ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary flex-1 text-xs"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
