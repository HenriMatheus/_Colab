const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path")
const routes = require("./routes.js")

app.use(session({
    secret: "YQkz4Z708Z3c6E65L8KcaYIuJ81r6aj6",
    resave: false,
    saveUninitialized: false
}))

require("dotenv").config()
app.use(flash())
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(routes)

app.listen(process.env.PORT, () => {
    console.log(`localhost:${process.env.PORT}`)
})