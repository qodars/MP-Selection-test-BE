const db = require("../models");
const User = db.user;
const transporter = require('../middleware/emailer');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginOpsi = require("sequelize");

const authController = {
    register: async (req, res) =>{
        try {
            const { username, email, fullname, bio, picture, password, confim_pass } = req.body
            
            const cekUname = await User.findOne({
                where:{
                    username
                }
            })
            const cekEmail = await User.findOne({
                where:{
                    email
                }
            })

            if (cekUname) {
                return res.status(402).json({
                    message: `${username} sudah ada!!. Silahkan ganti username`
                })
            }else if(cekEmail){ 
                return res.status(402).json({
                    message: `${email} sudah ada!!. Silahkan ganti email`
                })
            }

            const pwd = password

            const isContainsUppercase = /^(?=.*[A-Z]).*$/;
            if (!isContainsUppercase.test(pwd)) {
              return res.status(402).send({
                message: "Password must have at least one Uppercase Character."
              });
            }
            const isContainsNumber = /^(?=.*[0-9]).*$/;
            if (!isContainsNumber.test(pwd)) {
                return res.status(402).json({
                    message: "Password must contain at least one Digit."
                  });
            //   return "Password must contain at least one Digit.";
            }
          
            const isContainsSymbol =
              /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
            if (!isContainsSymbol.test(pwd)) {
                return res.status(402).json({
                    message: "Password must contain at least one Special Symbol."
                  });
            //   return "Password must contain at least one Special Symbol.";
            }

            if (pwd.length < 8) {
                return res.status(400).json({
                  message: "Minimal password 8 karakter!!"
                });
              }

            if (pwd !== confim_pass) {
                    return res.status(402).json({
                      message: "Penulisan password tidak sama!!"
                    });
                  }
            
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(pwd, salt);
            
          const data=  await User.create({username, email, password: hashPassword});
            const payload= {id: data.user_id, name:data.username}
            const token = jwt.sign(payload, 'qodars97', { expiresIn: '12h' }  
        );

            let mail = {
                from:`Admin <group3nodejs@gmail.com`,
                to: `${email}`,
                subject: `Verify Account`,
                html:`<a href="http://localhost:3000/verify/${token}"> Click here for verification for your account</a>`
            }

            transporter.sendMail(mail,(errMail, resMail) =>{
                if (errMail) {
                    console.log(errMail)
                }
                res.status(200).send({message:"Registration success, Check your email", success: true})
            })

            return res.status(200).json({
                message: "registrasi akun anda berhasil"
              })
        } catch (err) {
            console.log(err);
            return res.status(err.statusCode || 500).json({
                message: err.message
            })
        }
    },
    verification: async (req, res) =>{
        // try {
        //     const {token} = req.params
        //     jwt.verify(token, 'qodars97', async (err) => {
        //         if (err) {
        //             console.log(err);
        //             res.send("Email verification failed, possibly the link is invalid or expired");
        //         }
        //         else {
        //             const status = "verified"
        //             const id = jwt.verify(token,'qodars97').id
    
        //         await User.update({ status },{
        //             where:{
        //                 user_id: id
        //             }
        //         });
                
        //         res.status(200).json({
        //             message: "anda berhasil"
        //           })
        //         }
        //     })
                
            
        // }catch (err) {
        //     console.log(err)
        //     return res.status(err.statusCode || 500).json({
        //         message: err.message
        //     })
        // }

        const status = "verified"
        const id = req.user.id
        await User.update({ status },
            {
                where: {
                    user_id: id
                }
            });
            return res.status(200).json({
                message: "Profile berhasil diupdate"
            })

    },
    forgotPassword: async (req, res) =>{
        try {
            const { email } = req.body;

            const cekEmail = await User.findOne({
                where:{
                    email
                }
            })
            let payload = {id: cekEmail.user_id};
            const token = jwt.sign({
                data: payload,
            }, 'qodars97', { expiresIn: '15m' }  
        );

            if(cekEmail){ 
                res.status(200).json({
                    message: `email berhasil ditemukan!!. Silahkan cek kotak masuk email anda`,  
                });
                let mail = {
                    from:`Admin <group3nodejs@gmail.com`,
                    to: `${email}`,
                    subject: `Forgot Password`,
                    html:`<a href="http://localhost:3000/page/editpassword/${token}"> Click here for your update password</a>`
                }
    
                transporter.sendMail(mail,(errMail, resMail) =>{
                    if (errMail) {
                        console.log(errMail)
                    }
                })
               return cekEmail
            }else{
                return res.status(409).json({
                    message: ` data tidak ada atau email belum terdaftar`
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(err.statusCode || 500).json({
                message: err.message
            })
        }
    },
    putpassword: async (req, res) =>{
        const {password, confim_pass} = req.body
        const {token} = req.params
        // const decode = jwt.verify(token, 'qodars97');
        // const id = decode.id
        // console.log(id);
        // Verifying the JWT token 
       jwt.verify(token, 'qodars97', async (err) => {
            if (err) {
                console.log(err);
                res.send("Email verification failed, possibly the link is invalid or expired");
            }
            else {
                const pwd = password
                const id = jwt.verify(token,'qodars97').data.id

            const isContainsUppercase = /^(?=.*[A-Z]).*$/;
            if (!isContainsUppercase.test(pwd)) {
              return res.status(402).json({
                message: "Password must have at least one Uppercase Character."
              });
            }
            const isContainsNumber = /^(?=.*[0-9]).*$/;
            if (!isContainsNumber.test(pwd)) {
                return res.status(402).json({
                    message: "Password must contain at least one Digit."
                  });
            //   return "Password must contain at least one Digit.";
            }
          
            const isContainsSymbol =
              /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
            if (!isContainsSymbol.test(pwd)) {
                return res.status(402).json({
                    message: "Password must contain at least one Special Symbol."
                  });
            //   return "Password must contain at least one Special Symbol.";
            }

            if (pwd.length < 8) {
                return res.status(400).json({
                  message: "Minimal password 8 karakter!!"
                });
              }

            if (pwd !== confim_pass) {
                    return res.status(402).json({
                      message: "Penulisan password tidak sama!!"
                    });
                  }
            
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(pwd, salt);

            await User.update({ password: hashPassword},{
                where:{
                    user_id: id
                }
            });
            
            res.status(200).json({
                message: "Reset password anda berhasil"
              })
            }
        })
    },
    login: async (req, res) =>{
        try {
            const {  password } = req.body;

            const checkData = await User.findOne({ where:{[loginOpsi.Op.or]:[ { email: req.body.emailorusername }, { username: req.body.emailorusername }] }});
            if (!checkData) {
                return res.status(409).json({
                    message: "no user found"
                })
            }

            const checkPassword = await bcrypt.compare(password, checkData.password);
            if (!checkPassword) {
                return res.status(409).json({
                    message: "password is incorrect"
                })
            }

            let payload = {id: checkData.user_id, username: checkData.username,
                            bio: checkData.bio, fullname:checkData.fullname };
            const token = jwt.sign(payload, 'rinaldy97',{expiresIn: '24h'}
            )

            return res.status(200).send({
                token,
                message: "success"
            })
        } catch (err) {
            console.log(err)
            return res.status(err.statusCode || 500).json({
                message: err.message
            })
        }
    },
    profiledit: async (req, res) =>{
        try{
        const {username, bio, fullname} = req.body
        const id = req.user.id
        // const token = usertoken.split(' ')[1];

        // const id = jwt.verify(usertoken, 'rinaldy97').data.id

        let picture = '';
        // membuat kondisi di mana untuk membaca filename foto yang akan dikirim ke database
        if (!req.file) {
            console.log("No file upload");
        } else {
            console.log(req.file.filename)
            picture = 'src/pictures/' + req.file.filename
        }

        await User.update({ username, fullname, bio, picture },
            {
                where: {
                    user_id: id
                }
            });
            return res.status(200).json({
                message: "Profile berhasil diupdate"
            })
    }catch (err) {
        console.log(err)
        return res.status(err.statusCode || 500).json({
            message: err.message
        })
    }
}
}
module.exports = authController;