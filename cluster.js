const cluster = require('cluster')

if(cluster.isMaster) {
    const worker = require('os').cpus().length;

    for(let i = 0; i < worker; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`Worker started with a PID of ${worker.process.pid}`);
    });

    cluster.on('exit', (worker) => {
        console.log(`Worker died with a PID of ${worker.process.pid}`);
        cluster.fork();
    });

} else {
    require('./server')
}

