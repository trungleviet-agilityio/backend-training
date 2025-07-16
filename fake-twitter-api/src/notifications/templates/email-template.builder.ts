/**
 * Email Template Builder - Template Method Pattern
 * Provides consistent email formatting
 */

import { EmailData } from '../interfaces/notification.interface';

/**
 * Email Template Builder - Template Method Pattern
 * Provides consistent email formatting
 */
export abstract class EmailTemplateBuilder {
  // Template method - defines the algorithm structure
  public buildEmail(data: any): EmailData {
    return {
      to: this.getRecipient(data),
      from: this.getSender(),
      subject: this.getSubject(data),
      body: this.buildBody(data),
      isHtml: this.isHtmlEmail(),
    };
  }

  // Abstract methods to be implemented by concrete classes
  protected abstract getSubject(data: any): string;
  protected abstract buildBody(data: any): string;

  // Default implementations (can be overridden)
  protected getRecipient(data: any): string {
    return data.email || data.to;
  }

  protected getSender(): string {
    return 'noreply@fake-twitter.com';
  }

  protected isHtmlEmail(): boolean {
    return false;
  }
}

/**
 * Password Reset Email Builder - Template Method Pattern
 * Provides consistent email formatting
 */
export class PasswordResetEmailBuilder extends EmailTemplateBuilder {
  protected getSubject(data: any): string {
    return 'Reset Your Password - Fake Twitter';
  }

  protected buildBody(data: {
    email: string;
    token: string;
    userName?: string;
  }): string {
    return `Dear ${data.userName || 'User'},

You have requested to reset your password for your Fake Twitter account.

Your password reset token is:
🔑 TOKEN: ${data.token}

To reset your password, use this token in the reset password endpoint:
POST /api/v1/auth/reset-password
{
  "token": "${data.token}",
  "password": "YourNewPassword123!"
}

⏰ This token will expire in 1 hour.

If you did not request this password reset, please ignore this email.

Best regards,
The Fake Twitter Team`;
  }
}

export class PasswordResetSuccessEmailBuilder extends EmailTemplateBuilder {
  protected getSubject(data: any): string {
    return 'Password Reset Successful - Fake Twitter';
  }

  protected buildBody(data: { email: string; userName?: string }): string {
    return `Dear ${data.userName || 'User'},

✅ Your password has been successfully reset!

🔒 Security Notice:
- All your active sessions have been logged out
- Please log in again with your new password
- If this was not you, please contact support immediately

🔐 Next Steps:
1. Go to the login page
2. Use your email/username and new password
3. Update your account security settings if needed

Thank you for keeping your account secure!

Best regards,
The Fake Twitter Security Team`;
  }
}
