/*jshint esversion: 6 */
//importando o watson e prompt

const prompt = require('prompt-sync')();
const watson = require('watson-developer-cloud/assistant/v1');

require('dotenv').config();

const chatbot = new watson({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    version: process.env.WATSON_VERSION,
});
const workspace_id = process.env.workspace_id;

chatbot.message({ workspace_id }, trataResposta);

let fimDeconversa = false;

function trataResposta(err, resposta) {
    if (err) {
        console.log(err);
        return;
    }
    //detecta a intenção do usuário
    if (resposta.intents.length > 0) {
        console.log('Eu detectei a sua  intenção é: ' + resposta.intents[0].intent);
        if (resposta.intents[0].intent == 'despedida') {
            fimDeconversa = true;
        }
    }
    //console.log(resposta);
    //exibir a resposta caso haja
    if (resposta.output.text.length > 0) {
        console.log(resposta.output.text[0]);
    }
    if (!fimDeconversa) {
        // console.log(resposta.context);
        const mensagemUsuario = prompt('>>');
        chatbot.message({
            workspace_id,
            input: { text: mensagemUsuario },
            context: resposta.context
        }, trataResposta);
    }
}