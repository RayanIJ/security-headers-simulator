import React from 'react';
import styles from './Sidebar.module.css';
import { useSimulator } from '../context/SimulatorContext';
import { Toggle } from './ui/Toggle';

export const Sidebar: React.FC = () => {
    const { state, dispatch } = useSimulator();
    const { config } = state;

    const updateXFrame = (val: 'DENY' | 'SAMEORIGIN' | undefined) => {
        dispatch({ type: 'UPDATE_CONFIG', payload: { xFrameOptions: val } });
    };

    const updateCSP = <K extends keyof typeof config.csp>(key: K, val: typeof config.csp[K]) => {
        dispatch({ type: 'UPDATE_CONFIG', payload: { csp: { ...config.csp, [key]: val } } });
    };

    const updateHSTS = <K extends keyof typeof config.hsts>(key: K, val: typeof config.hsts[K]) => {
        dispatch({ type: 'UPDATE_CONFIG', payload: { hsts: { ...config.hsts, [key]: val } } });
    };

    const updateContentType = (checked: boolean) => {
        dispatch({ type: 'UPDATE_CONFIG', payload: { xContentTypeOptions: checked ? 'nosniff' : undefined } });
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.section}>
                <h3>Themes & Actions</h3>
                <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
                    Toggle Theme ({state.theme})
                </button>
                <button onClick={() => dispatch({ type: 'UNDO' })} disabled={state.historyIndex <= 0} style={{ marginLeft: 8 }}>
                    Undo
                </button>
                <button onClick={() => dispatch({ type: 'REDO' })} disabled={state.historyIndex >= state.history.length - 1} style={{ marginLeft: 8 }}>
                    Redo
                </button>
            </div>

            <div className={styles.section}>
                <h3>X-Frame-Options</h3>
                <select
                    value={config.xFrameOptions || ''}
                    onChange={(e) => updateXFrame((e.target.value as 'DENY' | 'SAMEORIGIN') || undefined)}
                    className={styles.select}
                >
                    <option value="">None (Allowed)</option>
                    <option value="DENY">DENY</option>
                    <option value="SAMEORIGIN">SAMEORIGIN</option>
                </select>
            </div>

            <div className={styles.section}>
                <h3>Content-Security-Policy</h3>
                <Toggle
                    label="Enable CSP"
                    checked={config.csp.enabled}
                    onChange={(v) => updateCSP('enabled', v)}
                />
                {config.csp.enabled && (
                    <div className={styles.subGroup}>
                        <label>frame-ancestors</label>
                        <select
                            value={config.csp.frameAncestors || ''}
                            onChange={(e) => updateCSP('frameAncestors', e.target.value || undefined)}
                            className={styles.select}
                        >
                            <option value="">None (Default)</option>
                            <option value="'none'">{'\'none\''}</option>
                            <option value="'self'">{'\'self\''}</option>
                            <option value="https://attacker.com">https://attacker.com</option>
                        </select>

                        <label style={{ marginTop: 8, display: 'block' }}>script-src</label>
                        <select
                            value={config.csp.scriptSrc || ''}
                            onChange={(e) => updateCSP('scriptSrc', e.target.value || undefined)}
                            className={styles.select}
                        >
                            <option value="">None (Default)</option>
                            <option value="'self'">{'\'self\''}</option>
                            <option value="'self' 'unsafe-inline'">{'\'self\' \'unsafe-inline\''}</option>
                        </select>
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <h3>X-Content-Type-Options</h3>
                <Toggle
                    label="nosniff"
                    checked={config.xContentTypeOptions === 'nosniff'}
                    onChange={updateContentType}
                />
            </div>

            <div className={styles.section}>
                <h3>HSTS</h3>
                <Toggle
                    label="Enable HSTS"
                    checked={config.hsts.enabled}
                    onChange={(v) => updateHSTS('enabled', v)}
                />
            </div>

            <div className={styles.section}>
                <h3>CORS</h3>
                <label>Access-Control-Allow-Origin</label>
                <select
                    value={config.cors.allowOrigin || ''}
                    onChange={(e) => dispatch({ type: 'UPDATE_CONFIG', payload: { cors: { ...config.cors, allowOrigin: e.target.value || undefined } } })}
                    className={styles.select}
                >
                    <option value="">None (Block Cross-Origin)</option>
                    <option value="*">*</option>
                    <option value="https://attacker.com">https://attacker.com</option>
                    <option value="https://friendly.com">https://friendly.com</option>
                </select>
            </div>

        </div>
    );
};
