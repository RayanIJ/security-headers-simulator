import React from 'react';
import styles from './TopBar.module.css';
import { useSimulator } from '../context/SimulatorContext';
import { PRESETS } from '../core/presets';
import { Download, Share2, RotateCcw, BookOpen } from 'lucide-react';
import { LearnModal } from './LearnModal';
import { useState } from 'react';

export const TopBar: React.FC = () => {
    const { state, dispatch } = useSimulator();
    const [learnOpen, setLearnOpen] = useState(false);

    const loadPreset = (name: string) => {
        if (!name) return;
        const preset = PRESETS[name];
        if (preset) {
            dispatch({ type: 'SET_CONFIG', payload: preset });
        }
    };

    const handleReset = () => {
        // Reset to minimal or truly empty? 
        // User requested "Reset". I'll reset to initial empty state (or a basic safe default).
        // The initial state in Context was all empty/false. I'll construct it again or export it.
        // For now, I'll just load 'minimal' as a safe reset or manual clear.
        // Let's manually dispatch an empty config.
        window.location.reload(); // Lazy reset, or dispatch SET_CONFIG with initialConfig if I exported it.
    };

    const handleExport = () => {
        const json = JSON.stringify(state.config, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'security-headers-config.json';
        a.click();
    };

    const handleShare = () => {
        const str = btoa(JSON.stringify(state.config));
        const url = `${window.location.origin}?config=${str}`;
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard! (Note: URL loading logic not yet implemented in this demo)');
    };

    return (
        <div className={styles.container}>
            <div className={styles.brand}>
                <span className={styles.logo}>🛡️</span>
                <span className={styles.title}>Security Headers Sim</span>
            </div>

            <div className={styles.actions}>
                <select className={styles.presetSelect} onChange={(e) => loadPreset(e.target.value)} defaultValue="">
                    <option value="" disabled>Load Preset...</option>
                    <option value="minimal">Minimal Safe</option>
                    <option value="strict">Strict / High Security</option>
                    <option value="api">Public API</option>
                </select>

                <div className={styles.divider} />

                <button className={styles.button} onClick={handleReset} title="Reset">
                    <RotateCcw size={16} /> Reset
                </button>
                <button className={styles.button} onClick={() => setLearnOpen(true)} title="Learn">
                    <BookOpen size={16} /> Learn
                </button>
                <button className={styles.button} onClick={handleExport} title="Export JSON">
                    <Download size={16} /> Export
                </button>
                <button className={styles.button} onClick={handleShare} title="Share URL">
                    <Share2 size={16} /> Share
                </button>
                <LearnModal isOpen={learnOpen} onClose={() => setLearnOpen(false)} />
            </div>
        </div>
    );
};
