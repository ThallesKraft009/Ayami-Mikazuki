const fs = require("fs");

const botoes = [];
fs.readdirSync(`./components/button/`).forEach(dir => {
    const files = fs.readdirSync(`./components/button/${dir}/`).filter(file => file.endsWith('.js'));

    files.forEach((file) => {
        let button = require(`../../components/button/${dir}/${file}`)

        if (button) {
            botoes.push(button);
        }
    })
})

const Interaction = async (data) => {

    if (data.d.type === 3) {

        let id = data.d.data.custom_id;

        let botao = botoes.find(button => id.startsWith(button.customId));

       botao.run(data.d, id)

    }

}

module.exports = { Interaction };
