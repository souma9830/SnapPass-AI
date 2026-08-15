import AuditLog from '../models/auditLog.model.js';
import { formatAuditCSV, formatAuditNDJSON, formatAuditJSON } from '../utils/auditFormatter.utils.js';
import { validateAuditExportQuery } from '../validation/auditQuery.validation.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.method) filter.method = req.query.method.toUpperCase();
    if (req.query.statusCode) filter.statusCode = parseInt(req.query.statusCode, 10);
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.search) {
      filter.endpoint = { $regex: req.query.search, $options: 'i' };
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const getAuditStats = async (req, res, next) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [totalRequests, errorCount, methodBreakdown, topEndpoints] = await Promise.all([
      AuditLog.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      AuditLog.countDocuments({ createdAt: { $gte: oneDayAgo }, statusCode: { $gte: 400 } }),
      AuditLog.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $group: { _id: '$method', count: { $sum: 1 } } },
      ]),
      AuditLog.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $group: { _id: '$endpoint', count: { $sum: 1 }, avgDuration: { $avg: '$durationMs' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return res.json({
      success: true,
      data: {
        totalRequests24h: totalRequests,
        errorCount24h: errorCount,
        errorRate24h: totalRequests ? ((errorCount / totalRequests) * 100).toFixed(2) : 0,
        methodBreakdown,
        topEndpoints,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const exportAuditLogs = async (req, res, next) => {
  try {
    const { format = 'csv', startDate, endDate } = req.query;
    const validation = validateAuditExportQuery(req.query);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(1000).lean();

    if (format.toLowerCase() === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
      return res.send(formatAuditCSV(logs));
    }
    if (format.toLowerCase() === 'ndjson') {
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.ndjson"');
      return res.send(formatAuditNDJSON(logs));
    }
    res.setHeader('Content-Type', 'application/json');
    return res.send(formatAuditJSON(logs));
  } catch (err) {
    return next(err);
  }
};
