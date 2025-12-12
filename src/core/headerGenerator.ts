import type { HeaderConfig } from './policyEvaluator';

export function generateHeaders(config: HeaderConfig): Record<string, string> {
    const headers: Record<string, string> = {};

    if (config.xFrameOptions) {
        headers['X-Frame-Options'] = config.xFrameOptions;
    }

    if (config.csp.enabled) {
        const parts = [];
        if (config.csp.frameAncestors) {
            parts.push(`frame-ancestors ${config.csp.frameAncestors}`);
        }
        if (config.csp.scriptSrc) {
            parts.push(`script-src ${config.csp.scriptSrc}`);
        } else {
            // Only if enabled but no specific directive? 
            // Usually CSP needs at least one directive or report-uri, but for sim simplified:
            parts.push("default-src 'self'");
        }

        // Add defaults if they are not the ones we are toggling, to make it realistic
        // For this sim, we focus on what's toggled.
        headers['Content-Security-Policy'] = parts.join('; ');
    }

    if (config.xContentTypeOptions) {
        headers['X-Content-Type-Options'] = config.xContentTypeOptions;
    }

    if (config.hsts.enabled) {
        let val = `max-age=${config.hsts.maxAge}`;
        if (config.hsts.includeSubDomains) val += '; includeSubDomains';
        if (config.hsts.preload) val += '; preload';
        headers['Strict-Transport-Security'] = val;
    }

    if (config.cors.allowOrigin) {
        headers['Access-Control-Allow-Origin'] = config.cors.allowOrigin;
    }

    return headers;
}
