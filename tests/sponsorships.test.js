const { ethers } = require('hardhat')

const contracts = {}
let owner
let allowedUser1
let forbiddenUser1

beforeEach(async function () {
  [owner, allowedUser1, forbiddenUser1, user3, user4, user5] = await ethers.getSigners()

  const NFT = await ethers.getContractFactory('NFT')
  contracts.nft = await NFT.deploy()

  const ExampleLogic = await ethers.getContractFactory('ExampleLogic')
  contracts.logic = await ExampleLogic.deploy(contracts.nft.address)

})


describe('canSponsorTransactionFor(sender, recipient, data)', () => {
  it('returns true for nft owners', async () => {
    await contracts.nft.connect(user3).mint()
    const canSponsor = await contracts.logic.canSponsorTransactionFor(user3.address, forbiddenUser1.address, '0x')
    expect(canSponsor).toEqual(true)
  })

  it('returns false for none-nft owners', async () => {
    const canSponsor = await contracts.logic.canSponsorTransactionFor(user3.address, forbiddenUser1.address, '0x')
    expect(canSponsor).toEqual(false)
  })
})

describe('rateLimitSponsorFor(sender, recipient, data)', () => {
  it('returns unlimited requests for token owners as sender', async () => {
    await contracts.nft.connect(user3).mint()
    const [limit, perSeconds, identifier] = await contracts.logic.rateLimitSponsorFor(user3.address, owner.address, `0x`)
    expect(limit).toEqual(0)
    expect(perSeconds).toEqual(0)
    expect(identifier).toEqual('0x1ebaa930b8e9130423c183bf38b0564b0103180b7dad301013b18e59880541ae')
  })

  it('returns a limit of 1 request per hour (3600 seconds) for other users', async () => {
    const [limit, perSeconds, identifier] = await contracts.logic.rateLimitSponsorFor(user4.address, owner.address, `0x`)
    expect(limit).toEqual(1)
    expect(perSeconds).toEqual(3600)
    expect(identifier).toEqual('0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b')
  })

})