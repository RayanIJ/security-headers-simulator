import React from 'react';
import styles from './InspectorPanel.module.css';
import { useSimulator } from '../context/SimulatorContext';
import { generateHeaders } from '../core/headerGenerator';
import { Copy } from 'lucide-react';

export const InspectorPanel: React.FC = () => {
    const { state } = useSimulator();
    const headers = generateHeaders(state.config);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const headerText = Object.entries(headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');

    return (
        <div className={styles.container}>
            <h3>Inspector</h3>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h4>Response Headers</h4>
                    <button className={styles.iconButton} onClick={() => copyToClipboard(headerText)}>
                        <Copy size={14} />
                    </button>
                </div>
                <div className={styles.codeBlock}>
                    {Object.keys(headers).length > 0 ? (
                        Object.entries(headers).map(([key, value]) => (
                            <div key={key} className={styles.headerLine}>
                                <span className={styles.key}>{key}:</span> <span className={styles.value}>{value}</span>
                            </div>
                        ))
                    ) : (
                        <div className={styles.empty}>No security headers set.</div>
                    )}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Browser Console (Simulated)</h4>
                <div className={styles.console}>
                    {state.config.xFrameOptions === 'DENY' && (
                        <div className={styles.errorLog}>Refused to display 'https://target-app.com/' in a frame because it set 'X-Frame-Options' to 'deny'.</div>
                    )}
                    {state.config.csp.enabled && state.config.csp.frameAncestors === "'none'" && (
                        <div className={styles.errorLog}>Refused to frame 'https://target-app.com/' because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'none'".</div>
                    )}
                    {state.config.csp.enabled && state.config.csp.scriptSrc && !state.config.csp.scriptSrc.includes("'unsafe-inline'") && (
                        <div className={styles.errorLog}>Refused to execute inline script because it violates the following Content Security Policy directive: "script-src {state.config.csp.scriptSrc}".</div>
                    )}
                    {state.config.cors.allowOrigin && state.config.cors.allowOrigin !== '*' && state.config.cors.allowOrigin !== 'https://attacker.com' && (
                        <div className={styles.errorLog}>Access to fetch at 'https://target-app.com/api' from origin 'https://attacker.com' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value '{state.config.cors.allowOrigin}' that is not equal to the supplied origin.</div>
                    )}
                    {!configHasAnyBlocks(state.config) && <div className={styles.infoLog}>Navigate to logical simulation...</div>}
                </div>
            </div>

        </div>
    );
};

function configHasAnyBlocks(config: import('../core/policyEvaluator').HeaderConfig) {
    return config.xFrameOptions || config.csp.enabled || config.cors.allowOrigin;
}
