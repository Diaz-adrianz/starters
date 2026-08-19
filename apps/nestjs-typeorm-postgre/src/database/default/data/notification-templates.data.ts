import { Template } from '../../../modules/notification/entities/template.entity';
import { Channel } from '../../../modules/notification/enums/channel.enum';

export const NotificationTemplatesData: Pick<
  Template,
  'key' | 'channel' | 'title' | 'body' | 'availableKeys' | 'sensitiveKeys'
>[] = [
  {
    key: 'greetings',
    channel: Channel.PUSH,
    title: 'Hello, {{name}}',
    body: 'Greetings! How are you today, {{name}}?',
    availableKeys: ['name'],
    sensitiveKeys: [],
  },
  {
    key: 'greetings',
    channel: Channel.IN_APP,
    title: 'Hello, {{name}}',
    body: 'Greetings! How are you today, {{name}}?',
    availableKeys: ['name'],
    sensitiveKeys: [],
  },
  {
    key: 'auth.email-verification',
    channel: Channel.EMAIL,
    title: 'Verify Your Email',
    body: `<!doctype html> <html lang="id"> <head> <meta charset="utf-8" /> <title>Verify Your Email</title> </head> <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1f2937" > <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"> <tr> <td align="center" style="padding: 24px"> <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #e6eefb; border-radius: 6px" > <tr> <td style="padding: 20px; text-align: left"> <h1 style="font-size: 20px; margin: 0 0 8px">Verify Your Email</h1> <p style="margin: 0 0 24px; line-height: 150%"> Use the verification code below to verify your email address and activate your account. </p> <div style=" background-color: #f8fbff; padding: 16px; border-radius: 6px; border: 1px solid #dbeafe; text-align: center; " > <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; padding: 12px 0"> {{otp}} </div> <p style="margin-top: 12px; margin-bottom: 0; line-height: 150%; font-size: 14px; color: #6b7280"> This verification code will expire in <strong>{{expiresIn}}</strong> . </p> </div> <p style="margin-top: 20px; line-height: 150%; font-size: 13px; color: #6b7280"> If you didn't request this verification code, please ignore this email. For further assistance, please contact our support team. </p> <p style="margin-top: 10px; line-height: 150%"> Regards, <br /> Adrianz </p> </td> </tr> </table> </td> </tr> </table> </body> </html>`,
    availableKeys: ['otp', 'expiresIn'],
    sensitiveKeys: ['otp'],
  },
  {
    key: 'auth.password-reset',
    channel: Channel.EMAIL,
    title: 'Reset Your Password',
    body: `<!doctype html> <html lang="id"> <head> <meta charset="utf-8" /> <title>Reset Your Password</title> </head> <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1f2937" > <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"> <tr> <td align="center" style="padding: 24px"> <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #e6eefb; border-radius: 6px" > <tr> <td style="padding: 20px; text-align: left"> <h1 style="font-size: 20px; margin: 0 0 8px">Reset Your Password</h1> <p style="margin: 0 0 24px; line-height: 150%"> Use the verification code below to reset your account password. </p> <div style=" background-color: #f8fbff; padding: 16px; border-radius: 6px; border: 1px solid #dbeafe; text-align: center; " > <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; padding: 12px 0"> {{otp}} </div> <p style="margin-top: 12px; margin-bottom: 0; line-height: 150%; font-size: 14px; color: #6b7280"> This verification code will expire in <strong>{{expiresIn}}</strong> . </p> </div> <p style="margin-top: 20px; line-height: 150%; font-size: 13px; color: #6b7280"> If you didn't request a password reset, please ignore this email. Your password will remain unchanged. For further assistance, please contact our support team. </p> <p style="margin-top: 10px; line-height: 150%"> Regards, <br /> Adrianz </p> </td> </tr> </table> </td> </tr> </table> </body> </html>`,
    availableKeys: ['otp', 'expiresIn'],
    sensitiveKeys: ['otp'],
  },
  {
    key: 'auth.signin-alert',
    channel: Channel.EMAIL,
    title: 'New Sign In Activity',
    body: `<!doctype html> <html lang="id"> <head> <meta charset="utf-8" /> <title>New Sign-In Activity</title> </head> <body style=" margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1f2937; " > <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" > <tr> <td align="center" style="padding: 24px"> <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #e6eefb; border-radius: 6px" > <tr> <td style="padding: 20px; text-align: left"> <h1 style="font-size: 20px; margin: 0 0 8px"> New Sign-In Activity </h1> <p style="margin: 0 0 24px; line-height: 150%"> We noticed a new sign-in to your account, <strong>{{email}}</strong>. If this was you, no further action is needed. </p> <div style=" background-color: #f8fbff; padding: 16px; border-radius: 6px; border: 1px solid #dbeafe; " > <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px; line-height: 180%" > <tr> <td style="color: #6b7280; width: 120px">Device</td> <td style="color: #1f2937"> {{#if deviceName}}{{deviceName}}{{else}}Unknown device{{/if}} {{#if deviceType}}({{deviceType}}){{/if}} </td> </tr> <tr> <td style="color: #6b7280">IP address</td> <td style="color: #1f2937"> {{#if ip}}{{ip}}{{else}}Unknown{{/if}} </td> </tr> <tr> <td style="color: #6b7280">Browser / Agent</td> <td style="color: #1f2937"> {{#if userAgent}}{{userAgent}}{{else}}Unknown{{/if}} </td> </tr> </table> </div> <p style=" margin-top: 20px; line-height: 150%; font-size: 13px; color: #6b7280; " > If you don't recognize this activity, please reset your password immediately and contact our support team. </p> <p style="margin-top: 10px; line-height: 150%"> Regards,<br />Adrianz </p> </td> </tr> </table> </td> </tr> </table> </body> </html>`,
    availableKeys: ['deviceName', 'deviceType', 'ip', 'userAgent'],
    sensitiveKeys: ['ip'],
  },
];
