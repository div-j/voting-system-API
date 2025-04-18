const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const { checkCompetitionOwnership } = require('../middlewares/authorization');
const { validateOption } = require('../middlewares/validation');
const checkVoteEligibility = require('../middlewares/voteTracking');
const {
  addOption,
  updateOption,
  deleteOption,
  voteForOption
} = require('../controllers/option.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Option:
 *       type: object
 *       required:
 *         - name
 *         - competitionId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the option
 *         name:
 *           type: string
 *           description: The name of the option
 *         description:
 *           type: string
 *           description: Detailed description of the option
 *         imageUrl:
 *           type: string
 *           description: URL of the option's image
 *         voteCount:
 *           type: integer
 *           description: Number of votes received
 *         competitionId:
 *           type: string
 *           description: ID of the competition this option belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the option was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the option was last updated
 */

/**
 * @swagger
 * /api/competitions/{id}/options:
 *   post:
 *     summary: Add an option to a competition
 *     tags: [Options]
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Option added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Option'
 *       403:
 *         description: Not authorized to add options to this competition
 *       404:
 *         description: Competition not found
 */
router.post('/:id/options', checkCompetitionOwnership, validateOption, addOption);

/**
 * @swagger
 * /api/competitions/{id}/options/{optionId}:
 *   put:
 *     summary: Update an option
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition id
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Option id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Option updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Option'
 *       403:
 *         description: Not authorized to update options in this competition
 *       404:
 *         description: Competition or option not found
 */
router.put('/:id/options/:optionId', checkCompetitionOwnership, validateOption, updateOption);

/**
 * @swagger
 * /api/competitions/{id}/options/{optionId}:
 *   delete:
 *     summary: Delete an option
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition id
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Option id
 *     responses:
 *       200:
 *         description: Option deleted successfully
 *       403:
 *         description: Not authorized to delete options from this competition
 *       404:
 *         description: Competition or option not found
 */
router.delete('/:id/options/:optionId', checkCompetitionOwnership, deleteOption);

/**
 * @swagger
 * /api/competitions/{id}/options/{optionId}/vote:
 *   post:
 *     summary: Vote for an option
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition id
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Option id
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Option'
 *       400:
 *         description: Competition is not active or voting period has ended
 *       404:
 *         description: Competition or option not found
 */
router.post('/:id/options/:optionId/vote', checkVoteEligibility, voteForOption);

module.exports = router; 