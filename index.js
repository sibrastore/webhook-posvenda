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

  const palavrasDevolucao = ["devolver", "quero devolver", "devolução", "troca", "quero trocar"];
  const palavrasNaoServiu = ["não serviu", "tamanho errado", "ficou pequeno", "ficou grande"];
  const palavrasDefeito = ["defeito", "estragado", "com problema", "danificado"];
  const palavrasErrado = ["recebi errado", "produto errado", "pedido errado"];
  const palavrasAtendente = ["falar com atendente", "humano", "ajuda humana", "atendente"];

  if (palavrasDevolucao.some(p => msg.includes(p))) {
    responseText = `Para devolver seu pedido pelo Mercado Livre, siga esses passos:

1. Entre em *Compras* e escolha o pedido.
2. Clique em *Me arrependi / Não quero mais*.
3. Responda um questionário rápido (diga que o item está em bom estado ou não foi usado).
4. A plataforma gera uma etiqueta em PDF ou QR Code para postar nos Correios ou ponto de coleta.
5. Seu dinheiro será estornado automaticamente.

📦 Caso precise de ajuda com isso, é só responder aqui!`;
  } else if (palavrasNaoServiu.some(p => msg.includes(p))) {
    responseText = "Sem problemas! Você pode nos devolver o produto e solicitar outro tamanho pelo Mercado Livre.";
  } else if (palavrasDefeito.some(p => msg.includes(p))) {
    responseText = "Sinto muito por isso. Vamos agilizar a troca! Envie fotos do defeito para analisarmos.";
  } else if (palavrasErrado.some(p => msg.includes(p))) {
    responseText = "Ops! Nos envie fotos do que recebeu e o número do pedido para resolvermos o quanto antes.";
  } else if (palavrasAtendente.some(p => msg.includes(p))) {
    responseText = "Encaminhando você para um atendente. Aguarde, por favor.";
  } else {
    responseText = "Olá! Aqui é o *Time de Pós-Venda Mercado Livre* 👋\nPor favor, selecione o motivo da devolução:";
    buttons = [
      "Não serviu",
      "Produto com defeito",
      "Recebi errado",
      "Falar com atendente"
    ];
  }

  try {
    await axios.post('https://api.z-api.io/instances/3E4C6D7C1AD460C579F69E6774402775/token/82B75EA8603E8D55BDCA8203/send-buttons', {
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