const express = require('express');

const app = express();



// Error handling middleware

module.exports =  ((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

