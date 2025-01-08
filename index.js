const axios = require('axios');
const { performance } = require('perf_hooks');

const url = 'http://api.host-bot.store/apis';
const requestsPerCycle = 200;
const timesToRun = 50;
const maxConcurrentRequests = 50; 

const sendRequest = async () => {
  try {
    await axios.get(url, {
      timeout: 5000,
    });
  } catch (error) {
    console.error(`Error en solicitud: ${error.message}`);
  }
};

const runRequestsInBatches = async (batchSize, totalRequests) => {
  for (let i = 0; i < totalRequests; i += batchSize) {
    const batchPromises = Array.from({ length: Math.min(batchSize, totalRequests - i) }, sendRequest);
    await Promise.all(batchPromises);
  }
};

const runRequests = async () => {
  const startTime = performance.now();

  for (let j = 1; j <= timesToRun; j++) {
    console.log(`Ejecutando ciclo ${j} de ${timesToRun}...`);
    await runRequestsInBatches(maxConcurrentRequests, requestsPerCycle);

    console.log(`Se completaron ${requestsPerCycle} solicitudes en el ciclo ${j}.`);
  }

  const endTime = performance.now();
  console.log(`Se completaron ${requestsPerCycle * timesToRun} solicitudes a ${url} en total.`);
  console.log(`Tiempo total de ejecución: ${(endTime - startTime) / 1000} segundos.`);
};

runRequests();
