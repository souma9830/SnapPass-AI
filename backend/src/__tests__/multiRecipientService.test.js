/**
 * Multi-Recipient Service Tests
 */

const mongoose = require('mongoose');
const MultiRecipientService = require('../services/multiRecipientService');
const PasswordShare = require('../models/PasswordShare');
const ShareRecipient = require('../models/ShareRecipient');

describe('MultiRecipientService', () => {
  describe('createMultiRecipientShare', () => {
    test('should create share with multiple recipients', async () => {
      const options = {
        encryptedPassword: 'encrypted_content_123',
        expirationMinutes: 60,
        recipients: ['user1@example.com', 'user2@example.com'],
        description: 'Test share',
      };

      const result = await MultiRecipientService.createMultiRecipientShare(options);

      expect(result.share).toBeDefined();
      expect(result.share.shareId).toBeDefined();
      expect(result.recipients).toHaveLength(2);
      expect(result.totalRecipients).toBe(2);
    });

    test('should reject share with no recipients', async () => {
      const options = {
        encryptedPassword: 'encrypted_content',
        expirationMinutes: 60,
        recipients: [],
      };

      await expect(
        MultiRecipientService.createMultiRecipientShare(options)
      ).rejects.toThrow('At least one recipient is required');
    });

    test('should reject share with more than 100 recipients', async () => {
      const recipients = Array.from({ length: 101 }, (_, i) => `user${i}@example.com`);
      const options = {
        encryptedPassword: 'encrypted_content',
        expirationMinutes: 60,
        recipients,
      };

      await expect(
        MultiRecipientService.createMultiRecipientShare(options)
      ).rejects.toThrow('Maximum 100 recipients per share');
    });

    test('should generate unique access tokens for each recipient', async () => {
      const options = {
        encryptedPassword: 'encrypted_content',
        expirationMinutes: 60,
        recipients: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
      };

      const result = await MultiRecipientService.createMultiRecipientShare(options);
      const tokens = result.recipients.map(r => r.accessToken);
      const uniqueTokens = new Set(tokens);

      expect(uniqueTokens.size).toBe(tokens.length);
    });

    test('should set correct expiration time', async () => {
      const options = {
        encryptedPassword: 'encrypted_content',
        expirationMinutes: 120,
        recipients: ['user1@example.com'],
      };

      const beforeCreate = new Date();
      const result = await MultiRecipientService.createMultiRecipientShare(options);
      const afterCreate = new Date();

      const expectedMin = new Date(beforeCreate.getTime() + 120 * 60000);
      const expectedMax = new Date(afterCreate.getTime() + 120 * 60000);

      expect(result.share.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime());
      expect(result.share.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax.getTime());
    });

    test('should normalize email addresses to lowercase', async () => {
      const options = {
        encryptedPassword: 'encrypted_content',
        expirationMinutes: 60,
        recipients: ['User1@Example.com', 'USER2@EXAMPLE.COM'],
      };

      const result = await MultiRecipientService.createMultiRecipientShare(options);

      expect(result.recipients[0].email).toBe('user1@example.com');
      expect(result.recipients[1].email).toBe('user2@example.com');
    });
  });

  describe('addRecipients', () => {
    test('should add new recipients to existing share', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_1',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const result = await MultiRecipientService.addRecipients(share._id, ['new@example.com']);

      expect(result.addedCount).toBe(1);
      expect(result.recipients).toHaveLength(1);
    });

    test('should reject adding recipients to expired share', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_2',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(
        MultiRecipientService.addRecipients(share._id, ['new@example.com'])
      ).rejects.toThrow('Cannot add recipients to expired or revoked share');
    });

    test('should reject adding recipients if limit exceeded', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_3',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const existingRecipients = Array.from({ length: 98 }, (_, i) =>
        ({ shareId: share._id, recipientEmail: `existing${i}@example.com` })
      );
      await ShareRecipient.insertMany(existingRecipients);

      const newRecipients = Array.from({ length: 3 }, (_, i) =>
        `new${i}@example.com`
      );

      await expect(
        MultiRecipientService.addRecipients(share._id, newRecipients)
      ).rejects.toThrow('exceed limit of 100');
    });
  });

  describe('revokeRecipient', () => {
    test('should revoke access for specific recipient', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_4',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const recipient = await ShareRecipient.create({
        shareId: share._id,
        recipientEmail: 'user@example.com',
        status: 'accessed',
      });

      const result = await MultiRecipientService.revokeRecipient(
        share._id,
        'user@example.com',
        'owner123',
        'No longer needed'
      );

      expect(result.email).toBe('user@example.com');
      expect(result.previousStatus).toBe('accessed');
    });

    test('should reject revoke for nonexistent recipient', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_5',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      await expect(
        MultiRecipientService.revokeRecipient(share._id, 'nonexistent@example.com', 'owner')
      ).rejects.toThrow('Recipient not found');
    });
  });

  describe('revokeAllRecipients', () => {
    test('should revoke all recipients for a share', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_6',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      await ShareRecipient.insertMany([
        { shareId: share._id, recipientEmail: 'user1@example.com' },
        { shareId: share._id, recipientEmail: 'user2@example.com' },
        { shareId: share._id, recipientEmail: 'user3@example.com' },
      ]);

      const result = await MultiRecipientService.revokeAllRecipients(
        share._id,
        'owner123',
        'Share revoked'
      );

      expect(result.revokedCount).toBe(3);
      expect(result.shareId).toBe('test_share_6');
    });
  });

  describe('recordAccess', () => {
    test('should record access and update counts', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_7',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const recipient = await ShareRecipient.create({
        shareId: share._id,
        recipientEmail: 'user@example.com',
        accessToken: 'token123',
        status: 'pending',
      });

      const result = await MultiRecipientService.recordAccess(
        'token123',
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(result.shareId).toBe('test_share_7');
      expect(result.accessedAt).toBeDefined();
    });

    test('should update recipient status to accessed', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_8',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const recipient = await ShareRecipient.create({
        shareId: share._id,
        recipientEmail: 'user@example.com',
        accessToken: 'token456',
        status: 'pending',
      });

      await MultiRecipientService.recordAccess('token456', '192.168.1.1', 'Mozilla/5.0');

      const updated = await ShareRecipient.findById(recipient._id);
      expect(updated.status).toBe('accessed');
    });

    test('should reject access with invalid token', async () => {
      await expect(
        MultiRecipientService.recordAccess('invalid_token', '192.168.1.1', 'Mozilla/5.0')
      ).rejects.toThrow('Invalid access token');
    });

    test('should reject access for revoked recipient', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_9',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const recipient = await ShareRecipient.create({
        shareId: share._id,
        recipientEmail: 'user@example.com',
        accessToken: 'token789',
        status: 'revoked',
      });

      await expect(
        MultiRecipientService.recordAccess('token789', '192.168.1.1', 'Mozilla/5.0')
      ).rejects.toThrow('revoked');
    });

    test('should enforce recipient access limit', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_10',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const recipient = await ShareRecipient.create({
        shareId: share._id,
        recipientEmail: 'user@example.com',
        accessToken: 'token_limit',
        status: 'pending',
        maxAccessCount: 1,
        accessCount: 1,
      });

      await expect(
        MultiRecipientService.recordAccess('token_limit', '192.168.1.1', 'Mozilla/5.0')
      ).rejects.toThrow('access limit reached');
    });
  });

  describe('checkAccessStatus', () => {
    test('should return access status for valid token', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_11',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const recipient = await ShareRecipient.create({
        shareId: share._id,
        recipientEmail: 'user@example.com',
        accessToken: 'status_token',
      });

      const status = await MultiRecipientService.checkAccessStatus('status_token');

      expect(status.hasAccess).toBe(true);
      expect(status.recipientEmail).toBe('user@example.com');
    });

    test('should deny access for revoked recipient', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_12',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const recipient = await ShareRecipient.create({
        shareId: share._id,
        recipientEmail: 'user@example.com',
        accessToken: 'revoked_token',
        status: 'revoked',
      });

      const status = await MultiRecipientService.checkAccessStatus('revoked_token');

      expect(status.hasAccess).toBe(false);
      expect(status.reason).toBe('Access revoked');
    });
  });

  describe('getShareDetails', () => {
    test('should return complete share information', async () => {
      const share = await PasswordShare.create({
        shareId: 'test_share_13',
        encryptedPassword: 'encrypted_content',
        expiresAt: new Date(Date.now() + 3600000),
      });

      await ShareRecipient.insertMany([
        { shareId: share._id, recipientEmail: 'user1@example.com', status: 'pending' },
        { shareId: share._id, recipientEmail: 'user2@example.com', status: 'accessed' },
        { shareId: share._id, recipientEmail: 'user3@example.com', status: 'revoked' },
      ]);

      const details = await MultiRecipientService.getShareDetails(share._id);

      expect(details.recipients).toHaveLength(3);
      expect(details.stats.total).toBe(3);
      expect(details.stats.pending).toBe(1);
      expect(details.stats.accessed).toBe(1);
      expect(details.stats.revoked).toBe(1);
    });
  });
});
