import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Auction } from '../build/Auction/Auction_Auction';
import '@ton/test-utils';

describe('Auction', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let auction: SandboxContract<Auction>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        auction = blockchain.openContract(await Auction.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await auction.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
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
        // the check is done inside beforeEach
        // blockchain and auction are ready to use
    });
});
