import express from 'express';
import Contact from '../models/Contact.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { sendAdminReplyEmail } from '../services/emailService.js';
import { contactLimiter } from '../index.js';

const router = express.Router();

// Submit contact form (public) - NO EMAIL SENDING
router.post('/submit', contactLimiter, async (req, res) => {
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
      status: 'new'
    });

    await contact.save();

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
      search 
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (queryType) filter.queryType = queryType;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const contacts = await Contact.find(filter)
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
    const { status } = req.body;
    
    // If status is resolved, delete the contact
    if (status === 'resolved') {
      await Contact.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Contact resolved and deleted successfully' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

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

// Send admin reply (admin)
router.post('/admin/reply', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { contactId, reply, userEmail, userName, originalSubject } = req.body;
    
    if (!reply || !userEmail || !userName) {
      return res.status(400).json({ message: 'Reply, user email, and name are required' });
    }

    // Send reply email
    const emailSent = await sendAdminReplyEmail(userEmail, userName, originalSubject, reply);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send reply email' });
    }

    res.status(200).json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Send reply error:', error);
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
    const closedContacts = await Contact.countDocuments({ status: 'closed' });

    // Get contacts by query type
    const contactsByType = await Contact.aggregate([
      { $group: { _id: '$queryType', count: { $sum: 1 } } }
    ]);

    // Recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email queryType status createdAt');

    res.status(200).json({
      stats: {
        totalContacts,
        newContacts,
        inProgressContacts,
        closedContacts
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
