const connection = require("./db.js")

class queryUser {
    getAllUsers() {
        return new Promise((resolve, reject) => {
            connection.query(
                "select * from users",
                (err, results) => {
                    resolve(results)
                    reject(err)
                }
            )
		})
    }

    getUser(value) {
        return new Promise((resolve, reject) => {
            connection.query(
                "select * from users where registration = ?",
                value,
                (err, results) => {
                    resolve(results)
                    reject(err)
                }
            )
		})
    }
}

module.exports = new queryUser()