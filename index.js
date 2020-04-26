const {Client, MessageAttachment} = require('discord.js');
const client = new Client();

const prefix = process.env.prefix;
const token = process.env.TOKEN;
const giphyToken = process.env.giphyToken;

const fs = require('fs');
let sonidos = ["Chano", "aparezco", "buenisimo", "fino", "niki", "a4", "aplaudo", "cortito", "hola", "privado", "acho", "basta", "cpiko", "jaram", "skate", "achotapita", "boa", "dios", "love", "traicionera", "ahre", "bob", "filisteo", "marina"];
let imagenes = ["lobby"];
let misSonidos = [];
let isPlaying = false;
let comando = []
let divididosLasPelotas = []

let GphApiClient = require('giphy-js-sdk-core')
giphy = GphApiClient(giphyToken)

client.once('ready', () => {
  console.log("ORT Bot");
  console.log("By Maximo Signiorini aka Collatio");
});


//Funcionamiento central del bot
client.on('message', async message => {
  if (message.content.includes(prefix)) {

    let miMensaje = message.content;
    miMensaje = miMensaje.slice(3);
    if (miMensaje.length > 1) {
      leerComando(miMensaje, message).then((res) => {}).catch((err) => {
        //message.reply(err.message);
      });
    }
  }else if(message.content === "?lobby"){
    const attachment = new MessageAttachment("https://i.imgur.com/jKzTlTN.jpg");
    message.channel.send(attachment);
  } else if(message.content.startsWith("?g")){
    let gifMes = message.content;
    gifMes = gifMes.slice(3);
    giphy.search('gifs',{"q": gifMes})
     .then((response) => {
       let totalResponses = response.data.length
       let responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses
       let responseFinal = response.data[responseIndex]
       message.channel.send(gifMes, {
         files: [responseFinal.images.fixed_height.url]
       });
     }).catch(() => {
       message.channel.send("Error!")
     })
  }
});

client.login(token);

async function leerComando(miMensaje, message) {

  const voiceChannel = await message.member.voice.channel;

  switch (miMensaje) {

    case 'help':
      message.reply("Capo aca te van todos los soniditos: " + sonidos);
      message.reply("Y estas son las imagenes: " + imagenes);
      message.reply("Para mandar imagenes escribí ?imagen");
      break;

    default:

      if (!voiceChannel) {
        message.reply("Entra al canal potze")
      }

        divididosLasPelotas = dividirComandos(miMensaje)
        if(divididosLasPelotas[1].length > 0 ){
          for(let i = 0;i < divididosLasPelotas[1].length;i++){
            message.reply('el comando ' + divididosLasPelotas[1][i] + ' no lo tengo kinga, pediselo al massi');
          }
        }
        misSonidos = misSonidos.concat(divididosLasPelotas[0])
        reproducir();
        break;
  }

  async function reproducir(){
    if(misSonidos.length > 0 && !isPlaying){
      isPlaying = true;
      voiceChannel.join().then(connection => {
          const dispatcher = connection.play('./Audio/' + misSonidos[0] + '.ogg');
          dispatcher.on('finish', end => {
            isPlaying = false;
            misSonidos.splice(0,1);
            reproducir()
          })
      })
    }
  }

}

function dividirComandos(miMensaje) {
  let divididos = []
  miMensaje = miMensaje.replace(" ","");
  miMensaje = miMensaje.split(",")
  let comando = []


  for (let i = 0; i < miMensaje.length; i++) {
    if (!fs.existsSync('./Audio/' + miMensaje[i].replace(" ","") + '.ogg')) {
      //Los que estan mal
      let lasPelotas = miMensaje[i].replace(" ","");
      divididos.push(lasPelotas)
    }
    if (fs.existsSync('./Audio/' + miMensaje[i].replace(" ","") + '.ogg')) {
      //Los que estan bien
      let kapanga = miMensaje[i].replace(" ","")
      comando.push(kapanga)
    }
  }

let uniqueArray = divididos.filter(function(item, pos, self){
  return self.indexOf(item) == pos;
});


  let miUltimoArray = [comando, uniqueArray]
  return miUltimoArray
}


//giphy shit
// giphy.search('gifs',{"q": "al lobby pete"})
//   .then((response) => {
//     let totalResponses = response.data.length
//     let responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses
//     let responseFinal = response.data[responseIndex]
//     message.channel.send("Al lobby, pete", {
//       files: [responseFinal.images.fixed_height.url]
//     });
//   }).catch(() => {
//     message.channel.send("Error!")
//   })
