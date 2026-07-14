import { Resend } from 'resend';
import { config } from '../config/config.js';
const resend = new Resend(config.RESEND_API_KEY || 're_dummy_key_for_dev');

export async function sendEmail(to, subject, html) {
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