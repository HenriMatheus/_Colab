const queryComponents = require("../models/queryComponents.js")
const queryLoan = require("../models/queryLoan.js")

class componentsControll {
  async listComponents(req, res) {
    const registration = req.params.registration

    try {
      const components = await queryComponents.getAllComponents()
      const specs = await queryComponents.getAllSpec()
      const loans = await queryLoan.getLoan(registration)

      let arrayComponents = []
      let arraySpecs = []

      for (let i in components) {
        components[i].specification = []
        arrayComponents.push(components[i])
      }

      for (let i in specs) {
        arraySpecs.push(specs[i])
      }

      for (let component of arrayComponents) {
        for (let spec of arraySpecs) {
          if (component.id === spec.component_id) {
            component.specification.push({power: spec.specification, amount: spec.amount_components})
          }
        }
      }

      for (let component in arrayComponents) {
        if (arrayComponents[component].specification.length === 0) {
          await queryComponents.deleteComponent(arrayComponents[component].id)
        }
      }

      res.render("home", {
        components: arrayComponents, 
        user: registration,
        myLoans: loans   
      })
    } catch(err) {
      console.error(err)
    }
  }

  async searchComponent(req, res) {
    const componentName = req.body.componentName
    const registration = req.body.registration
    let valueToLowerCase = componentName.toLowerCase()
    let nameComponent = valueToLowerCase[0].toUpperCase() + valueToLowerCase.substring(1)
    
    try {
      const components = await queryComponents.getComponent(nameComponent)
      const specs = await queryComponents.getAllSpec()
      const loans = await queryLoan.getLoan(registration)

      let arrayComponents = []
      let arraySpecs = []

      for (let i in components) {
        components[i].specification = []
        arrayComponents.push(components[i])
      }

      for (let i in specs) {
        arraySpecs.push(specs[i])
      }

      for (let component of arrayComponents) {
        for (let spec of arraySpecs) {
          if (component.id === spec.component_id) {
            component.specification.push({power: spec.specification, amount: spec.amount_components})
          }
        }
      }

      res.render("home", {
        components: arrayComponents, 
        user: registration,
        myLoans: loans   
      })
    } catch(err) {
      console.error(err)
    }
  }

  async newComponent(req, res) {
    const values = [req.body.component, req.body.spec, req.body.amount]

    try {
      const component  = await queryComponents.getComponent(values[0])
    
      if (component.length > 0) {
        await queryComponents.addSpec(component[0].id, values[1], values[2])
      } else {
        await queryComponents.addComponent(values[0])
        const searchNewComponent  = await queryComponents.getComponent(values[0])
        await queryComponents.addSpec(searchNewComponent[0].id, values[1], values[2])
      }

      req.flash("newComponent", "Nova adição feita com sucesso!")
    } catch {
      console.error(err)
    }

    res.redirect("/addComponent")
  }
  
  async updatingComponent(req, res) {
    const values = [req.body.component, req.body.spec, req.body.newComponent, req.body.newSpec, req.body.newAmount]

    try {
      const valueToLowerCase = values[0].toLowerCase()
      const nameComponents = valueToLowerCase[0].toUpperCase() + valueToLowerCase.substring(1)
      const component  = await queryComponents.getComponent(nameComponents)
      const spec = await queryComponents.getSpec(values[1])

      if (component.length > 0 && spec.length > 0) {
        await queryComponents.updateComponent(values[2], component.id)
        await queryComponents.updateSpec(values[3], values[4], spec[0].id)

        req.flash("updateComponent", "Componente atualizado")
      } else {
        req.flash("updateComponent", "Falha ao atualizar componente. Revise os dados passados.")
      }
    } catch(err) {
      console.error(err)
    }

    res.redirect("/updateComponent")
  }

  async deleteComponents(req, res) {
    const values = [req.body.component, req.body.spec]

    try {
      const valueToLowerCase = values[0].toLowerCase()
      const nameComponents = valueToLowerCase[0].toUpperCase() + valueToLowerCase.substring(1)
      const component  = await queryComponents.getComponent(nameComponents)
      const spec = await queryComponents.getSpec(values[1])

      if (component.length > 0 && spec.length > 0) {
        await queryComponents.deleteSpec(spec[0].id)

        res.render("dellComponent", {flash: "Componente removido"})
      } else {
        res.render("dellComponent", {flash: "Erro ao deletar o componente. Revise as credenciais"})
      }
    } catch(err) {
      console.error(err)
    }
  }
}

module.exports = new componentsControll()