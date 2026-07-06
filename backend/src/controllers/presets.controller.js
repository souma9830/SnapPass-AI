import Preset from '../models/preset.model.js';
import { getCache, setCache, deleteCache } from '../config/redis.js';

const CACHE_TTL = 3600;

export const getPresets = async (req, res, next) => {
  try {
    const cacheKey = 'presets:all';
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({ success: true, presets: cached });
    }

    const presets = await Preset.find({ active: true })
      .sort({ order: 1 })
      .lean();
    await setCache(cacheKey, presets, CACHE_TTL);

    res.json({ success: true, presets });
  } catch (err) {
    next(err);
  }
};

export const getPresetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `presets:${id}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({ success: true, preset: cached });
    }

    const preset = await Preset.findById(id).lean();
    if (!preset) {
      return res
        .status(404)
        .json({ success: false, message: 'Preset not found' });
    }

    await setCache(cacheKey, preset, CACHE_TTL);
    res.json({ success: true, preset });
  } catch (err) {
    next(err);
  }
};

export const createPreset = async (req, res, next) => {
  try {
    const preset = await Preset.create(req.body);
    await deleteCache('presets:all');
    res.status(201).json({ success: true, preset });
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
      return res
        .status(404)
        .json({ success: false, message: 'Preset not found' });
    }
    await deleteCache('presets:all');
    await deleteCache(`presets:${id}`);
    res.json({ success: true, preset });
  } catch (err) {
    next(err);
  }
};

export const deletePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const preset = await Preset.findByIdAndDelete(id);
    if (!preset) {
      return res
        .status(404)
        .json({ success: false, message: 'Preset not found' });
    }
    await deleteCache('presets:all');
    await deleteCache(`presets:${id}`);
    res.json({ success: true, message: 'Preset deleted' });
  } catch (err) {
    next(err);
  }
};
