const jwt = require("jsonwebtoken");
require("dotenv").config();



module.exports.generateToken = (user, callback) => {
    console.log("user", user);
    jwt.sign(
      {
        username: user.username,
        email: user.email,
        password: user.password
      },
      process.env.JWT_KEY,
      (err, res) => {
        callback(err, res);
      }
    );
  };

  module.exports.authorizeUser = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]||
                  req.headers.authorization ||
                  req.headers["X-access-token"] ||
                  req.body.token

         if(!token){
           res.status(401).json({
              message: 'Unauthorized user'
           })
         }
         try{
           const decoded = jwt.verify(token, process.env.JWT_KEY);
           req.user = decoded;
           next();
         }
        catch(err){
            res.status(400).json({
              error: err
            })
          }
        
}
          
  
            

  