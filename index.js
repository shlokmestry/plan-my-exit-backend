const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Add your route setup here
const planRoutes = require('./routes/plan');
app.use('/api/plan', planRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Plan My Exit backend is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
