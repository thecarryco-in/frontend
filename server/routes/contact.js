import express from 'express';
import { Resend } from 'resend';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send email notification to admin
const sendAdminNotification = async (contact) => {
  try {
    await resend.emails.send({
      from: 'The CarryCo <${process.env.RESEND_SENDER_EMAIL}>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission - ${contact.queryType.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin: 0 0 15px 0;">Contact Details</h2>
              <p><strong>Name:</strong> ${contact.name}</p>
              <p><strong>Email:</strong> ${contact.email}</p>
              <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
              <p><strong>Query Type:</strong> ${contact.queryType.charAt(0).toUpperCase() + contact.queryType.slice(1)}</p>
              <p><strong>Subject:</strong> ${contact.subject}</p>
              <p><strong>Priority:</strong> ${contact.priority.toUpperCase()}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Message</h3>
              <p style="white-space: pre-wrap;">${contact.message}</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Please respond to this inquiry as soon as possible.
            </p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
};

// Send confirmation email to user
const sendUserConfirmation = async (contact) => {
  try {
    await resend.emails.send({
      from: 'The CarryCo <${process.env.RESEND_SENDER_EMAIL}>',
      to: contact.email,
      subject: 'Thank you for contacting The CarryCo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 20px;">Thank You for Contacting Us!</h1>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">Hi ${contact.name}, we've received your message and will get back to you soon.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
              <h2 style="color: #333; margin: 0 0 15px 0;">Your Message Summary</h2>
              <p><strong>Subject:</strong> ${contact.subject}</p>
              <p><strong>Query Type:</strong> ${contact.queryType.charAt(0).toUpperCase() + contact.queryType.slice(1)}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              We typically respond within 24 hours. If your inquiry is urgent, please call us directly.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                Best regards,<br>
                The CarryCo Team
              </p>
            </div>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send user confirmation:', error);
  }
};

// Submit contact form (public)
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, queryType, subject, message } = req.body;

    // Validation
    if (!name || !email || !queryType || !subject || !message) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Create contact
    const contact = new Contact({
      name,
      email,
      phone,
      queryType,
      subject,
      message,
      priority: queryType === 'order' ? 'high' : 'medium'
    });

    await contact.save();

    // Send emails
    await Promise.all([
      sendUserConfirmation(contact),
      sendAdminNotification(contact)
    ]);

    res.status(201).json({ 
      message: 'Thank you for your message! We will get back to you soon.',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
});

// Get all contact submissions (admin)
router.get('/admin/submissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      queryType, 
      priority,
      search 
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (queryType) filter.queryType = queryType;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const contacts = await Contact.find(filter)
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact submission (admin)
router.put('/admin/submissions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    
    if (status === 'in-progress' || status === 'resolved') {
      updateData.respondedBy = req.userId;
      updateData.respondedAt = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ 
      message: 'Contact updated successfully', 
      contact 
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact submission (admin)
router.delete('/admin/submissions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contact statistics (admin)
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const inProgressContacts = await Contact.countDocuments({ status: 'in-progress' });
    const resolvedContacts = await Contact.countDocuments({ status: 'resolved' });
    const urgentContacts = await Contact.countDocuments({ priority: 'urgent' });

    // Get contacts by query type
    const contactsByType = await Contact.aggregate([
      { $group: { _id: '$queryType', count: { $sum: 1 } } }
    ]);

    // Recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email queryType status priority createdAt');

    res.status(200).json({
      stats: {
        totalContacts,
        newContacts,
        inProgressContacts,
        resolvedContacts,
        urgentContacts
      },
      contactsByType,
      recentContacts
    });
  } catch (error) {
    console.error('Contact stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
