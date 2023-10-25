"use client";
import axios from 'axios';

// const SENDINBLUE_API_KEY = process.env.SENDINBLUE_API_KEY

export async function SendMail({ status, to, subject, text }) {
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
          'api-key': "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",
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

