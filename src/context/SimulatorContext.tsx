import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { HeaderConfig } from '../core/policyEvaluator';

// Initial State defaults
const initialConfig: HeaderConfig = {
    xFrameOptions: undefined,
    csp: {
        enabled: false,
        frameAncestors: undefined,
        scriptSrc: undefined,
    },
    xContentTypeOptions: undefined,
    referrerPolicy: undefined,
    hsts: {
        enabled: false,
        maxAge: 31536000,
        includeSubDomains: false,
        preload: false,
    },
    coop: undefined,
    coep: undefined,
    corp: undefined,
    cors: {
        allowOrigin: undefined,
    },
    permissionsPolicy: {
        enabled: false,
        features: {},
    },
};

interface State {
    config: HeaderConfig;
    history: HeaderConfig[];
    historyIndex: number;
    theme: 'light' | 'dark';
}

type Action =
    | { type: 'UPDATE_CONFIG'; payload: Partial<HeaderConfig> }
    | { type: 'SET_CONFIG'; payload: HeaderConfig } // Used for presets
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'TOGGLE_THEME' };

const initialState: State = {
    config: initialConfig,
    history: [initialConfig],
    historyIndex: 0,
    theme: 'light',
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'UPDATE_CONFIG': {
            const newConfig = { ...state.config, ...action.payload };
            // Debounce history or simple push? Simple push for now.
            // Ideally should clamp history size.
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push(newConfig);
            return {
                ...state,
                config: newConfig,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'SET_CONFIG': {
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push(action.payload);
            return {
                ...state,
                config: action.payload,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case 'UNDO': {
            if (state.historyIndex > 0) {
                const newIndex = state.historyIndex - 1;
                return {
                    ...state,
                    historyIndex: newIndex,
                    config: state.history[newIndex],
                };
            }
            return state;
        }
        case 'REDO': {
            if (state.historyIndex < state.history.length - 1) {
                const newIndex = state.historyIndex + 1;
                return {
                    ...state,
                    historyIndex: newIndex,
                    config: state.history[newIndex],
                };
            }
            return state;
        }
        case 'TOGGLE_THEME': {
            return {
                ...state,
                theme: state.theme === 'light' ? 'dark' : 'light',
            };
        }
        default:
            return state;
    }
};

const SimulatorContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

const SimulatorProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Effect to apply theme to body
    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    return (
        <SimulatorContext.Provider value={{ state, dispatch }}>
            {children}
        </SimulatorContext.Provider>
    );
};

const useSimulator = () => {
    const context = useContext(SimulatorContext);
    if (!context) {
        throw new Error('useSimulator must be used within a SimulatorProvider');
    }
    return context;
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSimulator, SimulatorProvider };
