import React from 'react';
import { X } from 'lucide-react';
import styles from './LearnModal.module.css';

interface LearnModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LearnModal: React.FC<LearnModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>Learn Security Headers</h2>
                    <button className={styles.closeButton} onClick={onClose}><X size={24} /></button>
                </header>
                <div className={styles.content}>
                    <section>
                        <h3>Content-Security-Policy (CSP)</h3>
                        <p>Controls which resources the user agent is allowed to load for a given page. Helps prevent Cross-Site Scripting (XSS) and data injection attacks.</p>
                        <div className={styles.diagram}>
                            <div className={styles.diagramBox}>Trusted Source</div>
                            <div className={styles.arrow}>→</div>
                            <div className={styles.diagramBox}>Browser</div>
                            <div className={styles.arrowBlocked}>x</div>
                            <div className={styles.diagramBoxDanger}>Malicious Script</div>
                        </div>
                    </section>

                    <section>
                        <h3>X-Frame-Options</h3>
                        <p>Indicates whether or not a browser should be allowed to render a page in a <code>&lt;frame&gt;</code>, <code>&lt;iframe&gt;</code>, <code>&lt;embed&gt;</code> or <code>&lt;object&gt;</code>. Used to avoid clickjacking attacks.</p>
                    </section>

                    <section>
                        <h3>HSTS (Strict-Transport-Security)</h3>
                        <p>Lets a web site tell browsers that it should only be communicated with using HTTPS, instead of using HTTP.</p>
                    </section>

                    <section>
                        <h3>X-Content-Type-Options</h3>
                        <p>Prevents the browser from doing "MIME type sniffing", forcing it to stick to the declared content-type. Prevents attacks where non-executable files (like images) are treated as scripts.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};
