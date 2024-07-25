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

router.get('/current/current-week', async (req, res) => {
  try {
    // Calculate the start and end dates for the current week
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Set to the start of the current week (Sunday)
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - dayOfWeek);
    startOfCurrentWeek.setHours(0, 0, 0, 0); // Start of the day
    
    // Set to the end of the current week (Saturday)
    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 7);
    endOfCurrentWeek.setHours(23, 59, 59, 999); // End of the day

    // Fetch statements where the createdAt date is within the current week
    const statements = await Statement.find({
      createdAt: {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek
      }
    }).sort({ createdAt: -1 }); // Optional: sort by createdAt in descending order

    res.status(200).json(statements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/current/current-year', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const statements = await Statement.aggregate([
      {
        $match: {
          createdAt: {
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
            month: { $month: "$createdAt" },
            clientId: "$clientId",
            clientName: { $first: "$client.clientName" } // Correctly capturing client name
          },
          grossCommission: { $max: "$client.grossCommission" },
          totalGross: { $sum: { $sum: "$gross" } }, // Summing the gross array values
          totalBooks: { $sum: { $sum: "$books" } }, // Summing the books array values
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
