# p2p-exchange

## Setup

Run two Grapes:

```
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

```
# Add base as upstream:
git remote add upstream https://github.com/bitfinexcom/bfx-util-js

# Configure service:
bash setup-config.sh
```


### Boot worker

```
node worker.js --env=development --wtype=wrk-exchange-service-api --apiPort 1337
```

### Boot the client

```
node client.js
```

## Grenache API


