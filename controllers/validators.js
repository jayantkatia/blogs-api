const {body, validationResult, check} = require('express-validator')

exports.emailValidator = (fieldName) => body(fieldName)
  .isEmail({domain_specific_validation: true, allow_ip_domain: false})
  .withMessage('email is not of corrrect format')

exports.passwordValidator= (fieldName) => body(fieldName)
  .isStrongPassword({minLength: 8,minLowercase: 1,minNumbers: 1,minUppercase: 1,minSymbols: 1})
  .withMessage('password must contain atleast 1 lowercase, uppercase, digit and special symbol each');

exports.stringValidator= (fieldName, chars) => body(fieldName)
  .isString()
  .withMessage('not a valid string')
  .isLength({min: chars})
  .withMessage(`must be atleast ${chars} chars`);

exports.checkSpaces = (fieldName) => check(fieldName)
  .custom(value => !/\s/.test(value))
  .withMessage('No spaces are allowed in username')

exports.areFieldsValidated=(req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    next();
}