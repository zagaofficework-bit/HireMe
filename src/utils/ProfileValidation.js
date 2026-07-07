// profile/utils/profileValidation.js
//
// Client-side validation matching the Joi schemas on the backend.
// Returns { valid: true } or { valid: false, errors: { field: message } }

export const validateBasic = ({ fullName, age, bio }) => {
  const errors = {};

  if (!fullName || fullName.trim().length < 2)
    errors.fullName = 'Full name must be at least 2 characters.';
  else if (fullName.trim().length > 100)
    errors.fullName = 'Full name must be under 100 characters.';

  if (age !== '' && age !== undefined && age !== null) {
    const n = Number(age);
    if (isNaN(n) || n < 16 || n > 80)
      errors.age = 'Age must be between 16 and 80.';
  }

  if (bio && bio.length > 1000)
    errors.bio = 'Bio must be under 1000 characters.';

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateLocation = ({ country, state, city }) => {
  const errors = {};

  if (!city?.trim() && !country?.trim())
    errors.city = 'Enter at least a city or country.';

  if (city && city.trim().length > 100)
    errors.city = 'City name is too long.';
  if (state && state.trim().length > 100)
    errors.state = 'State name is too long.';
  if (country && country.trim().length > 100)
    errors.country = 'Country name is too long.';

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateContact = ({ email, phone }) => {
  const errors = {};

  if (email && email.trim()) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim()))
      errors.email = 'Enter a valid email address.';
  }

  if (phone && phone.trim()) {
    const phoneRe = /^\+?[1-9]\d{7,14}$/;
    if (!phoneRe.test(phone.replace(/\s/g, '')))
      errors.phone = 'Enter a valid phone number (e.g. +919876543210).';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validatePreferences = ({
  workType,
  jobType,
  availability,
  expectedSalary,
  hourlyRate,
}) => {
  const errors = {};

  const VALID_WORK  = ['remote', 'onsite', 'hybrid'];
  const VALID_JOB   = ['fulltime', 'parttime', 'freelance', 'internship'];
  const VALID_AVAIL = ['immediate', 'one_week', 'two_weeks', 'one_month', 'not_available'];

  // ── Required ────────────────────────────────────────────────────────────────
  // workType gates the whole section — without it the profile won't count as
  // "preferences complete" in getSectionCompletion, so it must be present.
  if (!workType) {
    errors.workType = 'Work type is required.';
  } else if (!VALID_WORK.includes(workType)) {
    errors.workType = 'Invalid work type.';
  }

  // ── Optional but validated when provided ────────────────────────────────────
  if (jobType && !VALID_JOB.includes(jobType))
    errors.jobType = 'Invalid job type.';

  if (availability && !VALID_AVAIL.includes(availability))
    errors.availability = 'Invalid availability.';

  const minSal = expectedSalary?.min !== '' ? Number(expectedSalary?.min) : NaN;
  const maxSal = expectedSalary?.max !== '' ? Number(expectedSalary?.max) : NaN;

  if (expectedSalary?.min !== '' && expectedSalary?.min != null && isNaN(minSal))
    errors.salaryMin = 'Min salary must be a number.';
  if (expectedSalary?.max !== '' && expectedSalary?.max != null && isNaN(maxSal))
    errors.salaryMax = 'Max salary must be a number.';
  if (!isNaN(minSal) && !isNaN(maxSal) && minSal > 0 && maxSal > 0 && minSal > maxSal)
    errors.salaryMin = 'Min salary cannot be greater than max.';

  if (hourlyRate?.amount !== '' && hourlyRate?.amount != null) {
    const rate = Number(hourlyRate.amount);
    if (isNaN(rate) || rate < 0)
      errors.hourlyRate = 'Hourly rate must be a positive number.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};