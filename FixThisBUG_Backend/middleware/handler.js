const express = require('express');

const app = express();




// 404 handler
 module.exports=((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});