const express = require('express');
const cors = require('cors');
const path = require('path');
const projectRoutes = require('./routes/projects');
const lookupRoutes = require('./routes/lookup');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api', lookupRoutes);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
