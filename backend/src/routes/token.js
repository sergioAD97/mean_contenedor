// const { Router } = require('express');
// const router = Router();

// const jwt = require ('jsonwebtoken');
// const config = require('../config'); 
// const User = require('../models/User');
// router.post('/register', async (req, res, next) => {
//     const { nombre, email, contra, codigo, documento, celular} = req.body;
//     const user = new User ({
//         nombre,
//         email,
//         contra,
//         celular,
//         documento,
//         codigo
//     });
//     user.contra = await user.cifrarPass(user.contra);
//     await user.save();
    
//     const token = jwt.sign({id: user._id}, config.secret, {
//         expiresIn: 60*60 //una hora
//     })
    
//     res.json({auth:true, token});
//     //console.log(user);
//     //res.json({message: 'usuario creado'})
// })

// router.post('/login', (req, res, next) => {
//     res.json('login');
// })

// router.get('/me', (req, res, next) => {
//     const token = req.header['x-access-token'];
//     if (!token){
//         return res.status(401).json({
//             auth: false,
//             message: 'No token provided'
//         });
//     }
//     const decoded = jwt.verify(token, config.secret);
//     console.log(decoded);
//     res.json('me');
// })

// module.exports = router;