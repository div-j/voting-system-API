const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validateCompetition } = require('../middlewares/validation');
const {
  createCompetition,
  getAllCompetitions,
  getCompetition,
  updateCompetition,
  deleteCompetition,
  getCompetitionDetails
} = require('../controllers/competition.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Competition:
 *       type: object
 *       required:
 *         - title
 *         - startDate
 *         - endDate
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the competition
 *         title:
 *           type: string
 *           description: The title of the competition
 *         description:
 *           type: string
 *           description: Detailed description of the competition
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: When the competition starts
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: When the competition ends
 *         isActive:
 *           type: boolean
 *           description: Whether the competition is currently active
 *         userId:
 *           type: string
 *           description: ID of the user who created the competition
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the competition was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the competition was last updated
 */

/**
 * @swagger
 * /api/competitions:
 *   post:
 *     summary: Create a new competition
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Competition created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competition'
 */
router.post('/', validateCompetition, createCompetition);

/**
 * @swagger
 * /api/competitions:
 *   get:
 *     summary: Get all competitions
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all competitions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Competition'
 */
router.get('/', getAllCompetitions);

/**
 * @swagger
 * /api/competitions/{id}:
 *   get:
 *     summary: Get a competition by id
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition id
 *     responses:
 *       200:
 *         description: Competition details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competition'
 *       404:
 *         description: Competition not found
 */
router.get('/:id', getCompetition);

/**
 * @swagger
 * /api/competitions/{id}/details:
 *   get:
 *     summary: Get competition details
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition id
 *     responses:
 *       200:
 *         description: Competition details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competition'
 *       404:
 *         description: Competition not found
 */
router.get('/:id/details', getCompetitionDetails);

/**
 * @swagger
 * /api/competitions/{id}:
 *   put:
 *     summary: Update a competition
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Competition updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Competition'
 *       403:
 *         description: Not authorized to update this competition
 *       404:
 *         description: Competition not found
 */
router.put('/:id', validateCompetition, updateCompetition);

/**
 * @swagger
 * /api/competitions/{id}:
 *   delete:
 *     summary: Delete a competition
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition id
 *     responses:
 *       200:
 *         description: Competition deleted successfully
 *       403:
 *         description: Not authorized to delete this competition
 *       404:
 *         description: Competition not found
 */
router.delete('/:id', deleteCompetition);

// Admin routes
const adminRouter = express.Router();
adminRouter.use(roleMiddleware('SUPER_ADMIN'));

// Get all competitions with full details (admin only)
adminRouter.get('/admin/competitions', getAllCompetitions);

// Delete any competition (admin only)
adminRouter.delete('/admin/competitions/:id', deleteCompetition);

router.use(adminRouter);

module.exports = router; 