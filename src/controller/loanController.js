const queryLoan = require("../models/queryLoan.js")
const queryComponents = require("../models/queryComponents.js")

class loanController {
    async getLoans(req, res) {
        try {
            const allLoans = await queryLoan.getAllLoans()
            res.render("loanManagers", {loans: allLoans})
        } catch(err) {
            console.error(err)
        }
    }

    async getLoansByRegistration(req, res) {
        const registration = req.body.registration
        try {
            const loans = await queryLoan.getLoan(registration)
            res.render("loanManagers", {loans: loans})
        } catch(err) {
            console.error(err)
        }
    }
    
    async applyForLoan(req, res) {
        const values = req.body

        for (let i in values) {
            try {
                const specs = await queryComponents.getSpec(values[i].spec)

                if (specs && values[i].amount <= specs[0].amount_components) {
                    queryLoan.addLoan(
                        values[i].registration, 
                        values[i].component, 
                        values[i].spec, 
                        values[i].amount
                    )
                    
                    queryComponents.updateSpec(
                        specs[0].specification, 
                        parseInt(specs[0].amount_components) - values[i].amount,
                        specs[0].id
                    )
                }
            } catch(err) {
                console.error(err)
            }
        }

        res.json({message: "Dados recebidos com sucesso"})
    }

    async confirmReturn(req, res) {
        const ids = req.body

        try {
            for (let i in ids) {
                await queryLoan.dellLoan(Number(ids[i]))
            }
        } catch(err) {
            console.error(err)
        }
        
        res.json({message: "Devolução confirmada"})
    }
}

module.exports = new loanController()