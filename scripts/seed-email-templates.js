const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedEmailTemplates() {
  try {
    console.log('Seeding email templates...');

    // Create form submission template
    const formSubmissionTemplate = await prisma.emailTemplate.upsert({
      where: { name: 'form_submission_thank_you' },
      update: {},
      create: {
        name: 'form_submission_thank_you',
        subject: 'Thank you for your inquiry - SUNBRIX',
        body: `Dear {name},

Thank you for reaching out to SUNBRIX! We have received your inquiry and appreciate your interest in our construction services.

Our team will review your requirements and get back to you within 24 hours. In the meantime, feel free to explore our projects and packages on our website.

We specialize in:
🏗️ Residential Construction
🏢 Commercial Projects  
🏠 Interior Design
📋 Project Management

If you have any urgent questions, please don't hesitate to contact us directly.

Best regards,
The SUNBRIX Team
Email: sunbrix.co@gmail.com
Phone: +91 XXXXX XXXXX

Visit us: www.sunbrix.com`,
        category: 'form_submission',
        active: true,
      },
    });

    console.log('Form submission template created/updated:', formSubmissionTemplate.id);

    // Create follow-up template (for future use)
    const followUpTemplate = await prisma.emailTemplate.upsert({
      where: { name: 'follow_up_reminder' },
      update: {},
      create: {
        name: 'follow_up_reminder',
        subject: 'Follow-up on your SUNBRIX inquiry',
        body: `Dear {name},

We wanted to follow up on your recent inquiry about our construction services.

Our team is ready to discuss your project requirements and provide you with a detailed proposal.

Please feel free to reach out to us at your convenience:
📧 Email: sunbrix.co@gmail.com  
📞 Phone: +91 XXXXX XXXXX

We look forward to hearing from you soon!

Best regards,
The SUNBRIX Team`,
        category: 'follow_up',
        active: true,
      },
    });

    console.log('Follow-up template created/updated:', followUpTemplate.id);

    console.log('Email templates seeded successfully!');
  } catch (error) {
    console.error('Error seeding email templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEmailTemplates();