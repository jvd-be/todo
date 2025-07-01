const Validations = {
  firstName: {
    required: { message: 'This field is required.' },
    min: {
      value: 4,
      message: 'The number of characters should not be less than 4.'
    }
  },
  lastName: {
    required: { message: 'This field is required.' },
    min: {
      value: 4,
      message: 'The number of characters should not be less than 4.'
    }
  },
  userName: {
    required: { message: 'This field is required.' },
    min: {
      value: 4,
      message: 'The number of characters should not be less than 4.'
    }
  },
  email: {
    required: { message: 'This field is required.' },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.'
    }
  },
  password: {
    required: { message: 'This field is required.' },
    min: { value: 8 },
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message:
        'Please enter a valid password that is 8 characters long and contains at least one letter and one number. '
    }
  }
}


export default Validations