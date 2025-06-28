const Contact = require('./contact.model');
const validateInput = require('../../utils/validateInput');

// @desc    Submit contact form (public)
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      category,
      source
    } = req.body;

    // Validate input
    const validation = validateInput({
      name: { value: name, required: true, maxLength: 100 },
      email: { value: email, required: true, type: 'email' },
      subject: { value: subject, required: true, maxLength: 200 },
      message: { value: message, required: true, maxLength: 2000 },
      phone: { value: phone, maxLength: 20 }
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Basic spam detection
    const spamScore = calculateSpamScore(req.body);
    const isSpam = spamScore > 70;

    // Create contact submission
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'general',
      source: source || 'website',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      isSpam,
      spamScore
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!',
      data: { contact: { id: contact._id, subject: contact.subject } }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts (admin)
// @route   GET /api/contacts
// @access  Private/Admin
const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      assignedTo,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .populate('response.respondedBy', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('response.respondedBy', 'firstName lastName');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
const updateContactStatus = async (req, res, next) => {
  try {
    const { status, assignedTo, priority, notes } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    if (status) contact.status = status;
    if (assignedTo) contact.assignedTo = assignedTo;
    if (priority) contact.priority = priority;
    if (notes) contact.notes = notes;

    await contact.save();

    await contact.populate([
      { path: 'assignedTo', select: 'firstName lastName email' },
      { path: 'response.respondedBy', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to contact
// @route   PUT /api/contacts/:id/respond
// @access  Private/Admin
const respondToContact = async (req, res, next) => {
  try {
    const { message } = req.body;

    // Validate input
    const validation = validateInput({
      message: { value: message, required: true, maxLength: 2000 }
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.response = {
      message,
      respondedBy: req.user.id,
      respondedAt: new Date()
    };

    // Update status to resolved if not already
    if (contact.status !== 'resolved') {
      contact.status = 'resolved';
    }

    await contact.save();

    await contact.populate([
      { path: 'assignedTo', select: 'firstName lastName email' },
      { path: 'response.respondedBy', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact statistics
// @route   GET /api/contacts/stats
// @access  Private/Admin
const getContactStats = async (req, res, next) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          spam: { $sum: { $cond: ['$isSpam', 1, 0] } }
        }
      }
    ]);

    const categoryStats = await Contact.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const monthlyStats = await Contact.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        categories: categoryStats,
        monthly: monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contact as spam
// @route   PUT /api/contacts/:id/spam
// @access  Private/Admin
const markAsSpam = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.isSpam = true;
    contact.spamScore = 100;
    contact.status = 'closed';
    await contact.save();

    res.json({
      success: true,
      message: 'Contact marked as spam',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate spam score
const calculateSpamScore = (data) => {
  let score = 0;
  
  // Check for suspicious patterns
  if (data.message && data.message.length < 10) score += 20;
  if (data.message && data.message.includes('FREE')) score += 30;
  if (data.message && data.message.includes('URGENT')) score += 25;
  if (data.message && data.message.includes('CLICK HERE')) score += 40;
  if (data.email && data.email.includes('@temp')) score += 50;
  
  return Math.min(score, 100);
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  respondToContact,
  getContactStats,
  markAsSpam
}; 