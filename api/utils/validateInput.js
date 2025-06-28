const validateInput = (fields) => {
  const errors = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(fields)) {
    const value = rules.value;
    const fieldErrors = [];

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push(`${fieldName} is required`);
      isValid = false;
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
      continue;
    }

    // Type validation
    if (rules.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        fieldErrors.push(`${fieldName} must be a valid email address`);
        isValid = false;
      }
    }

    if (rules.type === 'number') {
      if (isNaN(value) || isNaN(parseFloat(value))) {
        fieldErrors.push(`${fieldName} must be a valid number`);
        isValid = false;
      }
    }

    if (rules.type === 'boolean') {
      if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
        fieldErrors.push(`${fieldName} must be a boolean value`);
        isValid = false;
      }
    }

    // Length validations
    if (rules.minLength && value.toString().length < rules.minLength) {
      fieldErrors.push(`${fieldName} must be at least ${rules.minLength} characters long`);
      isValid = false;
    }

    if (rules.maxLength && value.toString().length > rules.maxLength) {
      fieldErrors.push(`${fieldName} cannot exceed ${rules.maxLength} characters`);
      isValid = false;
    }

    // Value range validations
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
      fieldErrors.push(`${fieldName} must be at least ${rules.min}`);
      isValid = false;
    }

    if (rules.max !== undefined && parseFloat(value) > rules.max) {
      fieldErrors.push(`${fieldName} cannot exceed ${rules.max}`);
      isValid = false;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push(`${fieldName} format is invalid`);
      isValid = false;
    }

    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(value);
      if (customResult !== true) {
        fieldErrors.push(customResult || `${fieldName} is invalid`);
        isValid = false;
      }
    }

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  }

  return {
    isValid,
    errors
  };
};

module.exports = validateInput; 