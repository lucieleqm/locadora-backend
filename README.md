# Locadora de Veículos - Backend
Este é o backend de um sistema de locadora de veículos, desenvolvido em Node.js com Express e Sequelize. Ele fornece uma API RESTful para gerenciar veículos, clientes e locações.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para construção de APIs.
- **Sequelize**: ORM para banco de dados MySQL.
- **MySQL2**: Driver para conexão com o banco de dados MySQL.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

### Autenticação
- **@clerk/express**: Integração com Clerk para autenticação de usuários.

## Como Rodar o Servidor

Siga os passos abaixo para configurar e executar o servidor localmente.

1. Faça uma cópia do arquivo `.env.example` e renomeie para `.env`.
2. Preencha as variáveis de ambiente com os valores corretos.
3. Execute as Migrations `npx sequelize-cli db:migrate`
4. Inicie o Servidor `npm start`