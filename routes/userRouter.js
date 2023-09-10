const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const userController = require('../controllers/userController');
const { validateRequest } = require('../utils/validator');

router.post('/register',
  [
    body('username').exists().withMessage('name is required'),
    body('password').exists().withMessage('Password is required'),
    body('email').exists().withMessage('email is required'),
   ], 
  
  userController.register
);

router.post('/signup',[

  body('username').exists().withMessage('name is required'),
  body('password').exists().withMessage('Password is required'),
  body('email').exists().withMessage('email is required'),
  ],
  userController.signup
  )
router.post('/login',
  [
    body('email').exists().withMessage('email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
 
  userController.login
);

router.post('/emailVerify',
  [
    body("email").exists().withMessage("email is required"),
    body("otp").exists().withMessage("otp is required"),
  ],
  userController.emailVerify
);
router.post('/password/reset',
  [
    body("email").exists().withMessage("email is required"),
   
  ],
  userController.sendOtp
);
router.post('/password/reset/verify',
  [
    body("email").exists().withMessage("email is required"),
    body("otp").exists().withMessage("otp is required"),
    body("password").exists().withMessage("New password is required"),
  ],
  userController.resetPassword
);

router.get('/email/verification',
userController.verifySave
);



module.exports = router;
