import Joi from 'joi';

export const validateSchema = (data: any, schema: Joi.ObjectSchema) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new Error(`Validation failed: ${error.details.map(d => d.message).join(', ')}`);
  }
  return value; // Retourne les données validées
};