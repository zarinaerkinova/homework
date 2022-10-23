const Auth = require('../model/user')
const { Router } = require('express')
const router = Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')
const { trusted } = require('mongoose')

router.get('/login', async (req,res)=>{
    res.render('login',{
        title: 'Login',
        layout: 'layout'
    })
})

router.get('/register', async (req,res)=>{
    // const user = await User()
    res.render('register',{
        title: 'Register',
        layout: 'layout'
    })
})

router.post('/login', async (req,res)=>{
    const {phone, password} = req.body

    req.session.isAdmin = false
    req.session.adm = false
    
    const user = await User.findOne({phone})
    console.log(user);
    
    if(!user){
        return res.send('Phone number not found')
    }

    const compare = await bcrypt.compare(password, user.password)

    if(!compare){
        return res.send('Password is not true')
    }

    const users = await User.find()

    if(users.length === 1) {
        users[0].admin = true
        req.session.adm = true
    } else {
        req.session.adm = false
    }

    req.session.isAdmin = true
    req.session.admin = user

    console.log(users, 'users');
    res.redirect('/')
})

router.post('/register', async(req, res)=>{
    const {name, phone, image, password} = req.body

    const hasPhone = await User.findOne({phone})

    if(hasPhone){
       return res.send('This phone number is busy')
    }

    const hash = await bcrypt.hash(password, 10)

    const user = new Auth({name, phone, image, password: hash})

    await user.save()

    res.redirect('/auth/login')
})

router.get('/logout', (req,res)=>{
    req.session.isAdmin = false
    res.redirect('/auth/login')
})

module.exports = router



