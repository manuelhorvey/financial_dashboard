const express = require('express');
const Statement = require('../models/statement');
const router = express.Router();

// Route to create a new statement
router.post('/', async (req, res) => {
  try {
    // Assuming req.body contains necessary data
    const newStatement = new Statement(req.body);
    const savedStatement = await newStatement.save();
    res.status(201).json(savedStatement);
  } catch (error) {
    console.error('Error creating statement:', error);
    res.status(500).json({ error: 'Failed to create statement' });
  }
});




// Route to get all statements for a specific client
router.get('/:clientId', async (req, res) => {
  const clientId = req.params.clientId;
  
  try {
    const statements = await Statement.find({ clientId: clientId });
    res.json(statements);
  } catch (error) {
    console.error('Error fetching statements:', error);
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

//get the most recent statement:
router.get('/recent/:clientId', async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const statements = await Statement.findOne({ clientId: clientId }).sort({ createdAt: -1 });
    res.json(statements);
  } catch (error) {
    console.error('Error fetching statements:', error);
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

// GET route to find a statement by ID
router.get('/:clientId/:statementId', async (req, res) => {
  const { clientId, statementId } = req.params;

  try {
    const statement = await Statement.findOne({
      _id: statementId,
      clientId: clientId
    });

    if (!statement) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    res.status(200).json(statement);
  } catch (error) {
    console.error('Error finding statement:', error);
    res.status(500).json({ error: 'Failed to find statement' });
  }
});



//make changes to the statement
router.put('/:clientId/:statementId', async (req, res) => {
  const { clientId, statementId } = req.params;
  const updateFields = req.body;

  try {
    const updatedStatement = await Statement.findOneAndUpdate(
      { _id: statementId, clientId: clientId },
      updateFields,
      { new: true }
    );

    if (!updatedStatement) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    res.status(200).json(updatedStatement);
  } catch (error) {
    console.error('Error updating statement:', error);
    res.status(500).json({ error: 'Failed to update statement' });
  }
});


module.exports = router;
