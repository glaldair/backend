const yargs = require('yargs/yargs')(process.argv.slice(2));
const { fork } = require('child_process');

function getInfo (req, res) {
    const info = {
        argv: yargs.argv,
        os: process.platform,
        nodeVersion: process.version,
        memoryTotal: process.memoryUsage().heapTotal,
        execPath: process.execPath,
        processId: process.pid,
        projectFolder: __dirname,
    }
    const { argv, os, nodeVersion, memoryTotal, execPath, processId, projectFolder } = info;
    res.render('info', { argv, os, nodeVersion, memoryTotal, execPath, processId, projectFolder });
}

async function getRandoms (req, res) {
    const { cant } = req.query;
    const random = cant || 1000;
    const randoms = [];
    for (let i = 0; i < random; i++) {
        randoms.push(Math.floor(Math.random() * 1000));
    }
    // Devolver un objeto con todos los numeros random calculados
    res.json({ randoms });
}


async function random(req, res) {
    const random = fork('./public/random.js');

    const { cant } = req.query;
    const cantidad = cant || 100000000;

    random.send({ cant: cantidad, msg: `Calculando ${cantidad} números aleatorios` });
    random.on('message', msg => {
        res.render('random', { randoms: msg.randoms });
    });
}


module.exports = {
    getInfo,
    getRandoms,
    random
}