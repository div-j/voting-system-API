const validateCompetition = (req, res, next) => {
  const { title, startDate, endDate } = req.body;

  // Check required fields
  if (!title || !startDate || !endDate) {
    return res.status(400).json({ message: 'Title, start date, and end date are required' });
  }

  // Convert dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // Validate dates
  if (start >= end) {
    return res.status(400).json({ message: 'End date must be after start date' });
  }

  if (start < now) {
    return res.status(400).json({ message: 'Start date cannot be in the past' });
  }

  next();
};

const validateOption = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Option name is required' });
  }

  next();
};

module.exports = {
  validateCompetition,
  validateOption
}; 