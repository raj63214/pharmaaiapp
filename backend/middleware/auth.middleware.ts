
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'astra-pharmacy-prod-secret-9912';

// Fix: Use intersection type to ensure AuthRequest correctly inherits all properties from Express Request (like headers, body, query)
export type AuthRequest = Request & {
    user?: {
        id: string;
        role: string;
        permissions: string[];
    };
};

/**
 * Validates JWT Token from Authorization header
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Fix: Accessing headers on the intersected AuthRequest type which now correctly includes standard Request properties
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

/**
 * Checks if the authenticated user has specific permission
 */
export const authorize = (requiredPermission: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user?.permissions.includes(requiredPermission)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
        }
        next();
    };
};

/**
 * Restricts access to specific LAN IP ranges if configured
 */
export const lanRestriction = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress;
    const allowedRange = process.env.ALLOWED_LAN_RANGE; // e.g. "192.168.1."
    
    if (allowedRange && clientIp && !clientIp.includes(allowedRange) && clientIp !== '::1') {
        return res.status(403).json({ error: 'Access restricted to local network only.' });
    }
    next();
};
