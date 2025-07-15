/**
 * Notification interfaces using Interface Segregation Principle
 */

export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export interface SmsData {
  to: string;
  message: string;
}

export interface PushNotificationData {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Base notification interface
export interface INotificationService {
  send(data: any): Promise<boolean>;
}

// Specific notification interfaces
export interface IEmailService extends INotificationService {
  sendEmail(emailData: EmailData): Promise<boolean>;
}

export interface ISmsService extends INotificationService {
  sendSms(smsData: SmsData): Promise<boolean>;
}

export interface IPushNotificationService extends INotificationService {
  sendPushNotification(pushData: PushNotificationData): Promise<boolean>;
}
