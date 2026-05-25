import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as adminDao from "../dao/admin.dao.js";
import { config } from "../config/config.js";
import { getPagination } from "../utils/pagination.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



let mockUploads = [
  {
    id: "mock-upload-1",
    fileId: "file-101",
    fileName: "passport_photo_john.png",
    sizeBytes: 2048500,
    preset: "US Passport",
    background: "Blue",
    status: "processed",
    userEmail: "john.doe@example.com",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    fileUrl: "/uploads/mock-passport-1.jpg",
  },
  {
    id: "mock-upload-2",
    fileId: "file-102",
    fileName: "id_card_mary.jpg",
    sizeBytes: 1548200,
    preset: "Schengen Visa",
    background: "White",
    status: "processing",
    userEmail: "mary.smith@example.com",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    fileUrl: null,
  },
  {
    id: "mock-upload-3",
    fileId: "file-103",
    fileName: "selfie_raw.webp",
    sizeBytes: 4500000,
    preset: "Custom Passport",
    background: "Grey",
    status: "uploaded",
    userEmail: "alex.jones@example.com",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    fileUrl: null,
  },
  {
    id: "mock-upload-4",
    fileId: "file-104",
    fileName: "damaged_input.png",
    sizeBytes: 890000,
    preset: "UK Passport",
    background: "White",
    status: "failed",
    userEmail: "hacker@example.com",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    fileUrl: null,
  }
];

let mockUsers = [
  {
    id: "mock-user-1",
    fullName: "Mock Administrator",
    email: "admin@snappass.ai",
    role: "admin",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 100000000).toISOString(),
  },
  {
    id: "mock-user-2",
    fullName: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    isActive: true,
    lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 50000000).toISOString(),
  },
  {
    id: "mock-user-3",
    fullName: "Mary Smith",
    email: "mary.smith@example.com",
    role: "user",
    isActive: true,
    lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 40000000).toISOString(),
  }
];

export async function getDashboardStats() {
  if (global.USE_MOCK_DB) {
    return {
      totalUploads: mockUploads.length,
      sheetsGenerated: 12,
      backgroundsUsed: 25,
      activeToday: 3,
      totalUsers: mockUsers.length,
    };
  }

  const [
    totalUploads,
    sheetsGenerated,
    backgroundsUsed,
    activeToday,
    totalUsers,
  ] = await Promise.all([
    adminDao.countUploads(),
    adminDao.countSheets(),
    adminDao.countProcessedImages(),
    adminDao.countUploadsToday(),
    adminDao.countUsers(),
  ]);

  return {
    totalUploads,
    sheetsGenerated,
    backgroundsUsed,
    activeToday,
    totalUsers,
  };
}

export async function getRecentUploads({ page = 1, limit = 50 } = {}) {
  if (global.USE_MOCK_DB) {
    return mockUploads;
  }

  const { safeLimit, safePage, skip } = getPagination(page, limit);

  const uploads = await adminDao.findRecentUploads(safeLimit, skip);

  return uploads.map((row) => ({
    id: row._id,
    fileId: row.fileId,
    fileName: row.originalName,
    sizeBytes: row.sizeBytes,
    preset: row.preset ?? null,
    background: row.background ?? null,
    status: row.status,
    userEmail: row.user?.email ?? null,
    createdAt: row.createdAt,
    fileUrl: row.fileUrl,
  }));
}

export async function getAppSettings() {
  if (global.USE_MOCK_DB) {
    return mockSettings;
  }

  const doc = await adminDao.getSettingsDoc();
  return {
    maxFileSizeBytes: doc.maxFileSizeBytes ?? config.MAX_FILE_SIZE,
    allowedMimeTypes: doc.allowedMimeTypes ?? config.upload.allowedMimeTypes,
    uploadDir: doc.uploadDir ?? config.UPLOAD_DIR,
    corsOrigin: doc.corsOrigin ?? config.CORS_ORIGIN,
    aiServiceUrl: doc.aiServiceUrl ?? config.aiServiceUrl,
  };
}

export async function updateAppSettings(data) {
  if (global.USE_MOCK_DB) {
    Object.assign(mockSettings, data);
    return mockSettings;
  }

  const doc = await adminDao.updateSettingsDoc(data);
  return {
    maxFileSizeBytes: doc.maxFileSizeBytes,
    allowedMimeTypes: doc.allowedMimeTypes,
    uploadDir: doc.uploadDir,
    corsOrigin: doc.corsOrigin,
    aiServiceUrl: doc.aiServiceUrl,
  };
}

export async function deleteUploadRecord(id) {
  if (global.USE_MOCK_DB) {
    mockUploads = mockUploads.filter((item) => item.id !== id);
    return { success: true };
  }

  const upload = await adminDao.findUploadById(id);
  if (!upload) {
    throw new Error("Upload record not found");
  }

  // Attempt to delete physical file from disk if it starts with uploads/ or is in uploads directory
  if (upload.fileUrl) {
    // Standard file URL would be something like "/uploads/filename.jpg" or "uploads/filename.jpg"
    const relativePath = upload.fileUrl.startsWith("/") ? upload.fileUrl.slice(1) : upload.fileUrl;
    // Resolve absolute path in workspace
    const absoluteFilePath = path.join(__dirname, "..", "..", relativePath);
    try {
      if (fs.existsSync(absoluteFilePath)) {
        fs.unlinkSync(absoluteFilePath);
      }
    } catch (err) {
      console.error(`Failed to delete physical file: ${absoluteFilePath}`, err);
    }
  }

  await adminDao.deleteUploadById(id);
  return { success: true };
}

export async function listUsers({ page = 1, limit = 50 } = {}) {
  if (global.USE_MOCK_DB) {
    return mockUsers;
  }

  const { safeLimit, safePage, skip } = getPagination(page, limit);

  const users = await adminDao.findUsers(safeLimit, skip);
  return users.map((u) => ({
    id: u._id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt ?? null,
    createdAt: u.createdAt,
  }));
}
