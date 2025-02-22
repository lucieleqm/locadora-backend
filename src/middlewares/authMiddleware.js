const { clerkClient } = require('@clerk/express');

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ error: "Não autenticado"})
    }

    const user = await clerkClient.users.getUser(req.auth.userId);

    if(user.publicMetadata?.role !== 'admin') {
      return res.status(403).json({ error: "Acessso Negado"})
    }

    req.user = {
      id: user.id,
      role: user.publicMetadata.role,
      email: user.emailAddresses[0].emailAddress
    }; // Para evitar míltiplas chamadas ao Clerk

    next() // Passa o controle para o próximo middleware/rota na cadeia
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware;