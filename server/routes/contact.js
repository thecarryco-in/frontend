import express from 'express';
import Contact from '../models/Contact.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Submit contact form (public) - NO EMAIL SENDING
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