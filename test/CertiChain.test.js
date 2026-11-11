const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("CertiChain", function () {
  let certiChain;
  let owner;
  let other;
  const universityId = 2025n;
  const docHash = ethers.keccak256(ethers.toUtf8Bytes("sample diploma"));

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const CertiChain = await ethers.getContractFactory("CertiChain");
    certiChain = await CertiChain.deploy();
    await certiChain.waitForDeployment();
  });

  it("sets the deployer as the contract owner", async function () {
    expect(await certiChain.owner()).to.equal(owner.address);
  });

  it("allows the owner to issue a certificate and emits its details", async function () {
    await expect(certiChain.issueCertificate(docHash, universityId))
      .to.emit(certiChain, "CertificateIssued")
      .withArgs(docHash, universityId, anyValue);

    const [storedUniversityId, timestamp, isRevoked] = await certiChain.verifyCertificate(docHash);
    expect(storedUniversityId).to.equal(universityId);
    expect(timestamp).to.be.greaterThan(0n);
    expect(isRevoked).to.equal(false);
  });

  it("rejects issuing a duplicate document hash", async function () {
    await certiChain.issueCertificate(docHash, universityId);
    await expect(certiChain.issueCertificate(docHash, universityId + 1n))
      .to.be.revertedWith("CertiChain: certificate already exists");
  });

  it("allows verification of an existing, valid certificate", async function () {
    await certiChain.issueCertificate(docHash, universityId);
    const [storedUniversityId, timestamp, isRevoked] = await certiChain.verifyCertificate(docHash);
    expect(storedUniversityId).to.equal(universityId);
    expect(timestamp).to.be.greaterThan(0n);
    expect(isRevoked).to.equal(false);
  });

  it("reverts when verifying a certificate that does not exist", async function () {
    const unknownHash = ethers.keccak256(ethers.toUtf8Bytes("unknown diploma"));
    await expect(certiChain.verifyCertificate(unknownHash))
      .to.be.revertedWith("CertiChain: certificate does not exist");
  });

  it("allows the owner to revoke a certificate and prevents its verification", async function () {
    await certiChain.issueCertificate(docHash, universityId);
    await expect(certiChain.revokeCertificate(docHash))
      .to.emit(certiChain, "CertificateRevoked")
      .withArgs(docHash, universityId, anyValue);
    await expect(certiChain.verifyCertificate(docHash))
      .to.be.revertedWith("CertiChain: certificate is revoked");
  });

  it("prevents non-owners from issuing or revoking certificates", async function () {
    await expect(certiChain.connect(other).issueCertificate(docHash, universityId))
      .to.be.revertedWith("CertiChain: caller is not the owner");
    await certiChain.issueCertificate(docHash, universityId);
    await expect(certiChain.connect(other).revokeCertificate(docHash))
      .to.be.revertedWith("CertiChain: caller is not the owner");
  });
});
