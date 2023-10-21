const fs = require("fs");

let Commands = [];
fs.readdirSync(`./Commands/Prefix/`).forEach(dir => {
        const files = fs.readdirSync(`./Commands/Prefix/${dir}/`).filter(file => file.endsWith('.js'));

        files.forEach((file) => {
            let command = require(`../../Commands/Prefix/${dir}/${file}`)

            if(command) {
                  Commands[command.name] = command;
            } 
        })
})

const Prefix = async(data) => {
  let { d } = data;
  let prefix = "-";

          
  
  if(d.type !== 0) return;
          
	if(!d.content.startsWith(prefix)) return; 
	const args = d.content.slice(prefix.length).trim().split(/ +/g); 
	const cmd = args.shift().toLowerCase();
	if(cmd.length === 0) return;
	let command = Commands[cmd]
  command.run(d, args);
}

module.exports = { Prefix, Commands }