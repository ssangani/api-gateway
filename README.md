# API Gateway

Sample API gateway application build using NodeJs

## Setup

* Install necessary tools
```
Git
Node.js
```
* Clone the repo
* Install app dependencies

```
npm install
```
* (Optional) Setup environment files. If there are any fake secret values, substitute with real secrets
```
cp .env.sample .env
```

## Running application

```
npm run app
```

### App config

* `NODE_ENV` - Application environment viz. `development`, `staging`, or `production`
* `LOG_FORMAT` - Log format for `morgan` viz. `combined`, `combined`, `common`, `dev`, `tiny`, or `short`. (ref: https://github.com/expressjs/morgan#predefined-formats)
* `PRIMARY_VENDOR_RATE_LIMIT` - Hourly rate limit for primary IP API
* `SECONDARY_VENDOR_RATE_LIMIT` - Hourly rate limit for secondary IP API

## Sample requests

### Get country for given IP Address
```
curl --location --request GET 'http://localhost:3030/ipAddress/8.8.8.8/country'
```

## Running Tests

```
npm run test
```
