const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const User = require('../models/user2')

module.exports = function (passport){

    
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'https://virtual-library-5ysd.onrender.com/auth/google/callback'
    },
    async (accessToken, refreshtoken, profile, done)=>{
        console.log(profile);

        const newUser = 
            {
                googleID : profile.id,
                displayName : profile.displayName,
                firstName : profile.name.givenName,
                lastName : profile.name.familyName,
                image : profile.photos[0].value,
                mail : profile.emails[0].value,
                admin : false
            }
        

        
        try {
            console.log("try reached");
            let user = await User.findOne({googleID:profile.id})
            if (user) {
                done(null,user);
                console.log("User Exists");
            }
            else{
                user =  await User.create(newUser);
                done(null,user);
                console.log("New user Exists");
            }
            // let x =  User.count({googleID: profile.id}, async (err, count)=>{ 
            //      let user;
            //     console.log(count,"fxcghjgfdghj");
            //     if(count){
                    
            //         //document exists });
            //         done(null,user);
            //     console.log("if reached");
            //     }
            //     else{
            //     user =  newUser.save();
            //     done(null,user)
            //     console.log("else reached");
                
            //     }
            // }); 

            // console.log("x is "+x);
            // const profileid = profile.id;
            // const user = User.findOne({profileid})
            //     if (user) {
            //         console.log("found");   
            //         done(null,user);
            //     }
            //     else{
            //         user =  User.create(newUser)
            //         done(null,user)
            //         console.log("not");

            //     }
            
            

        } catch (error) {
            console.log("error is in catch ");
            console.log(error);
        }
        // console.log("email is"+email);
    }
    ))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

    
}
