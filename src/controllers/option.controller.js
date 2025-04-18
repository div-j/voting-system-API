const prisma = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler");

// Add option to competition
const addOption = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl } = req.body;

  // Check if competition exists and belongs to user
  const competition = await prisma.competition.findUnique({
    where: { id }
  });

  if (!competition) {
    return res.status(404).json({ message: 'Competition not found' });
  }

  if (competition.userId !== req.user.userId) {
    return res.status(403).json({ message: 'Not authorized to add options to this competition' });
  }

  const option = await prisma.option.create({
    data: {
      name,
      description,
      imageUrl,
      competitionId: id
    }
  });

  res.status(201).json(option);
});

// Update option
const updateOption = asyncHandler(async (req, res) => {
  const { id, optionId } = req.params;
  const { name, description, imageUrl } = req.body;

  // Check if competition exists and belongs to user
  const competition = await prisma.competition.findUnique({
    where: { id }
  });

  if (!competition) {
    return res.status(404).json({ message: 'Competition not found' });
  }

  if (competition.userId !== req.user.userId) {
    return res.status(403).json({ message: 'Not authorized to update options in this competition' });
  }

  const option = await prisma.option.update({
    where: { id: optionId },
    data: {
      name,
      description,
      imageUrl
    }
  });

  res.json(option);
});

// Delete option
const deleteOption = asyncHandler(async (req, res) => {
  const { id, optionId } = req.params;

  // Check if competition exists and belongs to user
  const competition = await prisma.competition.findUnique({
    where: { id }
  });

  if (!competition) {
    return res.status(404).json({ message: 'Competition not found' });
  }

  if (competition.userId !== req.user.userId) {
    return res.status(403).json({ message: 'Not authorized to delete options from this competition' });
  }

  await prisma.option.delete({
    where: { id: optionId }
  });

  res.json({ message: 'Option deleted successfully' });
});

// Vote for an option
const voteForOption = asyncHandler(async (req, res) => {
  const { id, optionId } = req.params;

  // Check if competition exists and is active
  const competition = await prisma.competition.findUnique({
    where: { id }
  });

  if (!competition) {
    return res.status(404).json({ message: 'Competition not found' });
  }

  if (!competition.isActive) {
    return res.status(400).json({ message: 'This competition is not active' });
  }

  const now = new Date();
  if (now < competition.startDate || now > competition.endDate) {
    return res.status(400).json({ message: 'Voting is not allowed at this time' });
  }

  // Check if option exists
  const option = await prisma.option.findUnique({
    where: { id: optionId }
  });

  if (!option) {
    return res.status(404).json({ message: 'Option not found' });
  }

  // Increment vote count
  const updatedOption = await prisma.option.update({
    where: { id: optionId },
    data: {
      voteCount: {
        increment: 1
      }
    }
  });

  res.json(updatedOption);
});

module.exports = {
  addOption,
  updateOption,
  deleteOption,
  voteForOption
}; 