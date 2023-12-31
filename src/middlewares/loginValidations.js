// VALIDAÇÃO DO CAMPO EMAIL
const validaEmail = (req, res, next) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    
    const emailProperty = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i; // ajuda do WG na monitoria Summer e do Ronald na mentoria 13h, regex incorreto

    if (!emailProperty.test(email)) {
        return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }

    next();
};

// VALIDAÇÃO DO CAMPO PASSWORD
const validaPassword = (req, res, next) => {
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });

    if (password.length < 6) {
        return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }

    next();
};

module.exports = {
    validaEmail,
    validaPassword,
};