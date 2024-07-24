const Expense = require('../models/expense');
const express = require('express')
const router = express.Router();

router.get('/',async(req, res)=>{
  try{
    const expenses = await Expense.find();
    res.json(expenses)
  }catch(err){
    res.status(500).json({message:err.message})
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { expense, vendor, details, amount } = req.body;
    const newExpense = new Expense({ expense, vendor, details, amount });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id',async(req, res)=>{
  const {id} = req.params;
  const updates = req.body;
  try {
    const updateExpense = await Expense.findByIdAndUpdate(id, updates, {new:true});
    if(!updateExpense){
      return res.status(404).json({message: "Expense not found"});
    }
    res.json(updateExpense)
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recent/previous-week', async (req, res) => {
  try {
    // Calculate the start and end dates for the previous week
    const now = new Date();
    const startOfCurrentWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfPreviousWeek = new Date(startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() - 1));
    const startOfPreviousWeek = new Date(endOfPreviousWeek.setDate(endOfPreviousWeek.getDate() - 6));

    const expenses = await Expense.find({
      createdAt: {
        $gte: startOfPreviousWeek,
        $lt: startOfCurrentWeek
      }
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/current/current-week', async (req, res) => {
  try {
    // Calculate the start and end dates for the current week
    const now = new Date();
    const startOfCurrentWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 7);

    const expenses = await Expense.find({
      createdAt: {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek
      }
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;