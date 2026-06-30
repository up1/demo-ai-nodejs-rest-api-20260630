'use strict';

const amqplib = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || 'users';

async function startConsumer() {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log(`[Consumer] Waiting for messages in queue: ${QUEUE_NAME}`);

  channel.consume(
    QUEUE_NAME,
    (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log('[Consumer] Received message:', message);
        // time-consuming processing simulation 10 seconds
        setTimeout(() => {
          console.log('[Consumer] Finished processing message:', message);
        }, 10000);

      }
    },
    { noAck: true }
  );
}

startConsumer().catch((err) => {
  console.error('[Consumer] Failed to start:', err);
  process.exit(1);
});
