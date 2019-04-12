import Joi from 'joi';

const name = Joi.string()
  .min(5)
  .max(50)
  .required();
const email = Joi.string()
  .min(5)
  .max(255)
  .email()
  .required();
const password = Joi.string()
  .min(5)
  .max(20)
  .required()
  .strict();
const type = Joi.string()
  .valid('staff')
  .optional();
const confirmPassword = Joi.any()
  .valid(Joi.ref('password'))
  .required().options({ language: { any: { allowOnly: 'must match password' } } });
const status = Joi.string()
  .valid('active', 'dormant')
  .required();
const amount = Joi.number()
  .required();


// Schema for Sign Up
const signUpScheama = {
  firstName: name,
  lastName: name,
  email,
  password,
  type,
  confirmPassword
};

// Schema for Login
const logInSchema = {
  email,
  password
};

// Schema for Bank Account Registration [TYPE = Account Type]
const accountRegSchema = {
  type: name
};

// Schema for Account Status Update
const updateStatusSchema = {
  status
};

// Schema to debit/credit account
const debitCreditSchema = {
  amount
};

// Input Validation Function
const validate = (schema) => {
  const validateInput = (req, res, next) => {
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.details[0].message
      });
    }
    return next();
  };
  return validateInput;
};

export default {
  signUp: validate(signUpScheama),
  logIn: validate(logInSchema),
  accountReg: validate(accountRegSchema),
  updateStatus: validate(updateStatusSchema),
  updateAccount: validate(debitCreditSchema)
};
