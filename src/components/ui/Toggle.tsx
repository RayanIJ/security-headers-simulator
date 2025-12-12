import React from 'react';
import styles from './Toggle.module.css';

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, description }) => {
    return (
        <div className={styles.wrapper}>
            <label className={styles.container}>
                <span className={styles.label}>{label}</span>
                <div className={styles.switch} data-checked={checked} onClick={() => onChange(!checked)}>
                    <div className={styles.handle} />
                </div>
            </label>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
};
