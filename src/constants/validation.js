const uncEmailValidator = (rule, value, callback) => {
  try {
    if (!(value.endsWith('@live.unc.edu') || value.endsWith('@email.unc.edu'))) {
      throw new Error('Email must be a registered UNC email!');
    }
  } catch (err) {
    callback(err);
  }
  callback();
};

export const PASSWORD_VALIDATION_RULES = {
  required: true,
  message: 'Please enter a valid Password!',
  min: 8,
  whitespace: true,
};

export const EMAIL_VALIDATION_RULES = {
  required: true,
  type: 'email',
  message: 'Please enter a valid UNC email!',
  min: 14,
  whitespace: true,
  validator: uncEmailValidator,
};
