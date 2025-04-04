import Joi from 'joi';

// Validation des attributs d'un utilisateur Customer
export const customerValidationSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).required().pattern(/^[a-zA-Z\s]+$/).messages({
        'string.pattern.base': '"first_name" doit contenir uniquement des lettres et des espaces.',
        'string.min': '"first_name" doit comporter au moins 2 caractères.',
        'string.max': '"first_name" doit comporter au maximum 100 caractères.',
    }),
    last_name: Joi.string().min(2).max(100).required().pattern(/^[a-zA-Z\s]+$/).messages({
        'string.pattern.base': '"last_name" doit contenir uniquement des lettres et des espaces.',
        'string.min': '"last_name" doit comporter au moins 2 caractères.',
        'string.max': '"last_name" doit comporter au maximum 100 caractères.',
    }),
    email: Joi.string().email().required().messages({
        'string.email': '"email" doit être une adresse email valide.',
    }),
    phone: Joi.string().min(10).max(15).required().pattern(/^[0-9]+$/).messages({
        'string.pattern.base': '"phone" doit contenir uniquement des chiffres.',
        'string.min': '"phone" doit comporter au moins 10 caractères.',
        'string.max': '"phone" doit comporter au maximum 15 caractères.',
    }),
    adress: Joi.string().min(10).max(255).required().messages({
        'string.min': '"adress" doit comporter au moins 10 caractères.',
        'string.max': '"adress" doit comporter au maximum 255 caractères.',
    }),
    password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
        'string.pattern.base': '"hashedpassword" doit comporter au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
        'string.min': '"hashedpassword" doit comporter au moins 8 caractères.',
    }),
    order_history: Joi.array().items(Joi.number().integer()).optional()
});

export const customerLoginValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': '"email" doit être une adresse email valide.',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': '"password" doit comporter au moins 8 caractères.',
    })
});



export const staffValidationSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).required().pattern(/^[a-zA-Z\s]+$/).messages({
        'string.pattern.base': '"first_name" doit contenir uniquement des lettres et des espaces.',
        'string.min': '"first_name" doit comporter au moins 2 caractères.',
        'string.max': '"first_name" doit comporter au maximum 100 caractères.',
    }),
    last_name: Joi.string().min(2).max(100).required().pattern(/^[a-zA-Z\s]+$/).messages({
        'string.pattern.base': '"last_name" doit contenir uniquement des lettres et des espaces.',
        'string.min': '"last_name" doit comporter au moins 2 caractères.',
        'string.max': '"last_name" doit comporter au maximum 100 caractères.',
    }),
    email: Joi.string().email().required().messages({
        'string.email': '"email" doit être une adresse email valide.',
    }),
    password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
        'string.pattern.base': '"hashedpassword" doit comporter au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
        'string.min': '"hashedpassword" doit comporter au moins 8 caractères.',
    }),
});

export const staffLoginValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': '"email" doit être une adresse email valide.',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': '"password" doit comporter au moins 8 caractères.',
    })
});