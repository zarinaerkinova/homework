module.exports.auth = (req, res, next) => {
  const admin = req.session.isAdmin
  const Admin = req.session.adm

  if (!admin) {
    res.redirect('/auth/login')
  }

  next()
}