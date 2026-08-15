import request from 'supertest';
import app from '../app.js';

describe('Process Queue & Job History API', () => {
  let createdJobId = null;

  it('should list process jobs (empty or initial list)', async () => {
    const res = await request(app).get('/api/process/jobs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should create a process job', async () => {
    const res = await request(app).post('/api/process/job').send({
      filename: 'sample.jpg',
      backgroundColour: 'white',
      photoSizePreset: '35x45',
      attire: 'male_suit',
    });

    expect(res.statusCode).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('jobId');
    createdJobId = res.body.data.jobId;
  });

  it('should retrieve status for created job', async () => {
    expect(createdJobId).toBeTruthy();
    const res = await request(app).get(`/api/process/job/${createdJobId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('status');
    expect(res.body.data).toHaveProperty('progress');
  });

  it('should support retrying a job', async () => {
    expect(createdJobId).toBeTruthy();
    const res = await request(app).post(`/api/process/job/${createdJobId}/retry`).send({});
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.jobId).toBe(createdJobId);
  });

  it('should delete a job', async () => {
    expect(createdJobId).toBeTruthy();
    const res = await request(app).delete(`/api/process/job/${createdJobId}`);
    expect(res.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/process/job/${createdJobId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
