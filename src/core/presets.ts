import type { HeaderConfig } from './policyEvaluator';

export const PRESETS: Record<string, HeaderConfig> = {
    minimal: {
        xFrameOptions: 'SAMEORIGIN',
        csp: { enabled: true, frameAncestors: "'self'", scriptSrc: "'self' 'unsafe-inline'" },
        xContentTypeOptions: 'nosniff',
        referrerPolicy: 'strict-origin-when-cross-origin',
        hsts: { enabled: false, maxAge: 0, includeSubDomains: false, preload: false },
        coop: undefined,
        coep: undefined,
        corp: undefined,
        cors: { allowOrigin: undefined },
        permissionsPolicy: { enabled: false, features: {} }
    },
    strict: {
        xFrameOptions: 'DENY',
        csp: { enabled: true, frameAncestors: "'none'", scriptSrc: "'self'" },
        xContentTypeOptions: 'nosniff',
        referrerPolicy: 'no-referrer',
        hsts: { enabled: true, maxAge: 63072000, includeSubDomains: true, preload: true },
        coop: 'same-origin',
        coep: 'require-corp',
        corp: 'same-origin',
        cors: { allowOrigin: undefined },
        permissionsPolicy: { enabled: true, features: {} }
    },
    api: {
        xFrameOptions: 'DENY',
        csp: { enabled: true, frameAncestors: "'none'", scriptSrc: "'none'" },
        xContentTypeOptions: 'nosniff',
        referrerPolicy: 'no-referrer',
        hsts: { enabled: true, maxAge: 31536000, includeSubDomains: true, preload: false },
        coop: undefined,
        coep: undefined,
        corp: undefined,
        cors: { allowOrigin: '*' },
        permissionsPolicy: { enabled: false, features: {} }
    }
};
