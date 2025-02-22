const Joi = require('joi');

const corSchema = Joi.object({
    nome: Joi.string().required().messages({
        'string.empty': 'O campo "nome"" não pode estar vazio.',
        'any.required': 'O campo "nome" é obrigatório.'
    })
})

module.exports = {corSchema };