"use client";
import axios from 'axios';

export async function SendMail({ status, to, subject, text }) {
  const sendinblueApiKey = process.env.SENDINBLUE_API_KEY;
  try {
    let emailData;
    if (status === "contact") {
      emailData = {
        to: [{ email: 'ridefixr@gmail.com' }],
        subject,
        textContent: text,
        sender: { email: to }
      };
    }else{
      emailData = {
        to: [{ email: to }],
        subject,
        textContent: text,
        sender: { email: 'ridefixr@gmail.com' }
      };
    }
    const response = await axios.post(
      'https://api.sendinblue.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'api-key': sendinblueApiKey,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );

    if (response.status === 201) {
      console.log('Email sent successfully');
      return true;
    } else {
      console.error('Failed to send email');
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

