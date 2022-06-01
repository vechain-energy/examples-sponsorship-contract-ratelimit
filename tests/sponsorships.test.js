const { ethers } = require('hardhat')

const contracts = {}
let owner
let allowedUser1
let forbiddenUser1

beforeEach(async function () {
  [owner, allowedUser1, forbiddenUser1, user3, user4, user5] = await ethers.getSigners()

  const Sponsorship = await ethers.getContractFactory('Sponsorship')
  contracts.logic = await Sponsorship.deploy()
})


describe('canSponsorTransactionFor(sender, recipient, data)', () => {
  it('returns true by default', async () => {
    const canSponsor = await contracts.logic.canSponsorTransactionFor(user3.address, forbiddenUser1.address, '0x')
    expect(canSponsor).toEqual(true)
  })
})

describe('rateLimitSponsorFor(sender, recipient, data)', () => {
  it('returns 10/10 requests by origin', async () => {
    const [limit, duration, consumer, group] = await contracts.logic.rateLimitSponsorFor(user3.address, owner.address, `0x`)
    expect(limit).toEqual(10)
    expect(duration).toEqual(10)
    expect(consumer).toEqual('0x1ebaa930b8e9130423c183bf38b0564b0103180b7dad301013b18e59880541ae')
    expect(group).toEqual('0x0000000000000000000000000000000000000000000000000000000000000000')
  })

})