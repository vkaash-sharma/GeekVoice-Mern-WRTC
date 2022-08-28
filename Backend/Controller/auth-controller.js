const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service')
class AuthController {
    async sendOtp(req,res){
        const  { phone }  = req.body;
        // console.log(phone);
        if(!phone) {
            res.status(400).json({message:"Phone Field is Required"})
        }

        // we have to generate otp
        const otp =await otpService.generateOtp()
        
        const ttl = 1000*60*2; //2 min tells the expiry time
        
        const expires = Date.now() + ttl;

        const data =`${phone}.${otp}.${expires}`;

        const hash = hashService.hashOtp(data);
         
        // send otp
 
          try {
          await  otpService.sendBySms(phone , otp);
           res.json({
            hash:`${hash}.${expires}` ,
            phone,
          })
          }catch{
            console.log(err);
            res.status(500).json({message:'message sending faild'});
          }
    }
 
    async verifyOtp(req,res) {
            //  logic
            const {otp , hash , phone }=req.body;
            if(!otp || !hash || !phone) {
              res.status(400).json({message:'All Fields are Required'})
            }

            const [hashedOtp , expires] = hash.split('.');
            if(Date.now() > +expires) {
              res.status(400).json({message:'OTP Expired'})
            }
      
            const data = `${phone}.${otp}.${expires}`;
            const isValid = otpService.verifyOtp(hashedOtp , data);
            if(!isValid) {
              res.status(400).json({message: 'Invalid OTP'})
            }

       let user;
      //  let accessToken;
      //  let refreshToken;
   
        try {
          user = await userService.findUser({phone});
          if(!user) {
            user = await userService.createUser({phone})
          }
        }
        catch(err){
           console.log(err);
           res.status(500).json({message:'Db Error'})
        }


        const {accessToken , refreshToken} = tokenService.generateToken({_id: user._id , activated:false});

        res.cookie('refreshtoken' ,refreshToken ,{
          maxAge: 1000 * 60 * 60 * 24 * 30 ,
          httpOnly: true

        });

        res.json({accessToken});


    }


}

module.exports = new AuthController();