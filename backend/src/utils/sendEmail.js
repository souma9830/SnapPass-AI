import { Resend } from 'resend';
import { config } from '../config/config.js';

export async function sendEmail(to, subject, html) {
    if (!config.RESEND_API_KEY || !config.EMAIL_FROM) {
        throw new Error('Email service is not configured.');
    }

    const resend = new Resend(config.RESEND_API_KEY);

    try {
        const email = await resend.emails.send({
            from: config.EMAIL_FROM,
            to,
            subject,
            html,
        });
        console.log('Email sent:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
