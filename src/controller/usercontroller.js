const queryUser = require("../models/queryUser.js")

class usersControll {
    async login(req, res) {
        const registration = req.body.registration

        if (registration.trim().length >= 10 && registration.trim().length <= 14) {
            req.session.use = registration
            
            try {
                const users = await queryUser.getUser(registration)
                registration.length === 14 ? res.redirect(`/home/${registration}`) : res.redirect("/loans")
            } catch (err) {
                console.error(err)
            }
            
        } else {
            req.flash("loginError", "Erro na matricula")
            res.redirect("/")
        }
    }
}

module.exports = new usersControll()