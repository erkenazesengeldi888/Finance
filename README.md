Educational project for the course Introduction to Finance. Not a real product, service or investment offer. Do not use with real funds.

# CertiChain

Technical educational project for the course "Introduction to Finance" at Astana IT University. CertiChain demonstrates how to issue, verify, and revoke certificates by storing only the document hash on the blockchain.

## Features

- Issuance of documents with a `bytes32` hash and a university ID.
- Storage of the issuance timestamp and revocation status.
- Verification of active certificates and revocation restricted to the contract owner.
- `CertificateIssued` and `CertificateRevoked` events.

The contract does not store the diploma itself. For educational demonstration purposes, use synthetic data and never record personal or confidential information on the blockchain.

## Prerequisites

- Node.js 18 or newer
- npm

## Installation

From the project root, run:

npm install
Contract Compilation
Bash
npx hardhat compile
Running the Local Network
In the first terminal, start the local Hardhat node:

Bash
npx hardhat node
The node provides test accounts and a local network at http://127.0.0.1:8545 (chain ID 31337). These are intended for local development only.

Deployment
In the second terminal, from the project root, run:

Bash
npx hardhat run scripts/deploy.js --network localhost
The console will display the deployed contract address and the owner's address. The npm run deploy:local command is also available.

Tests
Bash
npx hardhat test
The tests verify the owner, successful issuance, duplicate prevention, verification of valid and non-existent certificates, revocation, revocation events, and access control restrictions.

Demo
Demo link: add the link after publishing/demonstrating the project.
