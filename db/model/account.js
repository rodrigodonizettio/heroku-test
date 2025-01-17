import mongoose from 'mongoose'

const ACCOUNTS_COLLECTION = 'accounts'
const ACCOUNT = 'account'

const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true
  },
  conta: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true,
    validate(balance) {
      if(balance < 0) throw new Error('Balance cannot be < 0')
    }
  }
})

const accountModel = mongoose.model(ACCOUNT, accountSchema, ACCOUNTS_COLLECTION)

export { accountModel }