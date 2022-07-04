process.on('message', msg => {
    console.log(msg.msg);

    const random = msg.cant;
    const randoms = [];
    for (let i = 0; i < random; i++) {
        if (randoms.includes(Math.floor(Math.random() * 1000))) {
            i--;
        } else {
            randoms.push(Math.floor(Math.random() * 1000));
        }
    }
    process.send({ randoms });
});