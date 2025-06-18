const express = require('express');

const router= express.Router();


const { repositorySchema, subscriberSchema, bugSubmissionSchema } = require('../schema/databaseSchema');
const mongoose = require('mongoose');

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
router.get('/api/repositories', async (req, res) => {
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
router.get('/api/repositories/:id', async (req, res) => {
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
router.get('/api/languages', async (req, res) => {
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
router.post('/api/repositories', async (req, res) => {
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
router.post('/api/subscribe', async (req, res) => {
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
router.post('/api/unsubscribe', async (req, res) => {
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
router.post('/api/submit-bug', async (req, res) => {
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
router.get('/api/bug-submissions', async (req, res) => {
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
router.patch('/api/bug-submissions/:id', async (req, res) => {
  try {
    const { status, rejection_reason, reviewed_by } = req.body;

    if (!['routerroved', 'rejected'].includes(status)) {
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

    // If routerroved, create/update repository with the new issue
    if (status === 'routerroved') {
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
router.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

module.exports= router;