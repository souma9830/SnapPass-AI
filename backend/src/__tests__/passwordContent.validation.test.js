/**
 * Password Content Validation Tests
 */

const PasswordContentValidator = require('../validation/passwordContent.validation');

describe('PasswordContentValidator', () => {
  describe('validate - Valid Passwords', () => {
    test('should accept valid simple password', () => {
      const result = PasswordContentValidator.validate('TestValue123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should accept long complex password', () => {
      const result = PasswordContentValidator.validate('Test@Value!Complex123#Token');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should accept password with special characters', () => {
      const result = PasswordContentValidator.validate('!@#$%^&*()_+-=[]{}');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validate - Invalid Passwords (Executables)', () => {
    test('should reject .exe files', () => {
      const result = PasswordContentValidator.validate('malware.exe');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('executable'))).toBe(true);
    });

    test('should reject .bat files', () => {
      const result = PasswordContentValidator.validate('script.bat');
      expect(result.isValid).toBe(false);
    });

    test('should reject .sh files', () => {
      const result = PasswordContentValidator.validate('script.sh');
      expect(result.isValid).toBe(false);
    });

    test('should reject .jar files', () => {
      const result = PasswordContentValidator.validate('malware.jar');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validate - Invalid Passwords (URLs)', () => {
    test('should reject HTTP URL', () => {
      const result = PasswordContentValidator.validate('http://malicious.com');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('URL'))).toBe(true);
    });

    test('should reject HTTPS URL', () => {
      const result = PasswordContentValidator.validate('https://malicious.com/payload');
      expect(result.isValid).toBe(false);
    });

    test('should reject FTP URL', () => {
      const result = PasswordContentValidator.validate('ftp://server.com/file');
      expect(result.isValid).toBe(false);
    });

    test('should reject www URLs', () => {
      const result = PasswordContentValidator.validate('www.malicious.com');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validate - Invalid Passwords (Scripts)', () => {
    test('should reject javascript protocol', () => {
      const result = PasswordContentValidator.validate('javascript:alert(1)');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('script'))).toBe(true);
    });

    test('should reject data URL', () => {
      const result = PasswordContentValidator.validate('data:text/html,<script>alert(1)</script>');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validate - Invalid Passwords (Paths)', () => {
    test('should reject Windows paths', () => {
      const result = PasswordContentValidator.validate('C:\\Windows\\System32\\cmd.exe');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('file system path'))).toBe(true);
    });

    test('should reject Unix paths', () => {
      const result = PasswordContentValidator.validate('/usr/bin/bash');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validate - Invalid Passwords (Blocked Content)', () => {
    test('should reject cmd.exe', () => {
      const result = PasswordContentValidator.validate('cmd.exe');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('blocked pattern'))).toBe(true);
    });

    test('should reject powershell.exe', () => {
      const result = PasswordContentValidator.validate('powershell.exe /c Get-ChildItem');
      expect(result.isValid).toBe(false);
    });

    test('should reject rm -rf', () => {
      const result = PasswordContentValidator.validate('rm -rf /');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validate - Size Limit', () => {
    test('should reject password exceeding 10KB', () => {
      const largePassword = 'a'.repeat(10241); // 10KB + 1
      const result = PasswordContentValidator.validate(largePassword);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('maximum size'))).toBe(true);
    });

    test('should accept password at 10KB limit', () => {
      const maxPassword = 'a'.repeat(10240); // Exactly 10KB
      const result = PasswordContentValidator.validate(maxPassword);
      // Should pass size check even if warnings exist
      expect(result.errors.some(e => e.includes('size'))).toBe(false);
    });
  });

  describe('validate - Warnings (URL-like)', () => {
    test('should warn if looks like URL', () => {
      const result = PasswordContentValidator.validate('https://not-really-a-url');
      expect(result.warnings.some(w => w.includes('URL'))).toBe(true);
    });

    test('should warn if looks like IP address', () => {
      const result = PasswordContentValidator.validate('192.168.1.1');
      expect(result.warnings.some(w => w.includes('IP address'))).toBe(true);
    });
  });

  describe('validate - Security Level Calculation', () => {
    test('should calculate high security for strong passwords', () => {
      const result = PasswordContentValidator.validate('Test@Value!Secure#123');
      expect(result.securityLevel).toBe('high');
    });

    test('should calculate medium security for moderate passwords', () => {
      const result = PasswordContentValidator.validate('TestValue123');
      expect(result.securityLevel).toBe('medium');
    });

    test('should calculate low security for weak passwords', () => {
      const result = PasswordContentValidator.validate('testvalue');
      expect(result.securityLevel).toBe('low');
    });

    test('should set security level to low if errors exist', () => {
      const result = PasswordContentValidator.validate('http://valid-password.com');
      expect(result.securityLevel).toBe('low');
    });
  });

  describe('validate - Edge Cases', () => {
    test('should reject empty string', () => {
      const result = PasswordContentValidator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('non-empty'))).toBe(true);
    });

    test('should reject null', () => {
      const result = PasswordContentValidator.validate(null);
      expect(result.isValid).toBe(false);
    });

    test('should reject non-string', () => {
      const result = PasswordContentValidator.validate(12345);
      expect(result.isValid).toBe(false);
    });

    test('should handle unicode characters', () => {
      const result = PasswordContentValidator.validate('パスワード123!');
      expect(result.isValid).toBe(true);
    });
  });

  describe('getReport', () => {
    test('should generate report for valid password', () => {
      const validation = PasswordContentValidator.validate('TestValue123!');
      const report = PasswordContentValidator.getReport(validation);
      expect(report).toContain('valid');
    });

    test('should include errors in report', () => {
      const validation = PasswordContentValidator.validate('malware.exe');
      const report = PasswordContentValidator.getReport(validation);
      expect(report).toContain('executable');
    });

    test('should include warnings in report', () => {
      const validation = PasswordContentValidator.validate('https://looks-like-url');
      const report = PasswordContentValidator.getReport(validation);
      expect(report).toContain('URL');
    });
  });
});
