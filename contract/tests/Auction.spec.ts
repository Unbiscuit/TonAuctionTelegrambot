import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Auction } from '../build/Auction/Auction_Auction';
import '@ton/test-utils';

describe('Auction', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let bidder1: SandboxContract<TreasuryContract>;
    let bidder2: SandboxContract<TreasuryContract>;
    let auction: SandboxContract<Auction>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');
        bidder1  = await blockchain.treasury('bidder1');
        bidder2  = await blockchain.treasury('bidder2');

        auction = blockchain.openContract(await Auction.fromInit());

        const deployResult = await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: auction.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        const state = await auction.getState();
        expect(state.active).toBe(false);
        expect(state.finalized).toBe(false);
    });

    it('owner can start auction', async () => {
        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        const state = await auction.getState();
        expect(state.active).toBe(true);
        expect(state.minBid).toBe(toNano('1'));
    });

    it('non-owner cannot start auction', async () => {
        const result = await auction.send(
            bidder1.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        expect(result.transactions).toHaveTransaction({
            from: bidder1.address,
            to: auction.address,
            success: false,
        });
    });

    it('bidder can place a bid', async () => {
        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        await auction.send(
            bidder1.getSender(),
            { value: toNano('2') },
            { $$type: 'PlaceBid' },
        );

        const state = await auction.getState();
        expect(state.highestBid).toBe(toNano('2'));
        expect(state.highestBidder.toString()).toBe(bidder1.address.toString());
    });

    it('outbid refunds previous bidder', async () => {
        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        await auction.send(
            bidder1.getSender(),
            { value: toNano('2') },
            { $$type: 'PlaceBid' },
        );

        const balanceBefore = await bidder1.getBalance();

        await auction.send(
            bidder2.getSender(),
            { value: toNano('3') },
            { $$type: 'PlaceBid' },
        );

        const balanceAfter = await bidder1.getBalance();

        // bidder1 должен получить обратно ~2 TON
        expect(balanceAfter - balanceBefore).toBeGreaterThan(toNano('1.9'));

        const state = await auction.getState();
        expect(state.highestBidder.toString()).toBe(bidder2.address.toString());
    });

    it('cannot bid below minimum', async () => {
        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        const result = await auction.send(
            bidder1.getSender(),
            { value: toNano('0.5') },
            { $$type: 'PlaceBid' },
        );

        expect(result.transactions).toHaveTransaction({
            from: bidder1.address,
            to: auction.address,
            success: false,
        });
    });

    it('cannot bid below current highest', async () => {
        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        await auction.send(
            bidder1.getSender(),
            { value: toNano('3') },
            { $$type: 'PlaceBid' },
        );

        const result = await auction.send(
            bidder2.getSender(),
            { value: toNano('2') },
            { $$type: 'PlaceBid' },
        );

        expect(result.transactions).toHaveTransaction({
            from: bidder2.address,
            to: auction.address,
            success: false,
        });
    });

    it('cannot finalize before end time', async () => {
        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        const result = await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'Finalize' },
        );

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: auction.address,
            success: false,
        });
    });

    it('finalizes after end time and sends TON to owner', async () => {
        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        await auction.send(
            bidder1.getSender(),
            { value: toNano('5') },
            { $$type: 'PlaceBid' },
        );

        // Перематываем время вперёд
        blockchain.now = Math.floor(Date.now() / 1000) + 7200;

        const balanceBefore = await deployer.getBalance();

        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'Finalize' },
        );

        const balanceAfter = await deployer.getBalance();

        // Владелец должен получить ~5 TON минус резерв
        expect(balanceAfter - balanceBefore).toBeGreaterThan(toNano('4'));

        const state = await auction.getState();
        expect(state.active).toBe(false);
        expect(state.finalized).toBe(true);

        const winner = await auction.getWinner();
        expect(winner?.toString()).toBe(bidder1.address.toString());
    });

    it('owner can start new auction after finalization', async () => {
        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('1'), duration: 3600n },
        );

        blockchain.now = Math.floor(Date.now() / 1000) + 7200;

        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'Finalize' },
        );

        await auction.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { $$type: 'StartAuction', minBid: toNano('2'), duration: 7200n },
        );

        const state = await auction.getState();
        expect(state.active).toBe(true);
        expect(state.minBid).toBe(toNano('2'));
    });
});
