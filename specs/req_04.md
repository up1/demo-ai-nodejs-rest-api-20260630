# REST API :: Publish a new user to queue in rabbitmq
* RAbbitMQ server: localhost:5672
* queue: users
* user of rabbitmq = guest
* pass of rabbitmq = guest


## Flow
1. Send request POST /users to create a new user
2. Producer publish a new user to queue in rabbitmq
   * durable=true
3. Consumer subscribe to queue and receive the new user from queue in rabbitmq
   * file = consumer/consumer.js
   * acknowledge=false

## API endpoints
### POST /users
Request body:
```json
{
  "name": "string",
  "email": "string"
}
```

Response body code 201:
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "created_at": "timestamp"
}
```

## Message format
New user message format in queue in rabbitmq:
```json
{
  "message_type": "user_created",
  "id": "uuid",
  "name": "string",
  "email": "string",
  "created_at": "timestamp"
}
```