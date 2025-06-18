// scripts/seedData.js - Script to populate database with sample data
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixthisbug', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import schemas (copy from server.js)
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

const Repository = mongoose.model('Repository', repositorySchema);

// Sample data
const sampleRepositories = [
  {
    name: "wp-graphql",
    owner: "wp-graphql",
    description: "🚀 GraphQL API for WordPress",
    language: "PHP",
    slug: "php",
    url: "https://github.com/wp-graphql/wp-graphql",
    stars: 2925,
    stars_display: "2.92K",
    github_id: "wp-graphql/wp-graphql",
    tags: ["wordpress", "graphql", "api"],
    issues: [
      {
        title: "Comment Mutations update_additional_comment_data() is empty",
        url: "https://github.com/wp-graphql/wp-graphql/issues/942",
        number: 942,
        comments_count: 1,
        created_at: new Date("2019-08-16T08:35:25+00:00"),
        labels: ["good first issue", "bug"],
        difficulty: "beginner",
        status: "open"
      },
      {
        title: "Feature: Add location to menu idType's",
        url: "https://github.com/wp-graphql/wp-graphql/issues/1458",
        number: 1458,
        comments_count: 0,
        created_at: new Date("2020-09-11T11:05:49+00:00"),
        labels: ["good first issue", "enhancement"],
        difficulty: "intermediate",
        status: "open"
      }
    ]
  },
  {
    name: "react",
    owner: "facebook",
    description: "A declarative, efficient, and flexible JavaScript library for building user interfaces",
    language: "JavaScript",
    slug: "javascript",
    url: "https://github.com/facebook/react",
    stars: 225000,
    stars_display: "225K",
    github_id: "facebook/react",
    tags: ["react", "javascript", "ui", "library"],
    issues: [
      {
        title: "DevTools: Support React 18 features",
        url: "https://github.com/facebook/react/issues/21234",
        number: 21234,
        comments_count: 8,
        created_at: new Date("2025-06-01T10:30:00+00:00"),
        labels: ["good first issue", "DevTools"],
        difficulty: "intermediate",
        status: "open"
      },
      {
        title: "Add TypeScript definitions for new hooks",
        url: "https://github.com/facebook/react/issues/21567",
        number: 21567,
        comments_count: 3,
        created_at: new Date("2025-06-05T14:20:00+00:00"),
        labels: ["good first issue", "TypeScript"],
        difficulty: "beginner",
        status: "open"
      }
    ]
  },
  {
    name: "tensorflow",
    owner: "tensorflow",
    description: "An Open Source Machine Learning Framework for Everyone",
    language: "Python",
    slug: "python",
    url: "https://github.com/tensorflow/tensorflow",
    stars: 185000,
    stars_display: "185K",
    github_id: "tensorflow/tensorflow",
    tags: ["machine-learning", "python", "ai", "deep-learning"],
    issues: [
      {
        title: "Memory leak in tf.data.Dataset.from_generator",
        url: "https://github.com/tensorflow/tensorflow/issues/67890",
        number: 67890,
        comments_count: 5,
        created_at: new Date("2025-06-12T09:45:00+00:00"),
        labels: ["good first issue", "bug", "tf.data"],
        difficulty: "intermediate",
        status: "open"
      },
      {
        title: "Add documentation for custom training loops",
        url: "https://github.com/tensorflow/tensorflow/issues/68123",
        number: 68123,
        comments_count: 2,
        created_at: new Date("2025-06-14T16:30:00+00:00"),
        labels: ["good first issue", "documentation"],
        difficulty: "beginner",
        status: "open"
      }
    ]
  },
  {
    name: "vscode",
    owner: "microsoft",
    description: "Visual Studio Code - Open Source IDE",
    language: "TypeScript",
    slug: "typescript",
    url: "https://github.com/microsoft/vscode",
    stars: 163000,
    stars_display: "163K",
    github_id: "microsoft/vscode",
    tags: ["editor", "typescript", "ide"],
    issues: [
      {
        title: "Terminal: Add support for custom shells",
        url: "https://github.com/microsoft/vscode/issues/12345",
        number: 12345,
        comments_count: 12,
        created_at: new Date("2025-06-08T11:15:00+00:00"),
        labels: ["good first issue", "terminal"],
        difficulty: "intermediate",
        status: "open"
      }
    ]
  },
  {
    name: "django",
    owner: "django",
    description: "The Web framework for perfectionists with deadlines",
    language: "Python",
    slug: "python",
    url: "https://github.com/django/django",
    stars: 78000,
    stars_display: "78K",
    github_id: "django/django",
    tags: ["web-framework", "python"],
    issues: [
      {
        title: "Add async support for database queries",
        url: "https://github.com/django/django/issues/54321",
        number: 54321,
        comments_count: 15,
        created_at: new Date("2025-06-03T13:45:00+00:00"),
        labels: ["good first issue", "async", "orm"],
        difficulty: "advanced",
        status: "open"
      },
      {
        title: "Improve error messages for form validation",
        url: "https://github.com/django/django/issues/54567",
        number: 54567,
        comments_count: 4,
        created_at: new Date("2025-06-11T10:20:00+00:00"),
        labels: ["good first issue", "forms"],
        difficulty: "beginner",
        status: "open"
      }
    ]
  },
  {
    name: "bootstrap",
    owner: "twbs",
    description: "The most popular HTML, CSS, and JavaScript framework for developing responsive websites",
    language: "HTML",
    slug: "html",
    url: "https://github.com/twbs/bootstrap",
    stars: 168000,
    stars_display: "168K",
    github_id: "twbs/bootstrap",
    tags: ["css", "html", "framework", "responsive"],
    issues: [
      {
        title: "Update documentation for new utility classes",
        url: "https://github.com/twbs/bootstrap/issues/39876",
        number: 39876,
        comments_count: 3,
        created_at: new Date("2025-06-09T15:30:00+00:00"),
        labels: ["good first issue", "documentation"],
        difficulty: "beginner",
        status: "open"
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    
    // Clear existing data
    await Repository.deleteMany({});
    console.log('Cleared existing repositories');

    // Insert sample data
    await Repository.insertMany(sampleRepositories);
    console.log(`Inserted ${sampleRepositories.length} sample repositories`);

    // Display summary
    const totalIssues = sampleRepositories.reduce((acc, repo) => acc + repo.issues.length, 0);
    console.log(`Total issues inserted: ${totalIssues}`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();