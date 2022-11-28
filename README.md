# API Gateway

Sample API gateway application

## Setup

* Install necessary tools - `Git` and `Node.js`
* Clone the repo
* Install app dependencies by running following command at root of the repo - `npm install`
* (Optional) Copy the sample env file to setup environment config by running `cp .env.sample .env`. If there are any fake secret values, substitute with real secrets

## App config

* `NODE_ENV` - Application environment viz. `development`, `staging`, or `production`
* `LOG_FORMAT` - Log format for `morgan` viz. `combined`, `combined`, `common`, `dev`, `tiny`, or `short`. (ref: https://github.com/expressjs/morgan#predefined-formats)
* `PRIMARY_VENDOR_RATE_LIMIT` - Hourly rate limit for primary IP API
* `SECONDARY_VENDOR_RATE_LIMIT` - Hourly rate limit for secondary IP API

## Running Tests
Run following command at root of the repo - `npm run test`

## Running application
Run the following command via CLI at the root of the repo - `npm run app`

## Sample requests

### Get country for given IP Address
GET `/ipAddress/{ipAddress}/country`

Example - `curl --location --request GET 'http://localhost:3030/ipAddress/8.8.8.8/country'`
