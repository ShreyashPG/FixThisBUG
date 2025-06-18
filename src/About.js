import React from 'react';
import { Github, Users, Bug, Code, Star, Mail, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bug className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">FixThisBug</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/ShreyashPG/FixThisBUG" 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About FixThisBug</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connecting developers with open-source projects and beginner-friendly bugs since 2025.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Mission Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  FixThisBug was created to solve a fundamental problem in open-source: 
                  the barrier to entry for new contributors. Many developers want to contribute 
                  to open-source projects but struggle to find appropriate first issues.
                </p>
                <p>
                  We bridge this gap by curating a collection of beginner-friendly bugs from 
                  popular open-source projects, making it easy for developers of all skill levels 
                  to start contributing.
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6 rounded">
                  <p className="text-red-700">
                    <span className="font-bold">Our vision:</span> To create the most welcoming 
                    platform for new open-source contributors and help projects get the support they need.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How FixThisBug Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">1. Discover Projects</h3>
                  <p className="text-gray-600">
                    Browse through carefully curated open-source projects with beginner-friendly issues.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Bug className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">2. Find Bugs</h3>
                  <p className="text-gray-600">
                    Filter bugs by programming language, difficulty level, and project popularity.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">3. Start Contributing</h3>
                  <p className="text-gray-600">
                    Submit fixes, build your portfolio, and become part of the open-source community.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Stats Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">By The Numbers</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-gray-600">Active Contributors</p>
                      <p className="text-2xl font-bold">XXX+</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Bug className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-gray-600">Bugs Fixed</p>
                      <p className="text-2xl font-bold">XXX+</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Github className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-gray-600">Projects Supported</p>
                      <p className="text-2xl font-bold">XXX+</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Code className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-gray-600">Languages</p>
                      <p className="text-2xl font-bold">XXX+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Developer</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed"></div>
                  <div>
                    <h3 className="text-lg font-semibold">Shreyash Ghanekar</h3>
                    <p className="text-gray-600">Full Stack and Cloud Developer</p>
                  </div>
                </div>
                
               
            
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-4">
                Have questions or suggestions? We'd love to hear from you!
              </p>
              <div className="mt-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <textarea
                  rows="4"
                  placeholder="Your message"
                  className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                ></textarea>
                <button
                  className="w-full mt-4 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Contributing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join developers who are making their first open-source contributions through FixThisBug.
          </p>
          <button className="bg-white text-red-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
           <a href="/"> Browse Open Issues </a>
          </button>
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

export default AboutPage;