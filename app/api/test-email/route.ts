import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Test email functionality
export async function POST(request: NextRequest) {
  try {
    const { email, name = "Test User" } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    console.log("Testing email delivery to:", email);

    // Test SMTP connection first
    const gmailUser = process.env.GMAIL_USER || "sunbrix.co@gmail.com";
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailPassword) {
      return NextResponse.json(
        { error: "Gmail app password not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
      logger: true,
    });

    // Verify SMTP connection
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // Get email template
    let template = await prisma.emailTemplate.findFirst({
      where: { active: true },
    });

    if (!template) {
      // Create a test template
      template = {
        id: "test-template",
        name: "Test Template",
        subject: "Test Email from SUNBRIX",
        body: `Hello {name}!

This is a test email from SUNBRIX to verify that our email system is working correctly.

If you receive this email, it means:
✅ SMTP connection is working
✅ Gmail authentication is successful
✅ Email delivery is functional

Best regards,
SUNBRIX Team

---
Test sent at: ${new Date().toISOString()}`,
        category: "test",
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }

    // Send test email
    const personalizedBody = template.body.replace(/{name}/g, name);
    const personalizedHtml = personalizedBody.replace(/\n/g, "<br>");

    const mailOptions = {
      from: {
        name: "SUNBRIX Team (Test)",
        address: gmailUser,
      },
      to: email,
      subject: `[TEST] ${template.subject}`,
      text: personalizedBody,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <h2 style="color: #e67e22;">🔧 Email System Test</h2>
          ${personalizedHtml}
          <br><br>
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #e67e22;">
            <strong>Technical Details:</strong><br>
            SMTP Server: smtp.gmail.com:587<br>
            From: ${gmailUser}<br>
            Test Time: ${new Date().toLocaleString()}<br>
          </div>
          <br>
          <p style="font-size: 12px; color: #666;">
            This is a test email from SUNBRIX construction services email system.
          </p>
        </div>
      `,
      headers: {
        "X-Mailer": "SUNBRIX-Test",
        "X-Priority": "1",
      },
    };

    console.log("Sending test email...");
    const result = await transporter.sendMail(mailOptions);

    console.log("Test email sent successfully:", {
      messageId: result.messageId,
      response: result.response,
      to: email,
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      details: {
        messageId: result.messageId,
        to: email,
        from: gmailUser,
        subject: mailOptions.subject,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Test email failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: {
          timestamp: new Date().toISOString(),
          errorType:
            error instanceof Error ? error.constructor.name : "UnknownError",
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
