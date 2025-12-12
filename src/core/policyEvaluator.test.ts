import { describe, it, expect } from 'vitest';
import { evaluatePolicy, type HeaderConfig } from './policyEvaluator';

const defaultConfig: HeaderConfig = {
    xFrameOptions: undefined,
    csp: { enabled: false, frameAncestors: undefined, scriptSrc: undefined },
    xContentTypeOptions: undefined,
    referrerPolicy: undefined,
    hsts: { enabled: false, maxAge: 0, includeSubDomains: false, preload: false },
    coop: undefined,
    coep: undefined,
    corp: undefined,
    cors: { allowOrigin: undefined },
    permissionsPolicy: { enabled: false, features: {} },
};

describe('Policy Evaluator', () => {
    it('should allow everything by default', () => {
        const result = evaluatePolicy(defaultConfig);
        expect(result.clickjacking.allowed).toBe(true);
        expect(result.inlineScript.allowed).toBe(true);
        expect(result.mimeSniffing.risk).toBe('high');
        expect(result.cors.fetchAllowed).toBe(false);
    });

    describe('Clickjacking', () => {
        it('should block if X-Frame-Options is DENY', () => {
            const result = evaluatePolicy({ ...defaultConfig, xFrameOptions: 'DENY' });
            expect(result.clickjacking.allowed).toBe(false);
            expect(result.clickjacking.reason).toContain('DENY');
        });

        it('should block if X-Frame-Options is SAMEORIGIN', () => {
            const result = evaluatePolicy({ ...defaultConfig, xFrameOptions: 'SAMEORIGIN' });
            expect(result.clickjacking.allowed).toBe(false);
            expect(result.clickjacking.reason).toContain('SAMEORIGIN');
        });

        it('should block if CSP frame-ancestors is none', () => {
            const result = evaluatePolicy({ ...defaultConfig, csp: { ...defaultConfig.csp, enabled: true, frameAncestors: "'none'" } });
            expect(result.clickjacking.allowed).toBe(false);
            expect(result.clickjacking.reason).toContain("'none'");
        });

        it('should take precedence CSP over XFO', () => {
            const result = evaluatePolicy({
                ...defaultConfig,
                xFrameOptions: 'SAMEORIGIN', // Block
                csp: { enabled: true, frameAncestors: 'https://attacker.com', scriptSrc: undefined } // Allow (in this simplified logic)
            });
            // In my simplified logic, I didn't explicitly clear XFO if CSP is present, but browsers ignore XFO if CSP frame-ancestors is present.
            // Let's see how I implemented it.
            // Implementation:
            // if (csp.enabled && frameAncestors) { ... } else if (xFrameOptions) { ... }
            // So yes, it takes precedence.
            expect(result.clickjacking.allowed).toBe(true);
            expect(result.clickjacking.reason).toContain('Allowed by CSP');
        });
    });

    describe('Inline Script', () => {
        it('should block if CSP enabled and no unsafe-inline', () => {
            const result = evaluatePolicy({ ...defaultConfig, csp: { enabled: true, scriptSrc: "'self'", frameAncestors: undefined } });
            expect(result.inlineScript.allowed).toBe(false);
            expect(result.inlineScript.reason).toContain('missing');
        });

        it('should allow if CSP enabled and has unsafe-inline', () => {
            const result = evaluatePolicy({ ...defaultConfig, csp: { enabled: true, scriptSrc: "'self' 'unsafe-inline'", frameAncestors: undefined } });
            expect(result.inlineScript.allowed).toBe(true);
            expect(result.inlineScript.reason).toContain('unsafe-inline');
        });
    });

    describe('MIME Sniffing', () => {
        it('should result in low risk if nosniff is set', () => {
            const result = evaluatePolicy({ ...defaultConfig, xContentTypeOptions: 'nosniff' });
            expect(result.mimeSniffing.risk).toBe('low');
        });
    });
});
