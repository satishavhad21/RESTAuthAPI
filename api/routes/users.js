const express = require('express');
const router = express.Router();
const validate_body=require('../middleware/validate-body');

const userController=require('../../controllers/userController');

// this file contains only route details. controller has actual logic to process data
router.post('/signup/',validate_body.validatePostUser,userController.signup );

router.post('/login/', validate_body.validatePostUser,userController.login);

router.delete('/:userId/', userController.delete);

module.exports = router;

