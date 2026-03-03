const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const lookupRoutes = require('./routes/lookup');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api', lookupRoutes);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
