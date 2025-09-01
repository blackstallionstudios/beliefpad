import type { VercelRequest, VercelResponse } from '@vercel/node';

interface LogData {
  level: 'debug' | 'info' | 'warn' | 'error';
  component: string;
  message: string;
  data?: any;
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    sessionId?: string;
    timestamp: string;
    userAgent?: string;
    url?: string;
    [key: string]: any;
  };
  timestamp: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const logData: LogData = req.body;

    // Validate required fields
    if (!logData.level || !logData.component || !logData.message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add server-side metadata
    const enrichedLogData = {
      ...logData,
      serverTimestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      deploymentId: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      region: process.env.VERCEL_REGION || 'unknown',
    };

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Remote Log:', enrichedLogData);
    }

    // In production, you could send to external logging services like:
    // - LogRocket
    // - Sentry
    // - DataDog
    // - Custom logging service
    
    // For now, we'll just acknowledge receipt
    // You can extend this to send to your preferred logging service
    
    // Example: Send to external logging service
    // await sendToLoggingService(enrichedLogData);

    // Return success
    res.status(200).json({ 
      success: true, 
      message: 'Log received',
      logId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Error processing log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Example function for sending to external logging service
// async function sendToLoggingService(logData: any) {
//   // Implementation for your preferred logging service
//   // Example with a hypothetical service:
//   // await fetch('https://your-logging-service.com/api/logs', {
//   //   method: 'POST',
//   //   headers: { 'Authorization': `Bearer ${process.env.LOGGING_API_KEY}` },
//   //   body: JSON.stringify(logData)
//   // });
// }
