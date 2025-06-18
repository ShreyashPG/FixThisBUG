const mongoose = require('mongoose');

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


// Export schemas
module.exports = {
  repositorySchema,
  subscriberSchema,
  bugSubmissionSchema,
  issueSchema
};