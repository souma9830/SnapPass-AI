class AnomalyDetectorService {
  constructor() {
    this.shareAccessLogs = new Map();
    this.ipAccessLogs = new Map();
    this.blockedIps = new Map();
    this.lockedShares = new Map();
    this.anomalyAlerts = [];
  }

  static evaluate(faceCount, occlusionScore) {
    const isMultiFace = faceCount > 1;
    return { isCompliant: faceCount === 1 && occlusionScore <= 0.4, isMultiFace, error: isMultiFace ? 'MULTI_FACE_REJECTED' : null };
  }

  isIpBlocked(ip) {
    const block = ip ? this.blockedIps.get(ip) : null;
    if (!block) return false;
    if (Date.now() > block.blockedUntil) {
      this.blockedIps.delete(ip);
      return false;
    }
    return true;
  }

  isShareLocked(shareId) {
    const lock = shareId ? this.lockedShares.get(shareId) : null;
    if (!lock) return false;
    if (Date.now() > lock.lockedUntil) {
      this.lockedShares.delete(shareId);
      return false;
    }
    return true;
  }

  addAlert(alert) {
    this.anomalyAlerts.unshift({ ...alert, timestamp: Date.now() });
    this.anomalyAlerts.length = Math.min(this.anomalyAlerts.length, 100);
  }

  blockIp(ip, durationMs = 15 * 60 * 1000, reason = 'Suspicious access pattern') {
    this.blockedIps.set(ip, { blockedUntil: Date.now() + durationMs, reason });
    this.addAlert({ type: 'IP_BLOCKED', target: ip, reason });
  }

  lockShare(shareId, durationMs = 10 * 60 * 1000, reason = 'Repeated failed attempts') {
    this.lockedShares.set(shareId, { lockedUntil: Date.now() + durationMs, reason });
    this.addAlert({ type: 'SHARE_LOCKED', target: shareId, reason });
  }

  recordAccessAttempt({ shareId, ip, userAgent = '', success = true, passwordAttempted = false }) {
    if (this.isIpBlocked(ip)) return { allowed: false, isBlocked: true, reason: this.blockedIps.get(ip).reason };
    if (this.isShareLocked(shareId)) return { allowed: false, isLocked: true, reason: this.lockedShares.get(shareId).reason };

    const now = Date.now();
    const entry = { timestamp: now, shareId, ip, userAgent, success, passwordAttempted };
    const shareLogs = (this.shareAccessLogs.get(shareId) || []).filter((item) => now - item.timestamp < 600000);
    const ipLogs = (this.ipAccessLogs.get(ip) || []).filter((item) => now - item.timestamp < 600000);
    shareLogs.unshift(entry);
    ipLogs.unshift(entry);
    if (shareId) this.shareAccessLogs.set(shareId, shareLogs);
    if (ip) this.ipAccessLogs.set(ip, ipLogs);

    const failures = shareLogs.filter((item) => !item.success && item.passwordAttempted && now - item.timestamp < 300000);
    if (shareId && failures.length >= 5) {
      const reason = 'Share link temporarily locked due to multiple failed password attempts.';
      this.lockShare(shareId, 600000, reason);
      return { allowed: false, isLocked: true, reason };
    }

    if (ipLogs.length >= 8) {
      const meanInterval = (ipLogs[0].timestamp - ipLogs[ipLogs.length - 1].timestamp) / (ipLogs.length - 1);
      if (meanInterval < 250) {
        const reason = 'Automated script retrieval pattern detected.';
        this.blockIp(ip, 900000, reason);
        return { allowed: false, isBlocked: true, reason };
      }
    }
    return { allowed: true, anomalyScore: 0 };
  }

  unblockIp(ip) {
    return Boolean(ip) && this.blockedIps.delete(String(ip).trim());
  }

  unlockShare(shareId) {
    return this.lockedShares.delete(shareId);
  }

  getSecurityMetrics() {
    for (const ip of this.blockedIps.keys()) this.isIpBlocked(ip);
    for (const shareId of this.lockedShares.keys()) this.isShareLocked(shareId);
    return {
      totalBlockedIpsCount: this.blockedIps.size,
      totalLockedSharesCount: this.lockedShares.size,
      totalAlertsCount: this.anomalyAlerts.length,
      activeBlockedIps: [...this.blockedIps].map(([ip, data]) => ({ ip, ...data })),
      activeLockedShares: [...this.lockedShares].map(([shareId, data]) => ({ shareId, ...data })),
      recentAlerts: this.anomalyAlerts.slice(0, 20),
    };
  }
}

export { AnomalyDetectorService };
export const anomalyDetectorService = new AnomalyDetectorService();
export default anomalyDetectorService;
