
const express = require("express");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();
const contactRouter = express.Router();


if (!process.env.RESEND_API_KEY || !process.env.EMAIL_USER) {
  throw new Error("RESEND_API_KEY and EMAIL_USER must be set in .env");
}


const resend = new Resend(process.env.RESEND_API_KEY);


const validateFormData = (data) => {
  const errors = {};
  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.name = "Invalid name";
  }
  if (!data.email || typeof data.email !== "string" || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Invalid email";
  }
  if (!data.message || typeof data.message !== "string" || !data.message.trim()) {
    errors.message = "Invalid message";
  }
  return errors;
};


contactRouter.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const serverErrors = validateFormData({ name, email, message });
  if (Object.keys(serverErrors).length > 0) {
    return res.status(400).json({ errors: serverErrors });
  }

  try {
    //  Send email via Resend API
    const result = await resend.emails.send({
      from: `Portfolio Contact <onboarding@resend.dev>`, // default Resend sender
      to: process.env.EMAIL_USER, //inbox
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="margin-bottom: 0.5rem;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ddd;">${message}</p>
        </div>
      `,
    });

    console.log("Resend email result:", result);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = contactRouter;
