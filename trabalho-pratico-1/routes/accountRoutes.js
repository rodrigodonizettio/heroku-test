import express from 'express'
import { accountModel } from '../db/model/account.js'

const router = express()

router.patch('/account/:conta', async (req, res) => {
  try {
    const account = await accountModel.findOne({conta: req.params.conta})
    if(account) {
      if(account.balance + req.body.depositwitdraw < 0) {
        res.status(501).send('PATCH /account Fail! Balance cannot be < 0!' + error)
      } else {
        const newAccount = await accountModel.findOneAndUpdate({conta: req.params.conta}, {$inc: {balance: req.body.depositwitdraw}}, {new: true})
        if(!newAccount)
          res.status(404).send(`Account number ${req.params.conta} was not found!`)
        else {
          res.status(200).send(newAccount)
          console.log('PATCH /account/:conta Success!')
        }
      }
    } else {
      res.status(404).send(`Account number ${req.params.conta} was not found!`)
    }
  } catch (error) {
    res.status(501).send('PATCH /account Fail! ' + error)
  }
})

router.patch('/account/transfer/:contaorigem/:contadestino', async (req, res) => {
  try {
    const accountOrigem = await accountModel.findOne({conta: req.params.contaorigem})
    const accountDestino = await accountModel.findOne({conta: req.params.contadestino})
    let taxaTransferencia = 0
    if(accountOrigem && accountDestino) {
      if(accountOrigem.agencia !== accountDestino.agencia) {
        taxaTransferencia = 8
      }
      if(accountOrigem.balance + ((req.body.transfer*-1) + (taxaTransferencia*-1)) < 0) {
        res.status(501).send('PATCH /account Fail! Balance cannot be < 0!' + error)
      } else {
        const newAccountDestino = await accountModel.findOneAndUpdate({conta: req.params.contadestino}, {$inc: {balance: req.body.transfer}}, {new: true})
        console.log('Conta Destino')
        console.log(newAccountDestino)
        const newAccountOrigem = await accountModel.findOneAndUpdate({conta: req.params.contaorigem}, {$inc: {balance: ((req.body.transfer*-1) + (taxaTransferencia*-1))}}, {new: true})
        res.status(200).send(newAccountOrigem)
        console.log('PATCH /account/:contaorigem/:contadestino Success!')
      }
    }
    else {
      res.status(404).send(`Account number ${req.params.conta} was not found!`)
    }
  } catch (error) {
    res.status(501).send('PATCH /account Fail! ' + error)
  }
})

router.patch('/account/private/transfer', async (req, res) => {
  try {
    const mostRichAgencia10 = await accountModel.findOneAndUpdate({agencia: 10},{agencia: 99}, {new: true}).sort({balance: -1})
    const mostRichAgencia25 = await accountModel.findOneAndUpdate({agencia: 25},{agencia: 99}, {new: true}).sort({balance: -1})
    const mostRichAgencia47 = await accountModel.findOneAndUpdate({agencia: 47},{agencia: 99}, {new: true}).sort({balance: -1})
    const mostRichAgencia33 = await accountModel.findOneAndUpdate({agencia: 33},{agencia: 99}, {new: true}).sort({balance: -1})
    console.log('Agencia 10 - Most Rich')
    console.log(mostRichAgencia10)
    console.log('Agencia 25 - Most Rich')
    console.log(mostRichAgencia25)
    console.log('Agencia 47 - Most Rich')
    console.log(mostRichAgencia47)
    console.log('Agencia 33 - Most Rich')
    console.log(mostRichAgencia33)

    const privateAccounts = await accountModel.find({agencia: 99})
    res.status(200).send(privateAccounts)
  } catch (error) {
    res.status(501).send('PATCH /account Fail! ' + error)
  }
})

router.get('/account/:conta', async (req, res) => {
  try {
    const account = await accountModel.findOne({conta: req.params.conta})
    if(!account) {
      res.status(404).send(`Account number ${req.params.conta} was not found!`)
    } else {
      res.status(200).send(account)
    }
  } catch (error) {
    res.status(501).send('PATCH /account Fail! ' + error)
  }
})

router.get('/account/average/:agencia', async (req, res) => {
  try {
    const average = await accountModel.aggregate([{$match: {agencia: parseInt(req.params.agencia)}}, {$group: {_id: null, avg: {$avg: "$balance"}}}])
    if(!average) {
      res.status(404).send(`Agencia number ${req.params.agencia} was not found!`)
    } else {
      console.log(average)
      res.status(200).send(average)
    }
  } catch (error) {
    res.status(501).send('GET /account/average/:agencia Fail! ' + error)
  }
})

router.get('/account/lowestbalance/:number', async (req, res) => {
  try {
    const accounts = await accountModel.find({},{_id:0}).sort({balance: 1}).limit(parseInt(req.params.number))
    if(!accounts) {
      res.status(404).send(`Accounts were not found!`)
    } else {
      console.log(accounts)
      res.status(200).send(accounts)
    }
  } catch (error) {
    res.status(501).send('GET /account/lowestbalance/:number Fail! ' + error)
  }
})

router.get('/account/highestbalance/:number', async (req, res) => {
  try {
    const accounts = await accountModel.find({},{_id:0}).sort({balance: -1, name: 1}).limit(parseInt(req.params.number))
    if(!accounts) {
      res.status(404).send(`Accounts were not found!`)
    } else {
      console.log(accounts)
      res.status(200).send(accounts)
    }
  } catch (error) {
    res.status(501).send('GET /account/lowestbalance/:number Fail! ' + error)
  }
})

router.delete('/account/:agencia/:conta', async (req, res) => {
  try {
    const account = await accountModel.findOneAndDelete({$and: [{agencia: req.params.agencia}, {conta: req.params.conta}]})
    if(!account)
      res.status(404).send(`Account number ${req.params.conta} was not found!`)
    else {
      const accountsSameAgencia = await accountModel.countDocuments({agencia: req.params.agencia})
      console.log(accountsSameAgencia)
      res.status(200).send(accountsSameAgencia)
      console.log('DELETE /account/:agencia/:conta Success!')
    }
  } catch (error) {
    res.status(501).send('DELETE /account Fail! ' + error)
  }
})

// router.post('/student', async (req, res) => {
//   try {
//     const student = new studentModel(req.body)
//     await student.save()
//     res.status(201).send(student)
//     console.log('POST /student Success!')
//   } catch (error) {
//     res.status(501).send('POST /student Fail! ' + error)
//   }
// })

// router.get('/students', async (_, res) => {
//   try {
//     const students = await studentModel.find({})
//     console.log('GET /students Success!')
//     res.status(200).send(students)
//   } catch (error) {
//     res.status(501).send('GET /students Fail! ' + error)
//   }
// })

export { router }