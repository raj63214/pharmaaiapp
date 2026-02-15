
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging for Audit Trail (Simplified version for middleware)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);
    next();
});

// API Routes
app.use('/api/v1', apiRoutes);

// Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Critical Backend Failure' });
});

app.listen(PORT, () => {
    console.log(`AstraPharmacy ERP Backend running on port ${PORT}`);
    console.log(`Access target: http://localhost:${PORT}/api/v1`);
});
