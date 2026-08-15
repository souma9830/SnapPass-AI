import Session from '../models/session.model.js';

export async function cleanupExpiredInactiveSessions(inactivityWindowMs = 24 * 60 * 60 * 1000) {
  try {
    const cutoffDate = new Date(Date.now() - inactivityWindowMs);
    const result = await Session.updateMany(
      {
        isValid: true,
        updatedAt: { $lt: cutoffDate }
      },
      { isValid: false }
    );
    return { success: true, deactivatedCount: result.modifiedCount || 0 };
  } catch (err) {
    console.error('[SessionCleaner] Error deactivating inactive sessions:', err.message);
    return { success: false, error: err.message };
  }
}
