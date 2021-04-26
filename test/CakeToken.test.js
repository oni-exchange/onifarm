const { assert } = require("chai");

const OniToken = artifacts.require('OniToken');

contract('OniToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.oni = await OniToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.oni.mint(alice, 1000, { from: minter });
        assert.equal((await this.oni.balanceOf(alice)).toString(), '1000');
    })
});
