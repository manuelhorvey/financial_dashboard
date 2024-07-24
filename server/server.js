const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const clientsController = require('./routes/clientsRoute');
const statementsController = require('./routes/statementRoute')
const expenseController = require('./routes/expenseRoute');
const employeeController = require('./routes/employeeRoute');

app.use('/clients', clientsController);
app.use('/statements', statementsController);
app.use('/expenses', expenseController);
app.use('/employees', employeeController);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
