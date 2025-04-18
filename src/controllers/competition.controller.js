const prisma = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler");

// Create competition
const createCompetition = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  
  const competition = await prisma.competition.create({
    data: {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: req.user.userId
    }
  });

  res.status(201).json(competition);
});

// Get all competitions (public view)
const getAllCompetitions = asyncHandler(async (req, res) => {
  const competitions = await prisma.competition.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      isActive: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          fullName: true
        }
      }
    }
  });
  res.json(competitions);
});

// Get single competition (public view)
const getCompetition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const competition = await prisma.competition.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      isActive: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          fullName: true
        }
      },
      options: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          voteCount: true
        }
      }
    }
  });

  if (!competition) {
    return res.status(404).json({ message: 'Competition not found' });
  }

  res.json(competition);
});

// Get competition details (with options and votes)
const getCompetitionDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const competition = await prisma.competition.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true
        }
      },
      options: {
        include: {
          votes: {
            select: {
              userId: true
            }
          }
        }
      }
    }
  });

  if (!competition) {
    return res.status(404).json({ message: 'Competition not found' });
  }

  // Check if user is owner or super admin
  const isOwner = competition.userId === req.user.userId;
  const isSuperAdmin = req.user.role === 'SUPER_ADMIN';

  if (!isOwner && !isSuperAdmin) {
    return res.status(403).json({ message: 'Not authorized to view details' });
  }

  res.json(competition);
});

// Update competition
const updateCompetition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;
  
  const competition = await prisma.competition.findUnique({
    where: { id }
  });

  if (!competition) {
    return res.status(404).json({ message: 'Competition not found' });
  }

  // Check if user is owner
  if (competition.userId !== req.user.userId) {
    return res.status(403).json({ message: 'Not authorized to update this competition' });
  }

  const updatedCompetition = await prisma.competition.update({
    where: { id },
    data: {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    }
  });

  res.json(updatedCompetition);
});

// Delete competition
const deleteCompetition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const competition = await prisma.competition.findUnique({
    where: { id }
  });

  if (!competition) {
    return res.status(404).json({ message: 'Competition not found' });
  }

  // Check if user is owner or super admin
  const isOwner = competition.userId === req.user.userId;
  const isSuperAdmin = req.user.role === 'SUPER_ADMIN';

  if (!isOwner && !isSuperAdmin) {
    return res.status(403).json({ message: 'Not authorized to delete this competition' });
  }

  await prisma.competition.delete({
    where: { id }
  });

  res.json({ message: 'Competition deleted successfully' });
});

module.exports = {
  createCompetition,
  getAllCompetitions,
  getCompetition,
  getCompetitionDetails,
  updateCompetition,
  deleteCompetition
}; 