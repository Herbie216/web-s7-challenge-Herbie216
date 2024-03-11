import React, { useEffect, useState } from 'react';
import * as yup from 'yup';

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L',
};

const validationSchema = yup.object().shape({
  fullName: yup
    .string().trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required(),
  size: yup
    .string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required(),
});

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {

  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });
  const [validationErrors, setValidationErrors] = useState({
    fullName: null,
    size: null,
  });
  const [isEnabled, setEnabled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState();

  useEffect(() => {
    validationSchema.isValid(formData).then((isValid) => {
      setEnabled(isValid);
    });
  }, [formData]);

  const handleTextInputChange = async (e) => {
    const { name, value } = e.target;
    yup
      .reach(validationSchema, name)
      .validate(value)
      .then(() => {
        setValidationErrors({ ...validationErrors, [name]: "" });
      })
      .catch((err) => {
        setValidationErrors({ ...validationErrors, [name]: err.errors[0] });
      });
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
        ? [...prevData[name], value]
        : prevData[name].filter((item) => item !== value),
    }));
  };

  const getSizeDisplayName = (size) => {
    const sizeMappings = {
      S: 'Small',
      M: 'Medium',
      L: 'Large',
    };
    return sizeMappings[size] || size;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitted(true);
      setIsSubmitSuccess(true);
      setSubmittedData({
        fullName: formData.fullName,
        size: formData.size,
        toppings: [...formData.toppings],
      });
      setFormData({
        fullName: '',
        size: '',
        toppings: [],
      });
    } catch (error) {
      setIsSubmitted(true);
      setIsSubmitSuccess(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {isSubmitted && isSubmitSuccess && (
        <div className='success'>
          Thank you for your order, {submittedData.fullName}! Your{' '}
          {getSizeDisplayName(submittedData.size)} pizza
          {submittedData.toppings.length === 0
            ? ' with no toppings'
            : submittedData.toppings.length === 1
              ? ` with 1 topping`
              : ` with ${submittedData.toppings.length} toppings`} is on the way.
        </div>
      )}
      <div className='input-group'>
        <div>
          <label htmlFor='fullName'>Full Name</label>
          <br />
          <input
            placeholder='Type full name'
            id='fullName'
            name='fullName'
            type='text'
            value={formData.fullName}
            onChange={handleTextInputChange}
          />
        </div>

        {validationErrors.fullName !== null && <div className='error'>{validationErrors.fullName}</div>}
      </div>
      <div className='input-group'>
        <div>
          <label htmlFor='size'>Size</label>
          <br />
          <select id='size' name='size' value={formData.size} onChange={handleTextInputChange}>
            <option value=''>----Choose Size----</option>
            <option value='S'>Small</option>
            <option value='M'>Medium</option>
            <option value='L'>Large</option>
          </select>
        </div>

        {validationErrors.size !== null && <div className='error'>{validationErrors.size}</div>}
      </div>

      <div className='input-group'>
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name='toppings'
              type='checkbox'
              value={topping.text}
              checked={formData.toppings.includes(topping.text)}
              onChange={handleCheckboxChange}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>
      <input type='submit' disabled={!isEnabled} />
      {isSubmitted && !isSubmitSuccess && (
        <div className='error'>
          There was an issue submitting your order. Please try again later.
        </div>
      )}
    </form>
  );
}