'use server';
import { Resend } from 'resend';

import getBaseURL from '@/utils/base-url';
import { RESEND_API_KEY } from '@/utils/env';

const resend = new Resend(RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Shopping - Confirmation Email',
    html: `<p>Click to <a href='${confirmLink}'>Confirm your email</a></p>`,
  });

  if (error) return console.log(error);
  if (data) return data;
};
