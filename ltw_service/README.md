# LTW Service

SMS backend service for managing bound aids in Shelter smart contracts.

## Quick Start

### Development

```bash
make devup
```

### Production

```bash
make produp
```

## Environment Setup

Create a `.env` file with:

```env
# APP
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_TIME=24h
APP_PORT=3000
PRODUCTION=0
TTL_AS_MINUTES=60
ENABLE_BACKDOOR_CMD=0

# MULTILANGUAGE
LANGUAGE=en
PRELOAD_LANGUAGES=en,es,fr

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WEBHOOK_URL=https://your-domain.com/sms/webhook
MESSAGING_SERVICE_SID=your_messaging_service_sid

# Database
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=ltw_db
DB_PORT=27017

MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASS=your_mongo_express_password

# Stellar
SPONSOR_SECRET=your_sponsor_stellar_keypair_secret
STEWARD_SECRET=your_steward_stellar_keypair_secret
SHELTER_ID=your_shelter_contract_id
STELLAR_RPC=https://soroban-testnet.stellar.org
```

## API Endpoints

- `/api/users/*` - User management
- `/api/beneficiaries/*` - Beneficiary operations
- `/api/orders/*` - Aid order processing
- `/sms/*` - SMS handling for aid requests
- `/status` - Health check

## Tech Stack

- Node.js + Express + TypeScript
- MongoDB (via FerretDB)
- Stellar Soroban (Shelter contracts)
- Twilio SMS service

## Commands

- `make devup` - Start development environment
- `make produp` - Start production environment
- `make stopall` - Stop all services
- `make logsapp` - View application logs
