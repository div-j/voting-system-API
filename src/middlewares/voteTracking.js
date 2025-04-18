const prisma = require("../config/db");
const asyncHandler = require("./asyncHandler");

const checkVoteEligibility = asyncHandler(async (req, res, next) => {
  const { id, optionId } = req.params;
  const userId = req.user.userId;

  // Check if user has already voted in this competition
  const existingVote = await prisma.vote.findFirst({
    where: {
      userId,
      competitionId: id
    }
  });

  if (existingVote) {
    return res.status(400).json({ message: 'You have already voted in this competition' });
  }

  // Check if competition is active and within voting period
  const competition = await prisma.competition.findUnique({
    where: { id }
  });

  if (!competition.isActive) {
    return res.status(400).json({ message: 'This competition is not active' });
  }

  const now = new Date();
  if (now < competition.startDate || now > competition.endDate) {
    return res.status(400).json({ message: 'Voting is not allowed at this time' });
  }

  next();
});

module.exports = checkVoteEligibility; 