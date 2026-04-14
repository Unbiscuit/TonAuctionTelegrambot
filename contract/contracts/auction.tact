message StartAuction {
    minBid: Int as coins;    // минимальная ставка в нанотонах
    duration: Int as uint32; // длительность аукциона в секундах
}

message(0x42) PlaceBid {}  // TON отправляется вместе с этим сообщением

message(0x43) Finalize {}

struct AuctionState {
    active: Bool;
    finalized: Bool;
    minBid: Int as coins;
    endTime: Int as uint32;
    highestBidder: Address;
    highestBid: Int as coins;
}

contract Auction {
    owner: Address;
    minBid: Int as coins;
    endTime: Int as uint32;
    highestBidder: Address;
    highestBid: Int as coins;
    active: Bool;
    finalized: Bool;

    init() {
        self.owner = sender();
        self.minBid = 0;
        self.endTime = 0;
        self.highestBidder = sender();
        self.highestBid = 0;
        self.active = false;
        self.finalized = false;
    }

    // Деплой контракта
    receive() {
        cashback(sender());
    }

    // Запустить новый аукцион (только владелец)
    receive(msg: StartAuction) {
        require(sender() == self.owner, "Only owner");
        require(!self.active, "Auction already active");
        require(msg.minBid > 0, "Min bid must be positive");
        require(msg.duration > 0, "Duration must be positive");

        self.minBid = msg.minBid;
        self.endTime = now() + msg.duration;
        self.highestBid = 0;
        self.highestBidder = self.owner;
        self.active = true;
        self.finalized = false;

        cashback(sender());
    }

    // Сделать ставку — отправить TON вместе с этим сообщением
    receive(msg: PlaceBid) {
        require(self.active, "No active auction");
        require(now() < self.endTime, "Auction ended");
        require(sender() != self.owner, "Owner cannot bid");

        let bidAmount: Int = context().value;
        require(bidAmount >= self.minBid, "Below minimum bid");
        require(bidAmount > self.highestBid, "Must exceed current bid");

        // Вернуть TON предыдущему участнику
        if (self.highestBid > 0) {
            send(SendParameters{
                to: self.highestBidder,
                value: self.highestBid,
                mode: SendIgnoreErrors,
                body: "Outbid refund".asComment()
            });
        }

        self.highestBidder = sender();
        self.highestBid = bidAmount;
    }

    // Завершить аукцион — может вызвать любой после окончания времени
    receive(msg: Finalize) {
        require(self.active, "No active auction");
        require(now() >= self.endTime, "Auction not ended yet");

        self.active = false;
        self.finalized = true;

        // Отправить TON владельцу, оставить 0.05 TON на хранение контракта
        let reserve: Int = ton("0.05");
        if (self.highestBid > reserve) {
            send(SendParameters{
                to: self.owner,
                value: self.highestBid - reserve,
                mode: SendIgnoreErrors,
                body: "Auction proceeds".asComment()
            });
        }
    }

    // Текущее состояние аукциона
    get fun state(): AuctionState {
        return AuctionState{
            active: self.active,
            finalized: self.finalized,
            minBid: self.minBid,
            endTime: self.endTime,
            highestBidder: self.highestBidder,
            highestBid: self.highestBid
        };
    }

    // Адрес победителя (null если аукцион не завершён)
    get fun winner(): Address? {
        if (self.finalized) {
            return self.highestBidder;
        }
        return null;
    }

    // Адрес владельца контракта
    get fun contractOwner(): Address {
        return self.owner;
    }
}
