/**
 * MongoDB initialization script for SnapPass AI.
 * Runs automatically when the MongoDB container starts for the first time.
 *
 * Creates the application database, application user, and seed data.
 * Only executes on an empty database (first container start).
 */

// Switch to the target database
db = db.getSiblingDB('snappass');

// Create application user with readWrite access
db.createUser({
  user: 'snappass_app',
  pwd: 'snappass_secret',
  roles: [
    { role: 'readWrite', db: 'snappass' },
    { role: 'dbAdmin', db: 'snappass' },
  ],
});

// Create core collections with schema validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'fullName', 'password'],
      properties: {
        email: { bsonType: 'string', pattern: '^[\\w.-]+@[\\w.-]+\\.\\w{2,}$' },
        fullName: { bsonType: 'string', minLength: 2 },
        role: { enum: ['user', 'admin'] },
      },
    },
  },
});

db.createCollection('uploads');
db.createCollection('processedimages');
db.createCollection('printsheets');
db.createCollection('testimonials');
db.createCollection('passwordresetotps');

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.uploads.createIndex({ user: 1, createdAt: -1 });
db.uploads.createIndex({ fileId: 1 }, { unique: true });
db.processedimages.createIndex({ user: 1, upload: 1, createdAt: -1 });
db.printsheets.createIndex({ user: 1, createdAt: -1 });
db.testimonials.createIndex({ status: 1, createdAt: -1 });
db.passwordresetotps.createIndex({ userId: 1, createdAt: -1 });
db.passwordresetotps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Insert seed admin user (password: Admin@123, will be hashed by the app)
db.users.insertOne({
  email: 'admin@snappass.ai',
  fullName: 'SnapPass Admin',
  password: '[pre-hashed-by-application]',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Insert seed testimonials
db.testimonials.insertMany([
  {
    name: 'Priya Sharma',
    rating: 5,
    comment: 'SnapPass AI saved me so much time! I needed urgent passport photos and got them in minutes.',
    status: 'approved',
    createdAt: new Date('2026-01-15'),
    isSeed: true,
  },
  {
    name: 'James Wilson',
    rating: 5,
    comment: 'The AI background removal is flawless. Much better than the photo booth at my local post office.',
    status: 'approved',
    createdAt: new Date('2026-02-20'),
    isSeed: true,
  },
  {
    name: 'Aisha Patel',
    rating: 4,
    comment: 'Great tool for visa applications. The size presets are exactly what I needed for my Schengen visa.',
    status: 'approved',
    createdAt: new Date('2026-03-10'),
    isSeed: true,
  },
  {
    name: 'Michael Chen',
    rating: 5,
    comment: 'Open source, privacy-respecting, and actually works. This is how online tools should be built.',
    status: 'approved',
    createdAt: new Date('2026-04-05'),
    isSeed: true,
  },
]);

print('✔ MongoDB initialization complete for SnapPass AI.');
print('  - Database: snappass');
print('  - Collections: users, uploads, processedimages, printsheets, testimonials, passwordresetotps');
print('  - Seed data: 1 admin user, 4 testimonials');
