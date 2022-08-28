const authController = require('./controller/auth-controller');

const router = require('express').Router();
// const authController = require('./controller/auth-controller');


router.post('/api/send-otp' ,(req,res) => {
   authController.sendOtp(req,res);
})
router.post('/api/verify-otp' , authController.verifyOtp)

module.exports = router;
