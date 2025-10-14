
const express = require('express');
const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require('nodemailer');
const contactRouter = express.Router();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('EMAIL_USER and EMAIL_PASS must be set in .env');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});

// Validation function
const validateFormData = (data) => {
  const errors = {};
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.name = 'Invalid name';
  }
  if (!data.email || typeof data.email !== 'string' || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email';
  }
  if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
    errors.message = 'Invalid message';
  }
  return errors;
};
contactRouter.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const serverErrors = validateFormData({ name, email, message });
  if (Object.keys(serverErrors).length > 0) {
    return res.status(400).json({ errors: serverErrors });
  }

  try {
    // Send email
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER, 
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = contactRouter;