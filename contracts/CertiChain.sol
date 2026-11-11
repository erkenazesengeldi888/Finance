// Educational project for the course Introduction to Finance. Not a real product, service or investment offer. Do not use with real funds.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertiChain
 * @notice A course demonstration of issuing, verifying, and revoking document hashes.
 * @dev Stores hashes only; do not store personal or confidential data on-chain.
 */
contract CertiChain {
    struct Certificate {
        uint256 universityId;
        uint256 timestamp;
        bool isRevoked;
        bool exists;
    }

    address public owner;
    mapping(bytes32 => Certificate) private certificates;

    event CertificateIssued(bytes32 indexed docHash, uint256 indexed universityId, uint256 timestamp);
    event CertificateRevoked(bytes32 indexed docHash, uint256 indexed universityId, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "CertiChain: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /** @notice Registers a document hash for a university. Only the contract owner may issue. */
    function issueCertificate(bytes32 docHash, uint256 universityId) external onlyOwner {
        require(docHash != bytes32(0), "CertiChain: document hash is zero");
        require(!certificates[docHash].exists, "CertiChain: certificate already exists");
        certificates[docHash] = Certificate({
            universityId: universityId,
            timestamp: block.timestamp,
            isRevoked: false,
            exists: true
        });
        emit CertificateIssued(docHash, universityId, block.timestamp);
    }

    /** @notice Returns certificate data, reverting for unknown hashes or revoked certificates. */
    function verifyCertificate(bytes32 docHash)
        external
        view
        returns (uint256 universityId, uint256 timestamp, bool isRevoked)
    {
        Certificate memory certificate = certificates[docHash];
        require(certificate.exists, "CertiChain: certificate does not exist");
        require(!certificate.isRevoked, "CertiChain: certificate is revoked");
        return (certificate.universityId, certificate.timestamp, certificate.isRevoked);
    }

    /** @notice Revokes an existing certificate. Only the contract owner may revoke. */
    function revokeCertificate(bytes32 docHash) external onlyOwner {
        Certificate storage certificate = certificates[docHash];
        require(certificate.exists, "CertiChain: certificate does not exist");
        require(!certificate.isRevoked, "CertiChain: certificate already revoked");
        certificate.isRevoked = true;
        emit CertificateRevoked(docHash, certificate.universityId, block.timestamp);
    }
}
