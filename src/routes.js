const router = require("express").Router()
const usersControll = require("./controller/usercontroller.js")
const componentsControll = require("./controller/componentsController.js")
const loanController = require("./controller/loanController.js")

function autenticate(req, res, next) {
    req.session.use ? next() : res.send("Sessão não autorizada!")
}

router.get("/", (req, res) => res.render("login", {flash: req.flash("loginError")}))
router.post("/login", usersControll.login)
router.get("/home/:registration", autenticate, componentsControll.listComponents)
router.post("/searchComponent/:registration", autenticate, componentsControll.searchComponent)
router.get("/loans", autenticate, loanController.getLoans)
router.post("/searchLoans", autenticate, loanController.getLoansByRegistration)
router.post("/requestComponents", autenticate, loanController.applyForLoan)
router.post("/confirmReturns", autenticate, loanController.confirmReturn)
router.get("/addComponent", autenticate,(req, res) => res.render("addComponent", {flash: req.flash("newComponent")}))
router.get("/updateComponent", autenticate,(req, res) => res.render("updateComponent", {flash: req.flash("updateComponent")}))
router.get("/dellComponent", autenticate,(req, res) => res.render("dellComponent", {flash: ""}))
router.post("/addComponent/newComponent", autenticate, componentsControll.newComponent)
router.post("/updateComponent/newUpdate", autenticate, componentsControll.updatingComponent)
router.post("/dellComponent/removeComponent", autenticate, componentsControll.deleteComponents)

module.exports = router