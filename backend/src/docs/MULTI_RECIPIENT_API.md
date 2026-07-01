# Multi-Recipient Password Sharing API

## Overview

The multi-recipient sharing system allows users to securely share passwords with multiple recipients simultaneously, with individual access control and revocation capabilities for each recipient.

## Database Schema

### PasswordShare Model

Represents a shared password that can have multiple recipients.

```javascript
{
  shareId: String,           // Unique share identifier
  ownerId: ObjectId,         // Owner user ID (optional)
  encryptedPassword: String, // Encrypted password content
  expiresAt: Date,          // Expiration timestamp
  maxAccessCount: Number,   // Max total accesses across all recipients
  totalAccessCount: Number, // Current total access count
  description: String,      // Share description/label
  accessedAt: Date,         // Last access timestamp
  ipAddresses: [String],    // List of IP addresses that accessed this share
  status: String,           // 'active', 'expired', 'revoked', 'accessed'
  createdAt: Date,
  updatedAt: Date
}
```

### ShareRecipient Model

Tracks individual recipient access and revocation.

```javascript
{
  shareId: ObjectId,           // Reference to PasswordShare
  recipientEmail: String,      // Recipient email address
  recipientId: ObjectId,       // Recipient user ID (if registered)
  accessToken: String,         // Unique token for this recipient
  status: String,              // 'pending', 'accepted', 'accessed', 'revoked'
  accessCount: Number,         // Number of times accessed by this recipient
  maxAccessCount: Number,      // Max accesses for this specific recipient
  firstAccessedAt: Date,       // First access timestamp
  lastAccessedAt: Date,        // Last access timestamp
  revokedAt: Date,             // Revocation timestamp
  revokedBy: ObjectId,         // User ID who revoked access
  revokeReason: String,        // Reason for revocation
  accessHistory: [{            // Detailed access logs
    accessedAt: Date,
    ipAddress: String,
    userAgent: String
  }],
  notificationsSent: Number,   // Count of notifications sent
  lastNotificationAt: Date,    // Last notification timestamp
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Create Multi-Recipient Share

**POST** `/api/share/multi-recipient`

Create a new password share for multiple recipients.

#### Request Body

```json
{
  "password": "secure_password_123",
  "recipients": ["user1@example.com", "user2@example.com", "user3@example.com"],
  "expirationMinutes": 120,
  "maxAccessCount": null,
  "description": "Database credentials - Q3 Project"
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "share": {
      "_id": "mongodb_id",
      "shareId": "unique_share_id",
      "expiresAt": "2026-06-12T14:30:00Z",
      "totalRecipients": 3,
      "status": "active"
    },
    "recipients": [
      {
        "email": "user1@example.com",
        "status": "pending",
        "accessToken": "token_string",
        "createdAt": "2026-06-12T12:30:00Z"
      },
      {
        "email": "user2@example.com",
        "status": "pending",
        "accessToken": "token_string",
        "createdAt": "2026-06-12T12:30:00Z"
      },
      {
        "email": "user3@example.com",
        "status": "pending",
        "accessToken": "token_string",
        "createdAt": "2026-06-12T12:30:00Z"
      }
    ]
  }
}
```

### Add Recipients to Existing Share

**POST** `/api/share/:shareId/recipients`

Add new recipients to an existing active share.

#### Request Body

```json
{
  "recipients": ["newuser@example.com", "anotheruser@example.com"]
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "addedCount": 2,
    "recipients": [
      {
        "email": "newuser@example.com",
        "accessToken": "token_string"
      },
      {
        "email": "anotheruser@example.com",
        "accessToken": "token_string"
      }
    ]
  }
}
```

### Get Share Details

**GET** `/api/share/:shareId`

Retrieve detailed information about a share including all recipients and their access status.

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "share": {
      "_id": "mongodb_id",
      "shareId": "unique_share_id",
      "expiresAt": "2026-06-12T14:30:00Z",
      "createdAt": "2026-06-12T12:30:00Z",
      "totalAccessCount": 5,
      "status": "active",
      "description": "Database credentials - Q3 Project"
    },
    "recipients": [
      {
        "email": "user1@example.com",
        "status": "accessed",
        "accessCount": 2,
        "firstAccessedAt": "2026-06-12T12:45:00Z",
        "lastAccessedAt": "2026-06-12T13:20:00Z"
      },
      {
        "email": "user2@example.com",
        "status": "pending",
        "accessCount": 0,
        "firstAccessedAt": null,
        "lastAccessedAt": null
      },
      {
        "email": "user3@example.com",
        "status": "revoked",
        "accessCount": 0,
        "revokedAt": "2026-06-12T13:00:00Z"
      }
    ],
    "stats": {
      "total": 3,
      "pending": 1,
      "accessed": 1,
      "revoked": 1
    },
    "isExpired": false
  }
}
```

### Revoke Individual Recipient

**POST** `/api/share/:shareId/recipients/:email/revoke`

Revoke access for a specific recipient while keeping the share active for others.

#### Request Body

```json
{
  "reason": "Employee left the company"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "email": "user1@example.com",
    "revokedAt": "2026-06-12T14:00:00Z",
    "previousStatus": "accessed"
  }
}
```

