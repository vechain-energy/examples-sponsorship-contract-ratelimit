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
  it('returns 10/10 requests for token owners as sender', async () => {
    await contracts.nft.connect(user3).mint()
    const [limit, duration, consumer, group] = await contracts.logic.rateLimitSponsorFor(user3.address, owner.address, `0x`)
    expect(limit).toEqual(10)
    expect(duration).toEqual(10)
    expect(consumer).toEqual('0x1ebaa930b8e9130423c183bf38b0564b0103180b7dad301013b18e59880541ae')
    expect(group).toEqual('0xbc3101643deefa8009088760dce239a7761a55b4d9e77a837f93df6db2491fc5')
  })

  it('returns a limit of 1/600 request for other users', async () => {
    const [limit, duration, consumer, group] = await contracts.logic.rateLimitSponsorFor(user4.address, owner.address, `0x`)
    expect(limit).toEqual(1)
    expect(duration).toEqual(600)
    expect(consumer).toEqual('0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b')
    expect(group).toEqual('0x0000000000000000000000000000000000000000000000000000000000000000')
  })

  it('returns a limit of 10/60 request for everyone sending transactions to the current contract, sharing the same limits', async () => {
    const [limit, duration, consumer, group] = await contracts.logic.rateLimitSponsorFor(user4.address, contracts.logic.address, `0x`)
    expect(limit).toEqual(10)
    expect(duration).toEqual(60)
    expect(consumer).toEqual('0xb35cf3382986816738394d7998b4f3fd1f6d1fc7b3db5dd118ecac21f2e90d73')
    expect(group).toEqual('0x0000000000000000000000000000000000000000000000000000000000000000')
  })

})