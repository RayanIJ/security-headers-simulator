import React from 'react';
import styles from './Layout.module.css';
import { TopBar } from './TopBar';

interface LayoutProps {
    sidebar: React.ReactNode;
    simulation: React.ReactNode;
    inspector: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, simulation, inspector }) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <TopBar />
            </header>
            <main className={styles.main}>
                <aside className={styles.sidebar}>{sidebar}</aside>
                <div className={styles.simulation}>{simulation}</div>
                <aside className={styles.inspector}>{inspector}</aside>
            </main>
        </div>
    );
};
