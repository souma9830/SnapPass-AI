import catchAsync from "../utils/catchAsync.js";
import * as adminService from "../service/admin.service.js";

const sendResponse = (res, statusCode, success, message, data) => {
  res.status(statusCode).json({ success, message, data });
};

export const getStats = catchAsync(async (_req, res) => {
  const stats = await adminService.getDashboardStats();
  sendResponse(res, 200, true, "Admin stats retrieved", stats);
});

export const getUploads = catchAsync(async (req, res) => {
  const uploads = await adminService.getRecentUploads({
    page: req.query.page,
    limit: req.query.limit,
  });
  sendResponse(res, 200, true, "Uploads retrieved", uploads);
});

export const getSettings = catchAsync(async (_req, res) => {
  const settings = await adminService.getAppSettings();
  sendResponse(res, 200, true, "Settings retrieved", settings);
});

export const updateSettings = catchAsync(async (req, res) => {
  const settings = await adminService.updateAppSettings(req.body);
  sendResponse(res, 200, true, "Settings updated successfully", settings);
});

export const deleteUpload = catchAsync(async (req, res) => {
  const result = await adminService.deleteUploadRecord(req.params.id);
  sendResponse(res, 200, true, "Upload record deleted successfully", result);
});

export const getUsers = catchAsync(async (req, res) => {
  const users = await adminService.listUsers({
    page: req.query.page,
    limit: req.query.limit,
  });
  sendResponse(res, 200, true, "Users list retrieved successfully", users);
});

