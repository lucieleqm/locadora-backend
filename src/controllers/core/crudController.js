const asyncHandler = require('../middlewares/asyncHandler');

// Operações comuns para entidades simples (ex: cor)
module.exports = (Model) => ({
    // Criar
    create: async (req, res, next) => {
        try {
            const data = await Model.create(req.body);
            res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    },
    // Listar todos
    getAll: async (req, res) => {
        const data = await Model.findAll();
        res.json(data);
    },
    // Buscar por ID
    getById: async (req, res) => {
        const data = await Model.findByPk(req.params.id);
        if (!data) return res.status(404).json({ error: 'Not found' });
        res.json(data);
    },
    // Atualizar
    update: async (req, res, next) => {
        try {
            const [updated] = await Model.update(req.body, {
                where: { id: req.params.id }
            });
            if (!updated) return res.status(404).json({ error: 'Registro não encontrado' });
            res.json(await Model.findByPk(req.params.id));
        } catch (error) {
            next(error);
        }
    },
    // Deletar
    delete: async (req, res, next) => {
        try {
            const deleted = await Model.destroy({
                where: { id: req.params.id }
            });
            if (!deleted) return res.status(404).json({ error: 'Registro não encontrado' });
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
});

module.exports = createCRUDController;