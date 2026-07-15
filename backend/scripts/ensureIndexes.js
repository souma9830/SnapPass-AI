import mongoose from 'mongoose';
import { config } from '../src/config/config.js';

async function ensureIndexes() {
  if (!config.MONGO_URI) {
    console.log('MONGO_URI not set. Skipping index creation.');
    process.exit(0);
  }

  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    const models = [
      (await import('../src/models/user.model.js')).default,
      (await import('../src/models/upload.model.js')).default,
      (await import('../src/models/UploadHistory.js')).default,
      (await import('../src/models/processedImage.model.js')).default,
      (await import('../src/models/session.model.js')).default,
      (await import('../src/models/testimonial.model.js')).default,
      (await import('../src/models/printSheet.model.js')).default,
      (await import('../src/models/preset.model.js')).default,
      (await import('../src/models/passwordResetOtp.model.js')).default,
      (await import('../src/models/auditLog.model.js')).default,
    ];

    for (const model of models) {
      const name = model.collection.name;
      if (!collectionNames.includes(name)) {
        console.log(`Collection "${name}" does not exist yet. Skipping.`);
        continue;
      }
      console.log(`Ensuring indexes for "${name}"...`);
      await model.createIndexes();
      const indexes = await model.collection.indexes();
      console.log(`  ${indexes.length} index(es) present.`);
    }

    console.log('\nIndex verification complete.');
  } catch (err) {
    console.error('Index creation failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

ensureIndexes();
