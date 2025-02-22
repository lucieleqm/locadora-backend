const Joi = require('joi');

const modeloSchema = Joi.object({
    id_marca: Joi.required().messages({
        'any.required': 'O campo "id_marca" é obrigatório.'
    }),
    nome: Joi.string().required().messages({
        'string.empty': 'O campo "nome"" não pode estar vazio.',
        'any.required': 'O campo "nome" é obrigatório.'
    })
})

module.exports = { modeloSchema };
