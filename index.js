const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const body = req.body;
  const phone = body.phone;
  const msg = body.message?.toLowerCase() || "";

  let responseText = "";
  let buttons = [];

  if (msg.includes("devolver") || msg.includes("troca")) {
    responseText = "Olá! Aqui é o *Time de Pós-Venda Mercado Livre* 👋\nPor favor, selecione o motivo da devolução:";
    buttons = [
      "Não serviu",
      "Produto com defeito",
      "Recebi errado",
      "Falar com atendente"
    ];
  } else if (msg.includes("não serviu")) {
    responseText = "Sem problemas! Você pode nos devolver o produto e solicitar outro tamanho pelo Mercado Livre.";
  } else if (msg.includes("defeito")) {
    responseText = "Sinto muito por isso. Vamos agilizar a troca! Envie fotos do defeito para analisarmos.";
  } else if (msg.includes("recebi errado")) {
    responseText = "Ops! Nos envie fotos do que recebeu e o número do pedido para resolvermos o quanto antes.";
  } else if (msg.includes("atendente")) {
    responseText = "Encaminhando você para um atendente. Aguarde, por favor.";
  } else {
    responseText = "Olá! Para devolver um produto, digite: 'quero devolver'.";
  }

  try {
    await axios.post('https://api.z-api.io/instance000000/token000000/send-buttons', {
      phone: phone,
      message: responseText,
      options: buttons
    });
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao enviar resposta:", error.message);
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => {
  res.send("Bot Pós-Venda rodando!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});