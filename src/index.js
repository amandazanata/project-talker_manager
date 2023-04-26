const express = require('express');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const { validaEmail, validaPassword } = require('./middlewares/loginValidations');

const {
  auth,
  validaNome,
  validaIdade,
  validaTalk,
  validaWatchedAt,
  valiRate,
} = require('./middlewares/talkerValidations');

const readJson = fs.readFile(path.resolve(__dirname, './talker.json'));

/* const talkier = async (talker) => {
  const allTalkers = await readJson;
  allTalkers.push(talker);
  const talkTalker = JSON.stringify(allTalkers, null, 2);
  await fs.writeFile(readJson, talkTalker);
  return talker;
}; */

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// Função de leitura do arquivo .json com módulo fs
const readTalkerFile = async () => {
  const data = await readJson;
  try {
      const result = JSON.parse(data);
      return result;
    } catch (error) {
      console.error(`Erro de leitura de arquivo ${error}`);
    }
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
  });

// Crie o endpoint GET /talker
app.get('/talker', async (_req, res) => {
  const data = await readTalkerFile();
  const array = data.splice(0);

  if (!data) {
    return res.status(200).json(data);
  }
  return res.status(200).json(array);
});

// Crie o endpoint GET /talker/:id
app.get('/talker/:id', async (req, res) => {
  const data = await readTalkerFile();
  const speaker = data.find((talker) => talker.id === Number(req.params.id));

  if (speaker) {
    return res.status(200).json(speaker);
  }
  return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
});

// Cria endpoint POST /login
app.post('/login', validaEmail, validaPassword, async (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

// Função para criar novo talker
app.post('/talker',
auth,
validaNome,
validaIdade,
validaTalk,
validaWatchedAt,
valiRate, async (req, res) => {
  const { name, age, talk } = req.body;
  const talkerJson = await readTalkerFile();
  const newTalker = {
    id: talkerJson[talkerJson.length - 1].id + 1,
    name,
    age,
    talk,
  };
  const talkTalker = JSON.stringify([...talkerJson, newTalker]);
  await fs.writeFile(readJson, talkTalker);
  return res.status(201).json(newTalker);
});