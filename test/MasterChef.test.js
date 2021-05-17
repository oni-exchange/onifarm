const {
    BN,
    constants,
    expectEvent,
    expectRevert,
    time
} = require('@openzeppelin/test-helpers');

const OniToken = artifacts.require('OniToken');
const SyrupBar = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');
const MockBEP20 = artifacts.require('libs/MockBEP20');

contract('MasterChef', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.oni = await OniToken.new({ from: minter });

        this.lp1 = await MockBEP20.new('LPToken', 'LP1', '1000000000000000000000000', { from: minter });
        this.lp2 = await MockBEP20.new('LPToken', 'LP2', '1000000000000000000000000', { from: minter });
        this.lp3 = await MockBEP20.new('LPToken', 'LP3', '1000000000000000000000000', { from: minter });

        this.chef = await MasterChef.new(this.oni.address, dev, '10000000000000000000', '100', { from: minter });

        await this.oni.transferOwnership(this.chef.address, { from: minter });

        await this.lp1.transfer(bob, '2000000000000000000000', { from: minter });
        await this.lp2.transfer(bob, '2000000000000000000000', { from: minter });
        await this.lp3.transfer(bob, '2000000000000000000000', { from: minter });

        await this.lp1.transfer(alice, '2000000000000000000000', { from: minter });
        await this.lp2.transfer(alice, '2000000000000000000000', { from: minter });
        await this.lp3.transfer(alice, '2000000000000000000000', { from: minter });
    });

    it('real case', async () => {
      this.lp4 = await MockBEP20.new('LPToken', 'LP1', '1000000000000000000000000', { from: minter });
      this.lp5 = await MockBEP20.new('LPToken', 'LP2', '1000000000000000000000000', { from: minter });
      this.lp6 = await MockBEP20.new('LPToken', 'LP3', '1000000000000000000000000', { from: minter });
      this.lp7 = await MockBEP20.new('LPToken', 'LP1', '1000000000000000000000000', { from: minter });
      this.lp8 = await MockBEP20.new('LPToken', 'LP2', '1000000000000000000000000', { from: minter });
      this.lp9 = await MockBEP20.new('LPToken', 'LP3', '1000000000000000000000000', { from: minter });
      await this.chef.add('2000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('500', this.lp3.address, true, { from: minter });
      await this.chef.add('500', this.lp4.address, true, { from: minter });
      await this.chef.add('500', this.lp5.address, true, { from: minter });
      await this.chef.add('500', this.lp6.address, true, { from: minter });
      await this.chef.add('500', this.lp7.address, true, { from: minter });
      await this.chef.add('100', this.lp8.address, true, { from: minter });
      await this.chef.add('100', this.lp9.address, true, { from: minter });
      assert.equal((await this.chef.poolLength()).toString(), "9");

      await time.advanceBlockTo('150');
      await this.lp1.approve(this.chef.address, '1000000000000000000000', { from: alice });
      assert.equal((await this.oni.balanceOf(alice)).toString(), '0');
      await this.chef.deposit(0, '20000000000000000000', { from: alice });
      await this.chef.withdraw(0, '20000000000000000000', { from: alice });
      await time.advanceBlockTo('200');
      assert.equal((await this.oni.balanceOf(alice)).toString(), '3508771929820000000');
    })


    it('deposit/withdraw', async () => {
      await this.chef.add('1000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.chef.address, '100000000000000000000', { from: alice });
      await this.chef.deposit(0, '20000000000000000000', { from: alice });
      await this.chef.deposit(0, '0', { from: alice });
      await this.chef.deposit(0, '40000000000000000000', { from: alice });
      await this.chef.deposit(0, '0', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1940000000000000000000');
      await this.chef.withdraw(0, '10000000000000000000', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1950000000000000000000');
      assert.equal((await this.oni.balanceOf(alice)).toString(), '13333333333240000000');
      assert.equal((await this.oni.balanceOf(dev)).toString(), '1333333333333333332');

      await this.lp1.approve(this.chef.address, '100000000000000000000', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000000000000000000000');
      await this.chef.deposit(0, '50000000000000000000', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '1950000000000000000000');
      await this.chef.deposit(0, '0', { from: bob });
      assert.equal((await this.oni.balanceOf(bob)).toString(), '1666666666650000000');
      await this.chef.emergencyWithdraw(0, { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000000000000000000000');
    })

    it('should allow dev and only dev to update dev', async () => {
        assert.equal((await this.chef.devAddr()).valueOf(), dev);
        await expectRevert(this.chef.dev(bob, { from: bob }), 'MS: wut?');
        await this.chef.dev(bob, { from: dev });
        assert.equal((await this.chef.devAddr()).valueOf(), bob);
        await this.chef.dev(alice, { from: bob });
        assert.equal((await this.chef.devAddr()).valueOf(), alice);
    })

    it('deposit referred', async () => {
      await this.chef.add('1000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.chef.address, '100000000000000000000', { from: alice });

    {
        const { tx } = await this.chef.depositReferred(0, '20000000000000000000', bob, { from: alice }); // bob is alice's referral
        await expectEvent.inTransaction(
            tx,
            this.chef,
            'Referral',
            { _user: alice, _referrer: bob },
        );
    }

    const referral = await this.chef.getReferral(alice);
    assert.equal(referral, bob);
    await time.advanceBlock();

    {
        // console.log('pending oni = ', (await this.chef.pendingOni(0, alice)).toString());
        const { tx } = await this.chef.withdraw(0, '20000000000000000000', { from: alice });
      assert.equal((await this.oni.balanceOf(alice)).toString(), '6666666666660000000');
        await expectEvent.inTransaction(
          tx,
          this.chef,
          'ReferralPaid',
          { _user: alice, _userTo: bob, _reward: '133333333333200000' },
      );
      assert.equal((await this.oni.balanceOf(bob)).toString(), '133333333333200000');
    }

    });


});
