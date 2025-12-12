import React, { useState } from 'react';
import styles from './SimulationArea.module.css';
import { useSimulator } from '../context/SimulatorContext';
import { evaluatePolicy } from '../core/policyEvaluator';
import { Shield, AlertTriangle, Lock } from 'lucide-react';

export const SimulationArea: React.FC = () => {
    const { state } = useSimulator();
    const result = evaluatePolicy(state.config);
    const [activeTab, setActiveTab] = useState<'target' | 'attacker'>('target');

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'target' ? styles.active : ''}`}
                    onClick={() => setActiveTab('target')}
                >
                    Target Application (Safe)
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'attacker' ? styles.active : ''}`}
                    onClick={() => setActiveTab('attacker')}
                >
                    Attacker Site (Evil)
                </button>
            </div>

            <div className={styles.browserWindow}>
                <div className={styles.urlBar}>
                    <Lock size={14} className={styles.lockIcon} />
                    <span className={styles.url}>
                        {activeTab === 'target'
                            ? 'https://target-app.com/dashboard'
                            : 'https://attacker.com/exploit'}
                    </span>
                </div>

                <div className={styles.content}>
                    {activeTab === 'target' ? (
                        <div className={styles.targetContent}>
                            <h2>My Dashboard</h2>
                            <div className={styles.card}>
                                <h3>Account Overview</h3>
                                <p>Balance: $1,000,000</p>
                                <button className={styles.actionButton}>Transfer Funds</button>
                            </div>

                            <div className={styles.statusPanel}>
                                <h4>Security Status (Self-Check)</h4>
                                <div className={styles.statusItem}>
                                    <span>Inline Scripts:</span>
                                    <StatusBadge allowed={result.inlineScript.allowed} />
                                    <small>{result.inlineScript.reason}</small>
                                </div>
                                <div className={styles.statusItem}>
                                    <span>MIME Sniffing Risk:</span>
                                    <span className={result.mimeSniffing.risk === 'low' ? styles.safe : styles.danger}>
                                        {result.mimeSniffing.risk.toUpperCase()}
                                    </span>
                                    <small>{result.mimeSniffing.reason}</small>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.attackerContent}>
                            <h2>Evil Attacker Site</h2>

                            <div className={styles.attackScenario}>
                                <h3>Scenario: Clickjacking</h3>
                                <div className={styles.iframeWrapper}>
                                    {result.clickjacking.allowed ? (
                                        <div className={styles.mockIframe}>
                                            <div className={styles.iframeOverlay}>
                                                Click here to claim prize!
                                            </div>
                                            <div className={styles.iframeTarget}>
                                                (Target App Loaded Inside Iframe)
                                                <button>Transfer Funds</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.blockedPlaceholder}>
                                            <Shield size={48} />
                                            <p>Iframe Blocked</p>
                                            <small>{result.clickjacking.reason}</small>
                                        </div>
                                    )}
                                </div>
                                <p className={styles.scenarioResult}>
                                    Result: {result.clickjacking.allowed ?
                                        <span className={styles.danger}>VULNERABLE - Iframe allowed</span> :
                                        <span className={styles.safe}>PROTECTED - Iframe blocked</span>}
                                </p>
                            </div>

                            <div className={styles.attackScenario}>
                                <h3>Scenario: Cross-Origin Fetch (CORS)</h3>
                                <div className={styles.corsBox}>
                                    <p>Attempting: <code>fetch('https://target-app.com/api/data')</code></p>
                                    <div className={`${styles.corsResult} ${result.cors.fetchAllowed ? styles.danger : styles.safe}`}>
                                        {result.cors.fetchAllowed ? 'SUCCESS (Data Stolen)' : 'BLOCKED (Network Error)'}
                                    </div>
                                    <small>{result.cors.reason}</small>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            <div className={styles.resultsOverview}>
                <h3>Policy Analysis</h3>
                <div className={styles.grid}>
                    <AnalysisCard
                        title="Clickjacking"
                        safe={!result.clickjacking.allowed}
                        message={result.clickjacking.reason}
                    />
                    <AnalysisCard
                        title="XSS (Inline)"
                        safe={!result.inlineScript.allowed}
                        message={result.inlineScript.reason}
                    />
                    <AnalysisCard
                        title="MIME Sniffing"
                        safe={result.mimeSniffing.risk === 'low'}
                        message={result.mimeSniffing.reason}
                    />
                    <AnalysisCard
                        title="CORS"
                        safe={!result.cors.fetchAllowed}
                        message={result.cors.reason}
                    />
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ allowed }: { allowed: boolean }) => (
    <span className={allowed ? styles.danger : styles.safe}>
        {allowed ? 'ALLOWED' : 'BLOCKED'}
    </span>
);

const AnalysisCard = ({ title, safe, message }: { title: string, safe: boolean, message: string }) => (
    <div className={`${styles.analysisCard} ${safe ? styles.cardSafe : styles.cardDanger}`}>
        <div className={styles.cardHeader}>
            {safe ? <Shield size={16} /> : <AlertTriangle size={16} />}
            <strong>{title}</strong>
        </div>
        <p>{message}</p>
    </div>
);
