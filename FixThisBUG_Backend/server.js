// server.js - Express.js Backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixthisbug', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schemas
const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  number: { type: Number, required: true },
  comments_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  labels: [String],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  assignee: { type: String, default: null }
});

const repositorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  slug: { type: String, required: true },
  url: { type: String, required: true },
  stars: { type: Number, default: 0 },
  stars_display: { type: String, default: '0' },
  last_modified: { type: Date, default: Date.now },
  github_id: { type: String, unique: true },
  issues: [issueSchema],
  tags: [String],
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribed_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
  preferences: {
    languages: [String],
    notification_frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' }
  }
});

const bugSubmissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  repository_url: { type: String, required: true },
  issue_url: { type: String },
  language: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  labels: [String],
  submitter_email: { type: String, required: true },
  submitter_name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  reviewed_by: { type: String },
  reviewed_at: { type: Date },
  rejection_reason: { type: String }
});

// Models
const Repository = mongoose.model('Repository', repositorySchema);
const Subscriber = mongoose.model('Subscriber', subscriberSchema);
const BugSubmission = mongoose.model('BugSubmission', bugSubmissionSchema);

// Helper functions
const formatStarsDisplay = (stars) => {
  if (stars >= 1000000) {
    return `${(stars / 1000000).toFixed(1)}M`;
  } else if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}K`;
  }
  return stars.toString();
};

const generateSlug = (language) => {
  return language.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

// Routes

// Get all repositories with pagination and filtering
app.get('/api/repositories', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      language, 
      search, 
      sort = 'stars',
      order = 'desc'
    } = req.query;

    const filter = { is_active: true };
    
    // Language filter
    if (language && language !== 'all') {
      filter.slug = language;
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const repositories = await Repository.find(filter)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Repository.countDocuments(filter);

    res.json({
      repositories,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get repository by ID
app.get('/api/repositories/:id', async (req, res) => {
  try {
    const repository = await Repository.findById(req.params.id);
    
    if (!repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    res.json(repository);
  } catch (error) {
    console.error('Error fetching repository:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get language statistics
app.get('/api/languages', async (req, res) => {
  try {
    const languages = await Repository.aggregate([
      { $match: { is_active: true } },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
          slug: { $first: '$slug' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const formattedLanguages = languages.map(lang => ({
      language: lang._id,
      count: lang.count,
      slug: lang.slug
    }));

    res.json(formattedLanguages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create/Update repository
app.post('/api/repositories', async (req, res) => {
  try {
    const {
      name,
      owner,
      description,
      language,
      url,
      stars,
      github_id,
      issues = []
    } = req.body;

    // Validate required fields
    if (!name || !owner || !description || !language || !url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const slug = generateSlug(language);
    const stars_display = formatStarsDisplay(stars || 0);

    // Check if repository already exists
    let repository = await Repository.findOne({ github_id });

    if (repository) {
      // Update existing repository
      repository.name = name;
      repository.owner = owner;
      repository.description = description;
      repository.language = language;
      repository.slug = slug;
      repository.url = url;
      repository.stars = stars || 0;
      repository.stars_display = stars_display;
      repository.last_modified = new Date();
      repository.issues = issues;
      
      await repository.save();
    } else {
      // Create new repository
      repository = new Repository({
        name,
        owner,
        description,
        language,
        slug,
        url,
        stars: stars || 0,
        stars_display,
        github_id,
        issues
      });
      
      await repository.save();
    }

    res.status(201).json(repository);
  } catch (error) {
    console.error('Error creating/updating repository:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Subscribe to newsletter
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, preferences = {} } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.is_active) {
        return res.status(400).json({ error: 'Email already subscribed' });
      } else {
        // Reactivate subscription
        subscriber.is_active = true;
        subscriber.preferences = { ...subscriber.preferences, ...preferences };
        await subscriber.save();
      }
    } else {
      // Create new subscriber
      subscriber = new Subscriber({
        email,
        preferences
      });
      await subscriber.save();
    }

    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unsubscribe from newsletter
app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { is_active: false },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit bug report
app.post('/api/submit-bug', async (req, res) => {
  try {
    const {
      title,
      description,
      repository_url,
      issue_url,
      language,
      difficulty,
      labels = [],
      submitter_email,
      submitter_name
    } = req.body;

    // Validate required fields
    if (!title || !description || !repository_url || !language || !difficulty || !submitter_email || !submitter_name) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Validate email
    if (!submitter_email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Validate difficulty
    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    // Create bug submission
    const bugSubmission = new BugSubmission({
      title,
      description,
      repository_url,
      issue_url,
      language,
      difficulty,
      labels,
      submitter_email,
      submitter_name
    });

    await bugSubmission.save();

    res.status(201).json({ 
      message: 'Bug submitted successfully! It will be reviewed before being published.',
      submission_id: bugSubmission._id
    });
  } catch (error) {
    console.error('Error submitting bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bug submissions (for admin)
app.get('/api/bug-submissions', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;

    const filter = {};
    if (status !== 'all') {
      filter.status = status;
    }

    const submissions = await BugSubmission.find(filter)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await BugSubmission.countDocuments(filter);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching bug submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject bug submission
app.patch('/api/bug-submissions/:id', async (req, res) => {
  try {
    const { status, rejection_reason, reviewed_by } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const submission = await BugSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.status = status;
    submission.reviewed_by = reviewed_by;
    submission.reviewed_at = new Date();
    
    if (status === 'rejected' && rejection_reason) {
      submission.rejection_reason = rejection_reason;
    }

    await submission.save();

    // If approved, create/update repository with the new issue
    if (status === 'approved') {
      // Extract owner and repo name from repository URL
      const urlParts = submission.repository_url.split('/');
      const owner = urlParts[urlParts.length - 2];
      const repoName = urlParts[urlParts.length - 1];

      // Create issue object
      const newIssue = {
        title: submission.title,
        url: submission.issue_url || submission.repository_url,
        number: Math.floor(Math.random() * 10000), // Generate random number if not provided
        comments_count: 0,
        created_at: submission.created_at,
        labels: submission.labels,
        difficulty: submission.difficulty,
        status: 'open'
      };

      // Find or create repository
      let repository = await Repository.findOne({ 
        name: repoName, 
        owner: owner 
      });

      if (repository) {
        repository.issues.push(newIssue);
        repository.last_modified = new Date();
        await repository.save();
      } else {
        // Create new repository
        repository = new Repository({
          name: repoName,
          owner: owner,
          description: `Repository for ${repoName}`,
          language: submission.language,
          slug: generateSlug(submission.language),
          url: submission.repository_url,
          stars: 0,
          stars_display: '0',
          github_id: `${owner}/${repoName}`,
          issues: [newIssue]
        });
        await repository.save();
      }
    }

    res.json({ message: `Bug submission ${status} successfully` });
  } catch (error) {
    console.error('Error updating bug submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;