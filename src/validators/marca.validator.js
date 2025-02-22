const Joi = require('joi');

const marcaSchema = Joi.object({
    id_tipo_veiculo: Joi.required().messages({
        'any.required': 'O campo "id_tipo_veiculo" é obrigatório.'
    }),
    nome: Joi.string().required().messages({
        'string.empty': 'O campo "nome"" não pode estar vazio.',
        'any.required': 'O campo "nome" é obrigatório.'
    })
})

module.exports = { marcaSchema };
