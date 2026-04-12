import { toNano } from '@ton/core';
import { Auction } from '../build/Auction/Auction_Auction';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const auction = provider.open(await Auction.fromInit());

    await auction.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(auction.address);

    // run methods on `auction`
}