### Revoke All Recipients

**POST** `/api/share/:shareId/revoke`

Revoke access for all recipients (completely revoke the share).

#### Request Body

```json
{
  "reason": "Security incident - revoking all access"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "revokedCount": 3,
    "shareId": "unique_share_id",
    "revokedAt": "2026-06-12T14:00:00Z"
  }
}
```

### Check Access Status

**GET** `/api/access/:accessToken/status`

Check if an access token is valid and active (for recipients).

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "hasAccess": true,
    "recipientEmail": "user1@example.com",
    "accessCount": 2,
    "expiresAt": "2026-06-12T14:30:00Z",
    "maxAccessCount": null
  }
}
```

#### Response (403 Forbidden)

```json
{
  "success": false,
  "message": "Access denied",
  "data": {
    "hasAccess": false,
    "reason": "Access revoked"
  }
}
```

### Access Password

**POST** `/api/access/:accessToken`

Retrieve the password (requires valid access token).

#### Request Body

```json
{
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "password": "decrypted_password_123",
    "expiresAt": "2026-06-12T14:30:00Z",
    "remainingAccess": 2
  }
}
```

### Get Access Analytics

**GET** `/api/share/:shareId/analytics`

Retrieve detailed access analytics including access timeline and IP addresses.

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "share": {
      "id": "unique_share_id",
      "createdAt": "2026-06-12T12:30:00Z",
      "expiresAt": "2026-06-12T14:30:00Z",
      "totalAccesses": 5
    },
    "recipients": {
      "total": 3,
      "accessed": 1,
      "pending": 1,
      "revoked": 1
    },
    "accessTimeline": [
      {
        "recipientEmail": "user1@example.com",
        "accessedAt": "2026-06-12T12:45:00Z",
        "ipAddress": "192.168.1.1"
      },
      {
        "recipientEmail": "user1@example.com",
        "accessedAt": "2026-06-12T13:20:00Z",
        "ipAddress": "192.168.1.2"
      }
    ],
    "topAccessIps": [
      { "ip": "192.168.1.1", "accessCount": 3 },
      { "ip": "192.168.1.2", "accessCount": 2 }
    ]
  }
}
```

## Features

### Individual Revocation
- Revoke access for specific recipients without affecting others
- Each recipient has independent access control
- Revocation reason and timestamp tracked

### Access Tracking
- Per-recipient access count
- IP address and user agent logging
- First and last access timestamps
- Full access history for auditing

### Security
- Unique access tokens per recipient
- Encrypted password storage
- Individual recipient status tracking
- Detailed revocation audit trail

### Scalability
- Support for up to 100 recipients per share
- Efficient recipient management
- MongoDB indexing for performance
- Batch revocation operations

### Notifications
- Track notification send count per recipient
- Last notification timestamp
- Ready for email/SMS integration

## Error Handling

### Common Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Error Codes

- `400 Bad Request` - Invalid input parameters
- `404 Not Found` - Share or recipient not found
- `403 Forbidden` - Access denied or revoked
- `409 Conflict` - Share already expired or revoked
- `429 Too Many Requests` - Rate limiting
- `500 Internal Server Error` - Server error

## Integration Example

```javascript
const MultiRecipientService = require('./services/multiRecipientService');

// Create a share for multiple recipients
const share = await MultiRecipientService.createMultiRecipientShare({
  encryptedPassword: encryptPassword('MyPassword123'),
  expirationMinutes: 120,
  recipients: ['alice@company.com', 'bob@company.com', 'charlie@company.com'],
  description: 'API Keys for staging environment',
  maxAccessCount: 10
});

// Add more recipients later
await MultiRecipientService.addRecipients(share.share._id, ['dave@company.com']);

// Revoke specific recipient
await MultiRecipientService.revokeRecipient(
  share.share._id,
  'charlie@company.com',
  userId,
  'No longer on team'
);

// Check access status
const status = await MultiRecipientService.checkAccessStatus(accessToken);

// Record access
await MultiRecipientService.recordAccess(accessToken, ipAddress, userAgent);

// Get analytics
const analytics = await MultiRecipientService.getAccessAnalytics(share.share._id);
```

## Best Practices

1. **Always use HTTPS** for all password sharing operations
2. **Expire shares quickly** - Use shortest reasonable TTL (e.g., 1-2 hours)
3. **Limit access counts** - Set maxAccessCount to prevent abuse
4. **Monitor access** - Review analytics regularly
5. **Revoke promptly** - Revoke access as soon as no longer needed
6. **Use descriptions** - Help identify shares for auditing
7. **Track IP addresses** - Detect suspicious access patterns
8. **Implement notifications** - Alert recipients when access is revoked
9. **Encrypt in transit** - TLS for all connections
10. **Audit logs** - Keep detailed access history for compliance

## Security Considerations

- Passwords are encrypted in the database
- Access tokens are cryptographically random (32 bytes)
- Each share has a unique ID
- IP addresses and user agents are logged
- Revocation is immediate
- No plaintext password storage
- Automatic expiration enforced
- Access count limits prevent unlimited access
- Homograph attack detection (issue #697)
