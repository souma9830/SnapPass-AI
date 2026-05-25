import Upload from "../models/upload.model.js";
import User from "../models/user.model.js";
import PrintSheet from "../models/printSheet.model.js";
import ProcessedImage from "../models/processedImage.model.js";
import Settings from "../models/settings.model.js";

export async function countUploads() {
  return Upload.countDocuments();
}

export async function countUploadsToday() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Upload.countDocuments({ createdAt: { $gte: start } });
}

export async function countSheets() {
  return PrintSheet.countDocuments();
}

export async function countProcessedImages() {
  return ProcessedImage.countDocuments();
}

export async function countUsers() {
  return User.countDocuments();
}

export async function findRecentUploads(limit = 50, skip = 0) {
  return Upload.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "email fullName")
    .lean();
}

export async function deleteUploadById(id) {
  return Upload.findByIdAndDelete(id);
}

export async function findUploadById(id) {
  return Upload.findById(id);
}

export async function getSettingsDoc() {
  let doc = await Settings.findOne();
  if (!doc) {
    doc = await Settings.create({});
  }
  return doc;
}

export async function updateSettingsDoc(data) {
  let doc = await Settings.findOne();
  if (!doc) {
    doc = await Settings.create(data);
  } else {
    Object.assign(doc, data);
    await doc.save();
  }
  return doc;
}

export async function findUsers(limit = 50, skip = 0) {
  return User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

