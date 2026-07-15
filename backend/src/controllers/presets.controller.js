import mongoose from 'mongoose';
import Preset from '../models/preset.model.js';
import { getCache, setCache, deleteCache } from '../config/redis.js';
import { successResponse, errorResponse } from '../utils/httpResponse.js';

export const PHOTO_SIZE_PRESETS = ["35x45", "51x51", "33x48", "40x60", "2x2in", "100x150", "25x25", "50x70", "45x45", "35x50"];

export const PHOTO_SIZE_DETAILS = [
  { id: "35x45", label: "35×45 mm (India / UK)", widthMm: 35, heightMm: 45 },
  { id: "51x51", label: "51×51 mm (USA Visa)", widthMm: 51, heightMm: 51 },
  { id: "33x48", label: "33×48 mm (Schengen Visa)", widthMm: 33, heightMm: 48 },
  { id: "40x60", label: "40×60 mm (China Visa)", widthMm: 40, heightMm: 60 },
  { id: "2x2in", label: '2×2 inch (US Passport)', widthMm: 50.8, heightMm: 50.8 },
  { id: "100x150", label: "100×150 mm (Postcard Size)", widthMm: 100, heightMm: 150 },
  { id: "25x25", label: "25×25 mm (Stamp Size)", widthMm: 25, heightMm: 25 },
  { id: "50x70", label: "50×70 mm (Canada Passport)", widthMm: 50, heightMm: 70 },
  { id: "45x45", label: "45×45 mm (Japan Passport / Visa)", widthMm: 45, heightMm: 45 },
  { id: "35x50", label: "35×50 mm (Malaysia Passport)", widthMm: 35, heightMm: 50 },
];

const CACHE_TTL = 3600;

export const getPresets = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return successResponse(res, PHOTO_SIZE_DETAILS, 'Presets fetched successfully');
    }

    const cacheKey = 'presets:all';
    const cached = await getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, 'Presets fetched successfully');
    }

    const presets = await Preset.find({ active: true })
      .sort({ order: 1 })
      .lean();
    await setCache(cacheKey, presets, CACHE_TTL);

    successResponse(res, presets, 'Presets fetched successfully');
  } catch (err) {
    next(err);
  }
};

export const getPresetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const preset = PHOTO_SIZE_DETAILS.find(p => p.id === id);
      if (!preset) {
        return errorResponse(res, 'Preset not found', 404);
      }
      return successResponse(res, preset, 'Preset fetched successfully');
    }
    const cacheKey = `presets:${id}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, 'Preset fetched successfully');
    }

    const preset = await Preset.findById(id).lean();
    if (!preset) {
      return errorResponse(res, 'Preset not found', 404);
    }

    await setCache(cacheKey, preset, CACHE_TTL);
    successResponse(res, preset, 'Preset fetched successfully');
  } catch (err) {
    next(err);
  }
};

export const createPreset = async (req, res, next) => {
  try {
    const preset = await Preset.create(req.body);
    await deleteCache('presets:all');
    successResponse(res, preset, 'Preset created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updatePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const preset = await Preset.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!preset) {
      return errorResponse(res, 'Preset not found', 404);
    }
    await deleteCache('presets:all');
    await deleteCache(`presets:${id}`);
    successResponse(res, preset, 'Preset updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deletePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const preset = await Preset.findByIdAndDelete(id);
    if (!preset) {
      return errorResponse(res, 'Preset not found', 404);
    }
    await deleteCache('presets:all');
    await deleteCache(`presets:${id}`);
    successResponse(res, preset, 'Preset deleted successfully');
  } catch (err) {
    next(err);
  }
};
