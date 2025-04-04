import Joi from 'joi';

export const gameSchema = Joi.object({
    title: Joi.string().pattern(/^[A-Za-z0-9&' ]{1,50}$/).required(),
    description: Joi.string().max(200).required(),
    developer: Joi.string().pattern(/^[A-Za-z0-9&' ]{1,100}$/).required(),
    publisher: Joi.string().pattern(/^[A-Za-z0-9&' ]{1,100}$/).required(),
    genre: Joi.string().regex(/^[A-Za-z0-9&' ]{1,40}$/).required(),
    sub_genres: Joi.array().items(Joi.string().pattern(/^[A-Za-z0-9& ]+$/)).required(),
    pegi: Joi.number().valid(3, 7, 12, 16, 18).required(),
    sensitive_content: Joi.array().items(Joi.string().valid('Violence', 'Sexual Content', 'Drugs', 'Gambling', 'Bad Language')),
    release_date: Joi.date().iso().required(),
    price: Joi.alternatives().try(
        Joi.number().min(0),
        Joi.string().pattern(/^\d+(\.\d{1,2})?€?$/).custom((value, helpers) => {
          const numericValue = parseFloat(value.replace('€', ''));
          if (isNaN(numericValue)) {
            return helpers.error('any.invalid');
          }
          return numericValue; // Retourne le prix en tant que nombre
        })
    ).required(),
    stock: Joi.number().integer().min(0).required()
});
