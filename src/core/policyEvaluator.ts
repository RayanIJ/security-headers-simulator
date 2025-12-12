export interface HeaderConfig {
    xFrameOptions: 'DENY' | 'SAMEORIGIN' | undefined;
    csp: {
        enabled: boolean;
        frameAncestors: string | undefined; // e.g. "'none'", "'self'", "https://attacker.com"
        scriptSrc: string | undefined; // e.g. "'self'", "'unsafe-inline'"
    };
    xContentTypeOptions: 'nosniff' | undefined;
    referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | undefined;
    hsts: {
        enabled: boolean;
        maxAge: number;
        includeSubDomains: boolean;
        preload: boolean;
    };
    coop: 'unsafe-none' | 'same-origin-allow-popups' | 'same-origin' | undefined;
    coep: 'unsafe-none' | 'require-corp' | 'credentialless' | undefined;
    corp: 'same-site' | 'same-origin' | 'cross-origin' | undefined;
    cors: {
        allowOrigin: string | undefined; // e.g. "*", "https://foo.com"
    };
    permissionsPolicy: {
        enabled: boolean;
        features: Record<string, string[]>; // e.g. camera: ['self']
    };
}

export interface SimulationResult {
    clickjacking: {
        allowed: boolean;
        reason: string;
    };
    inlineScript: {
        allowed: boolean;
        reason: string;
    };
    mimeSniffing: {
        risk: 'low' | 'high';
        reason: string;
    };
    referrerLeakage: {
        explanation: string;
        exampleHeader: string;
    };
    cors: {
        fetchAllowed: boolean;
        reason: string;
    };
    isolation: {
        status: 'none' | 'partial' | 'isolated';
        reason: string;
    };
}

export function evaluatePolicy(config: HeaderConfig): SimulationResult {
    const result: SimulationResult = {
        clickjacking: { allowed: true, reason: 'No protection configured.' },
        inlineScript: { allowed: true, reason: 'No CSP script-src protection.' },
        mimeSniffing: { risk: 'high', reason: 'Browser may mime-sniff content.' },
        referrerLeakage: { explanation: 'Default browser behavior (usually strict-origin-when-cross-origin).', exampleHeader: 'Referer: https://example.com/page' },
        cors: { fetchAllowed: false, reason: 'No Access-Control-Allow-Origin header.' },
        isolation: { status: 'none', reason: 'No Cross-Origin isolation headers.' },
    };

    // 1. Clickjacking
    // Priority: CSP frame-ancestors > X-Frame-Options
    if (config.csp.enabled && config.csp.frameAncestors) {
        if (config.csp.frameAncestors === "'none'") {
            result.clickjacking = { allowed: false, reason: "Blocked by CSP frame-ancestors 'none'." };
        } else if (config.csp.frameAncestors === "'self'") {
            result.clickjacking = { allowed: false, reason: "Blocked by CSP frame-ancestors 'self' (attacker is cross-origin)." };
        } else {
            // Simplified check
            result.clickjacking = { allowed: true, reason: `Allowed by CSP frame-ancestors ${config.csp.frameAncestors}.` };
        }
    } else if (config.xFrameOptions) {
        if (config.xFrameOptions === 'DENY') {
            result.clickjacking = { allowed: false, reason: "Blocked by X-Frame-Options: DENY." };
        } else if (config.xFrameOptions === 'SAMEORIGIN') {
            result.clickjacking = { allowed: false, reason: "Blocked by X-Frame-Options: SAMEORIGIN (attacker is cross-origin)." };
        }
    }

    // 2. Inline Script
    if (config.csp.enabled && config.csp.scriptSrc) {
        const src = config.csp.scriptSrc;
        if (!src.includes("'unsafe-inline'")) {
            result.inlineScript = { allowed: false, reason: "Blocked by CSP script-src (missing 'unsafe-inline')." };
        } else {
            result.inlineScript = { allowed: true, reason: "Allowed because CSP script-src includes 'unsafe-inline'." };
        }
    }

    // 3. MIME Sniffing
    if (config.xContentTypeOptions === 'nosniff') {
        result.mimeSniffing = { risk: 'low', reason: "Prevented by X-Content-Type-Options: nosniff." };
    }

    // 4. Referrer Policy
    if (config.referrerPolicy) {
        result.referrerLeakage = {
            explanation: `Policy is ${config.referrerPolicy}.`,
            exampleHeader: config.referrerPolicy === 'no-referrer' ? '(no header)' : 'Referer: ...'
        };
        // Refine this later with more specifics if needed
    }

    // 5. CORS
    // Assuming a cross-origin fetch from attacker.com
    if (config.cors.allowOrigin === '*') {
        result.cors = { fetchAllowed: true, reason: "Allowed by Access-Control-Allow-Origin: *." };
    } else if (config.cors.allowOrigin === 'https://attacker.com') {
        result.cors = { fetchAllowed: true, reason: "Allowed by specific Access-Control-Allow-Origin." };
    } else if (config.cors.allowOrigin) {
        result.cors = { fetchAllowed: false, reason: `Blocked. Allow-Origin '${config.cors.allowOrigin}' does not match attacker.` };
    }

    // 6. Isolation
    if (config.coop === 'same-origin' && config.coep === 'require-corp') {
        result.isolation = { status: 'isolated', reason: "High security: Cross-Origin Isolated." };
    } else if (config.coop || config.coep) {
        result.isolation = { status: 'partial', reason: "Partial isolation headers present." };
    }

    return result;
}
