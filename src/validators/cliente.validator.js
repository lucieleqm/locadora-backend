const Joi = require('joi');
const { cpf } = require('cpf-cnpj-validator');

const customMessages = {
  'any.required': 'O campo {#label} é obrigatório',
  'string.empty': 'O campo {#label} não pode estar vazio',
  'string.pattern.base': 'Formato de {#label} inválido'
};

const clienteSchema = Joi.object({
  nome: Joi.string()
    .min(3)
    .max(150)
    .required()
    .pattern(/^[\p{L} '\-]+$/u)
    .messages({
      ...customMessages,
      'string.min': 'O nome deve ter pelo menos 3 caracteres',
      'string.max': 'O nome deve ter no máximo 150 caracteres',
      'string.pattern.base': 'O nome contém caracteres inválidos'
    }),

  estado_civil: Joi.string()
    //.valid('solteiro', 'casado', 'divorciado', 'viúvo', 'separado')
    .messages({
      ...customMessages,
      'any.only': 'Estado civil inválido'
    }),

  profissao: Joi.string()
    .max(150)
    .allow('', null)
    .messages({
      'string.max': 'A profissão deve ter no máximo 150 caracteres'
    }),

  rg: Joi.string()
    //.pattern(/^\d{2}\.\d{3}\.\d{3}-[0-9A-Za-z]$/)
    .required()
    .messages({
      ...customMessages,
      'string.pattern.base': 'Formato de RG inválido (XX.XXX.XXX-X)'
    }),

  cpf: Joi.string()
    /*.custom((value, helpers) => {
      const cleanedCPF = value.replace(/\D/g, '');
      
      if (!cpf.isValid(cleanedCPF)) {
        return helpers.error('any.invalid');
      }
      
      return value;
    }, 'Validação de CPF')*/
    .required()
    //.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .messages({
      ...customMessages,
      'any.invalid': 'CPF inválido',
      'string.pattern.base': 'Formato de CPF inválido (XXX.XXX.XXX-XX)'
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(150)
    .allow('', null)
    .messages({
      'string.email': 'E-mail inválido',
      'string.max': 'O e-mail deve ter no máximo 150 caracteres'
    }),

  telefone1: Joi.string()
    //.pattern(/^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/)
    .required()
    .messages({
      ...customMessages,
      'string.pattern.base': 'Formato de telefone inválido (XX) XXXX-XXXX'
    }),

  telefone2: Joi.string()
    .pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Formato de telefone inválido (XX) XXXX-XXXX'
    }),

  endereco: Joi.object({
    // Adicione aqui o schema do endereço se necessário
  }).optional()
})
.options({
  abortEarly: false,
  stripUnknown: true
});

// Schema para atualização (tudo opcional mas mantendo as validações)
const atualizarClienteSchema = clienteSchema.fork(
  ['nome', 'rg', 'cpf', 'telefone1'],
  schema => schema.optional()
);

module.exports = {
  criarClienteSchema: clienteSchema,
  atualizarClienteSchema
};