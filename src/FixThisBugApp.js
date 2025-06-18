import React, { useState, useEffect } from 'react';
import { Search, Star, Calendar, MessageCircle, Filter, Github, Code, Users, Bug, ArrowRight, Mail, Bell, Plus, X, AlertCircle, CheckCircle, Send } from 'lucide-react';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

console.log('API_BASE_URL:', API_BASE_URL);
const FixThisBugApp = () => {
  const [repositories, setRepositories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBugForm, setShowBugForm] = useState(false);
  const [notification, setNotification] = useState(null);

  // Bug submission form state
  const [bugForm, setBugForm] = useState({
    title: '',
    description: '',
    repository_url: '',
    issue_url: '',
    language: '',
    difficulty: 'beginner',
    labels: '',
    submitter_email: '',
    submitter_name: ''
  });

  // Fetch repositories from backend
  const fetchRepositories = async (page = 1, language = 'all', search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(language !== 'all' && { language }),
        ...(search && { search })
      });

      const response = await fetch(`${API_BASE_URL}/repositories?${params}`);
      const data = await response.json();

      if (response.ok) {
        setRepositories(data.repositories);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        showNotification('Error fetching repositories', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to fetch repositories', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch language statistics
  const fetchLanguages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/languages`);
      const data = await response.json();

      if (response.ok) {
        setLanguages(data);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  // Subscribe to newsletter
  const handleSubscription = async () => {
    if (!email || !email.includes('@')) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Successfully subscribed to newsletter!', 'success');
        setEmail('');
      } else {
        showNotification(data.error || 'Subscription failed', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to subscribe', 'error');
    }
  };

  // Submit bug report
  const handleBugSubmission = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['title', 'description', 'repository_url', 'language', 'submitter_email', 'submitter_name'];
    const missingFields = requiredFields.filter(field => !bugForm[field].trim());
    
    if (missingFields.length > 0) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      const submissionData = {
        ...bugForm,
        labels: bugForm.labels.split(',').map(label => label.trim()).filter(label => label)
      };

      const response = await fetch(`${API_BASE_URL}/submit-bug`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Bug submitted successfully! It will be reviewed before being published.', 'success');
        setBugForm({
          title: '',
          description: '',
          repository_url: '',
          issue_url: '',
          language: '',
          difficulty: 'beginner',
          labels: '',
          submitter_email: '',
          submitter_name: ''
        });
        setShowBugForm(false);
      } else {
        showNotification(data.error || 'Failed to submit bug', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to submit bug', 'error');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchRepositories(1, selectedLanguage, searchTerm);
  };

  // Handle language filter change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCurrentPage(1);
    fetchRepositories(1, language, searchTerm);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchRepositories(page, selectedLanguage, searchTerm);
  };

  // Load data on component mount
  useEffect(() => {
    fetchRepositories();
    fetchLanguages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bug className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">FixThisBug</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-red-500 transition-colors">Browse Issues</a>
              <button 
                onClick={() => setShowBugForm(true)}
                className="text-gray-700 hover:text-red-500 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Submit Bug</span>
              </button>
              <a href="/about" className="text-gray-700 hover:text-red-500 transition-colors">About</a>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
                <Github className="h-4 w-4" />
                                <span><a href="https://github.com/ShreyashPG/FixThisBUG">GitHub</a></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bug Submission Modal */}
      {showBugForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bug className="h-6 w-6 text-red-500 mr-2" />
                  Submit a Bug Report
                </h2>
                <button 
                  onClick={() => setShowBugForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleBugSubmission} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={bugForm.submitter_name}
                      onChange={(e) => setBugForm({...bugForm, submitter_name: e.target.value})}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={bugForm.submitter_email}
                      onChange={(e) => setBugForm({...bugForm, submitter_email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bug Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={bugForm.title}
                    onChange={(e) => setBugForm({...bugForm, title: e.target.value})}
                    placeholder="Brief description of the bug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={bugForm.description}
                    onChange={(e) => setBugForm({...bugForm, description: e.target.value})}
                    placeholder="Detailed description of the bug, steps to reproduce, expected behavior, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repository URL *
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={bugForm.repository_url}
                      onChange={(e) => setBugForm({...bugForm, repository_url: e.target.value})}
                      placeholder="https://github.com/owner/repo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue URL (optional)
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={bugForm.issue_url}
                      onChange={(e) => setBugForm({...bugForm, issue_url: e.target.value})}
                      placeholder="https://github.com/owner/repo/issues/123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Programming Language *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={bugForm.language}
                      onChange={(e) => setBugForm({...bugForm, language: e.target.value})}
                    >
                      <option value="">Select language</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="Java">Java</option>
                      <option value="C++">C++</option>
                      <option value="C">C</option>
                      <option value="PHP">PHP</option>
                      <option value="Ruby">Ruby</option>
                      <option value="Go">Go</option>
                      <option value="Rust">Rust</option>
                      <option value="HTML">HTML</option>
                      <option value="CSS">CSS</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={bugForm.difficulty}
                      onChange={(e) => setBugForm({...bugForm, difficulty: e.target.value})}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Labels (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={bugForm.labels}
                    onChange={(e) => setBugForm({...bugForm, labels: e.target.value})}
                    placeholder="bug, good first issue, documentation"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBugForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Bug</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Find & Fix Open Source Bugs</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover beginner-friendly bugs from popular open source projects. 
            Start contributing to the community and build your coding skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search repositories or bugs..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <span>Search</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-red-500" />
                Filter by Language
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleLanguageChange('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedLanguage === 'all' 
                      ? 'bg-red-50 text-red-600 border border-red-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  All Languages
                </button>
                {languages.map((tag) => (
                  <button
                    key={tag.slug}
                    onClick={() => handleLanguageChange(tag.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between ${
                      selectedLanguage === tag.slug 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{tag.language}</span>
                    <span className="text-sm text-gray-500">{tag.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subscription Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-red-500" />
                Stay Updated
              </h3>
              <p className="text-gray-600 mb-4">Get notified about new bugs and opportunities to contribute.</p>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSubscription}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Open Source Bugs ({repositories.reduce((acc, repo) => acc + repo.issues.length, 0)})
              </h2>
              <p className="text-gray-600">Find bugs that match your skill level and interests</p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading repositories...</p>
              </div>
            ) : (
              <>
                {/* Repository Boxes */}
                <div className="space-y-6">
                  {repositories.map((repo) => (
                    <div key={repo._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Code className="h-6 w-6 text-gray-600" />
                              <h3 className="text-xl font-semibold text-gray-900">
                                {repo.owner}/{repo.name}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                repo.language === 'JavaScript' ? 'bg-yellow-100 text-yellow-800' :
                                repo.language === 'Python' ? 'bg-blue-100 text-blue-800' :
                                repo.language === 'PHP' ? 'bg-purple-100 text-purple-800' :
                                repo.language === 'TypeScript' ? 'bg-indigo-100 text-indigo-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {repo.language}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">{repo.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                <span>{repo.stars_display}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bug className="h-4 w-4" />
                                <span>{repo.issues.length} open issues</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Updated {new Date(repo.last_modified).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 self-start"
                          >
                            <Github className="h-4 w-4" />
                            <span>View Repo</span>
                          </a>
                        </div>

                        {/* Issues */}
                        {repo.issues.length > 0 && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Open Issues:</h4>
                            <div className="space-y-3">
                              {repo.issues.map((issue) => (
                                <div key={issue._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <a
                                        href={issue.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-900 font-medium hover:text-red-600 transition-colors"
                                      >
                                        {issue.title}
                                      </a>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span>#{issue.number}</span>
                                        <div className="flex items-center gap-1">
                                          <MessageCircle className="h-3 w-3" />
                                          <span>{issue.comments_count} comments</span>
                                        </div>
                                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                      {issue.labels && issue.labels.map((label, index) => (
                                        <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          label.includes('good first issue') ? 'bg-green-100 text-green-800' :
                                          label.includes('bug') ? 'bg-red-100 text-red-800' :
                                          label.includes('documentation') ? 'bg-blue-100 text-blue-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {label}
                                        </span>
                                      ))}
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        issue.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                        issue.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {issue.difficulty}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

             {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-red-500 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
               {/* Footer */}
                    <footer className="bg-gray-900 text-white py-12">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <Bug className="h-8 w-8 text-red-500" />
                              <span className="text-2xl font-bold">FixThisBug</span>
                            </div>
                            <p className="text-gray-400">
                              Making open-source contribution accessible to everyone.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                            <ul className="space-y-2 text-gray-400">
                              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                              <li><a href="#" className="hover:text-white transition-colors">Browse Issues</a></li>
                              <li><a href="#" className="hover:text-white transition-colors">Submit a Bug</a></li>
                              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2 text-gray-400">
                              {/* <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li> */}
                              {/* <li><a href="#" className="hover:text-white transition-colors">Contributor Guide</a></li> */}
                              {/* <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li> */}
                             <li><a href="http://github.com/ShreyashPG/FixThisBUG" className="hover:text-white transition-colors">GitHub</a></li>

                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Connect</h3>
                            <div className="flex space-x-4 mb-4">
                              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                              </a>
                              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                </svg>
                              </a>
                              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                                </svg>
                              </a>
                            </div>
                            <p className="text-gray-400">
                              &copy; {new Date().getFullYear()} FixThisBug. All rights reserved.
                            </p>
                          </div>
                        </div>
                      </div>
                    </footer>
    </div>
  );
};

export default FixThisBugApp;