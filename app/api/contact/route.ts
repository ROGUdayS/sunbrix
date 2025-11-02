import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Initialize email transporter with explicit SMTP settings
async function createEmailTransporter() {
  const gmailUser = process.env.GMAIL_USER || "sunbrix.co@gmail.com";
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  console.log("Initializing email transporter for:", gmailUser);

  if (!gmailPassword) {
    throw new Error(
      "Gmail app password not configured. Please set GMAIL_APP_PASSWORD environment variable."
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true, // Enable debug logging
    logger: true, // Enable logger
  });

  // Verify connection configuration
  try {
    await transporter.verify();
  } catch (verifyError) {
    console.error("SMTP verification failed:", verifyError);
    throw new Error(
      `SMTP configuration error: ${
        verifyError instanceof Error ? verifyError.message : "Unknown error"
      }`
    );
  }

  return transporter;
}

// Get email template by category with robust connection handling
async function getEmailTemplate(category: string = "form_submission") {
  // Create a fresh Prisma client for background operations
  const backgroundPrisma = new PrismaClient();

  try {
    console.log(
      `Attempting to fetch ${category} email template from database...`
    );

    // Use the fresh client instance
    const template = await backgroundPrisma.emailTemplate.findFirst({
      where: {
        category: category,
        active: true,
      },
    });

    if (!template) {
      throw new Error(
        `No active email template found for category: ${category}`
      );
    }

    console.log(
      `Email template for ${category} fetched successfully from database`
    );
    return template;
  } catch (dbError) {
    console.error(
      `Database error while fetching ${category} email template:`,
      dbError
    );

    // Return a minimal fallback template for critical failures only
    console.log(
      "Using emergency fallback template due to database connectivity issues"
    );
    return {
      subject: "Thank you for your inquiry - SUNBRIX",
      body: `Dear {name},

Thank you for reaching out to SUNBRIX! We have received your inquiry and appreciate your interest in our construction services.

Our team will review your requirements and get back to you within 24 hours.

Best regards,
The SUNBRIX Team
Email: sunbrix.co@gmail.com
Phone: +91 XXXXX XXXXX

Visit us: www.sunbrix.com`,
      category: category,
    };
  } finally {
    try {
      await backgroundPrisma.$disconnect();
      console.log("Background Prisma client disconnected successfully");
    } catch (disconnectError) {
      console.error(
        "Error disconnecting background Prisma client:",
        disconnectError
      );
    }
  }
}

// Send thank you email with comprehensive error handling
async function sendThankYouEmail(
  to: string,
  name: string,
  template: { subject: string; body: string }
) {
  console.log("Starting email send process for:", to);

  const transporter = await createEmailTransporter();

  const personalizedBody = template.body.replace(/{name}/g, name);
  const personalizedHtml = personalizedBody
    .replace(/\n/g, "<br>")
    .replace(/{name}/g, name);

  const mailOptions = {
    from: {
      name: "SUNBRIX Team",
      address: process.env.GMAIL_USER || "sunbrix.co@gmail.com",
    },
    to: to,
    subject: template.subject,
    text: personalizedBody,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        ${personalizedHtml}
        <br><br>
        <p style="font-size: 12px; color: #666;">
          This email was sent from SUNBRIX construction services. If you did not request this, please ignore this email.
        </p>
      </div>
    `,
    // Add additional headers for better deliverability
    headers: {
      "X-Mailer": "SUNBRIX-CRM",
      "Reply-To": process.env.GMAIL_USER || "sunbrix.co@gmail.com",
    },
  };

  console.log("Sending email with options:", {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject,
  });

  const result = await transporter.sendMail(mailOptions);

  console.log("Email sent successfully:", {
    messageId: result.messageId,
    response: result.response,
    to: to,
  });

  return result;
}

// Retry mechanism for email sending
async function sendEmailWithRetry(
  to: string,
  name: string,
  template: { subject: string; body: string },
  maxRetries: number = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email attempt ${attempt}/${maxRetries} for ${to}`);
      const result = await sendThankYouEmail(to, name, template);
      console.log(`Email sent successfully on attempt ${attempt}`);
      return result;
    } catch (error) {
      console.error(`Email attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        console.error(`All ${maxRetries} email attempts failed for ${to}`);
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s, etc.
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Contact form submission received");
    const body = await request.json();
    console.log("Form data:", {
      ...body,
      mobileNumber: body.mobileNumber ? "[REDACTED]" : undefined,
    });

    const { fullName, email, mobileNumber, city, timeline, sourcePage } = body;

    // Validate required fields
    if (!fullName || !email || !mobileNumber) {
      console.log("Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save lead to database
    console.log("Saving lead to database...");
    const lead = await prisma.lead.create({
      data: {
        name: fullName,
        email: email,
        phone: mobileNumber,
        city: city || "Not specified",
        timeline: timeline || null,
        source: "website",
        source_page: sourcePage || null,
        status: "new",
      },
    });
    console.log("Lead saved to database with ID:", lead.id);

    // Send thank you email asynchronously (don't wait for completion)
    console.log("Initiating background email sending...");
    setImmediate(async () => {
      // Create a separate Prisma client for background operations
      const backgroundPrisma = new PrismaClient();

      try {
        console.log("Sending thank you email in background...");
        const template = await getEmailTemplate("form_submission");

        // Use retry mechanism for email sending
        const emailResult = await sendEmailWithRetry(email, fullName, template);

        // Update lead to mark email as sent using background client
        await backgroundPrisma.lead.update({
          where: { id: lead.id },
          data: { email_sent: true },
        });

        console.log(
          "Background email sent successfully to:",
          email,
          "MessageId:",
          emailResult?.messageId
        );
      } catch (emailError) {
        console.error("Background email failed for lead:", lead.id, emailError);

        // Log detailed error information
        if (emailError instanceof Error) {
          console.error("Email error details:", {
            message: emailError.message,
            stack: emailError.stack?.substring(0, 500), // Limit stack trace length
            leadId: lead.id,
            recipientEmail: email,
            timestamp: new Date().toISOString(),
          });
        }

        // Don't throw errors in background processes to prevent unhandled rejections
        console.log("Email delivery failed but form submission was successful");
      } finally {
        try {
          await backgroundPrisma.$disconnect();
          console.log(
            "Background Prisma client disconnected after email processing"
          );
        } catch (disconnectError) {
          console.error(
            "Error disconnecting background Prisma client:",
            disconnectError
          );
        }
      }
    }).unref(); // Prevent this from keeping the process alive

    // Return immediate success response (don't wait for email)
    return NextResponse.json(
      {
        message: "Form submitted successfully",
        leadId: lead.id,
        emailSent: "processing", // Indicates email is being sent in background
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting form:", error);

    let errorMessage = "Failed to submit form";
    if (error instanceof Error) {
      errorMessage = `Submission failed: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
