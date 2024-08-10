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

//route to get current week statement
router.get('/current/current-week', async (req, res) => {
  try {
    // Calculate the start and end dates for the current week
    const now = new Date();
    const dayOfWeek = now.getDay();

    // Set to the start of the current week (Sunday)
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - dayOfWeek);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    // Set to the end of the current week (Saturday)
    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 7);
    endOfCurrentWeek.setHours(23, 59, 59, 999);

    // Fetch statements where the customCreatedAt date is within the current week
    const statements = await Statement.aggregate([
      {
        $match: {
          customCreatedAt: {
            $gte: startOfCurrentWeek,
            $lt: endOfCurrentWeek
          }
        }
      },
      {
        $lookup: {
          from: 'clients', 
          localField: 'clientId', 
          foreignField: '_id', 
          as: 'clientData' 
        }
      },
      {
        $unwind: '$clientData'
      },
      {
        $project: {
          clientId: 1,
          clientName: 1,
          grossCommission: '$clientData.grossCommission',
          totalGross: 1,
          totalBooks: 1,
          wins: 1,
          prevbalOffice: 1,
          cashOffice: 1,
          prevbalClient: 1,
          cashClient: 1,
          gross: 1,
          books: 1,
          customCreatedAt: 1
        }
      }
    ]).sort({ customCreatedAt: -1 });

    res.status(200).json(statements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


///get the current yaer statement
router.get('/current/current-year', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const statements = await Statement.aggregate([
      {
        $match: {
          customCreatedAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $unwind: '$client'
      },
      {
        $group: {
          _id: {
            month: { $month: "$customCreatedAt" },
            clientId: "$clientId",
          },
          grossCommission: { $max: "$client.grossCommission" },
          totalGross: { $sum: { $sum: "$gross" } },
          totalBooks: { $sum: { $sum: "$books" } },
          wins: { $sum: "$wins" },
          prevbalOffice: { $sum: "$prevbalOffice" },
          cashOffice: { $sum: "$cashOffice" },
          prevbalClient: { $sum: "$prevbalClient" },
          cashClient: { $sum: "$cashClient" }
        }
      }
    ]);

    res.status(200).json(statements);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const statements = await Statement.findOne({ clientId: clientId }).sort({ customCreatedAt: -1 });
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
  const { startDate, ...updateFields } = req.body; // Extract startDate from the request body

  try {
    // Find the existing statement to get the current customCreatedAt value
    const existingStatement = await Statement.findOne({ _id: statementId, clientId: clientId });

    if (!existingStatement) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    // Update the startDate to the current value of customCreatedAt
    updateFields.startDate = existingStatement.customCreatedAt;

    // Also, set the new customCreatedAt to the new startDate value provided in the request
    updateFields.customCreatedAt = startDate;

    // Perform the update with the modified fields
    const updatedStatement = await Statement.findOneAndUpdate(
      { _id: statementId, clientId: clientId },
      updateFields,
      { new: true }
    );

    res.status(200).json(updatedStatement);
  } catch (error) {
    console.error('Error updating statement:', error);
    res.status(500).json({ error: 'Failed to update statement' });
  }
});



module.exports = router;
