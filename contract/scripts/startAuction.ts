import { toNano } from '@ton/core';
import { Auction } from '../build/Auction/Auction_Auction';
import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';

const CONTRACT_ADDRESS = 'kQDRHkXNnbTcbqxDLmSWxPa8R3mNQ5RfYEBowiNoyhEgMmay';

export async function run(provider: NetworkProvider) {
    const auction = provider.open(Auction.fromAddress(Address.parse(CONTRACT_ADDRESS)));

    await auction.send(
        provider.sender(),
        { value: toNano('0.1') },
        {
            $$type: 'StartAuction',
            minBid: toNano('0.5'),  // минимальная ставка 0.5 TON
            duration: 3600n,        // 1 час
        }
    );

    console.log('Auction started!');
}
