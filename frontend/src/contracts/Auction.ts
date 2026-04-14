// @ts-nocheck
import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type StartAuction = {
    $$type: 'StartAuction';
    minBid: bigint;
    duration: bigint;
}

export function storeStartAuction(src: StartAuction) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3488201732, 32);
        b_0.storeCoins(src.minBid);
        b_0.storeUint(src.duration, 32);
    };
}

export function loadStartAuction(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3488201732) { throw Error('Invalid prefix'); }
    const _minBid = sc_0.loadCoins();
    const _duration = sc_0.loadUintBig(32);
    return { $$type: 'StartAuction' as const, minBid: _minBid, duration: _duration };
}

export function loadTupleStartAuction(source: TupleReader) {
    const _minBid = source.readBigNumber();
    const _duration = source.readBigNumber();
    return { $$type: 'StartAuction' as const, minBid: _minBid, duration: _duration };
}

export function loadGetterTupleStartAuction(source: TupleReader) {
    const _minBid = source.readBigNumber();
    const _duration = source.readBigNumber();
    return { $$type: 'StartAuction' as const, minBid: _minBid, duration: _duration };
}

export function storeTupleStartAuction(source: StartAuction) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.minBid);
    builder.writeNumber(source.duration);
    return builder.build();
}

export function dictValueParserStartAuction(): DictionaryValue<StartAuction> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStartAuction(src)).endCell());
        },
        parse: (src) => {
            return loadStartAuction(src.loadRef().beginParse());
        }
    }
}

export type PlaceBid = {
    $$type: 'PlaceBid';
}

export function storePlaceBid(src: PlaceBid) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(66, 32);
    };
}

export function loadPlaceBid(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 66) { throw Error('Invalid prefix'); }
    return { $$type: 'PlaceBid' as const };
}

export function loadTuplePlaceBid(source: TupleReader) {
    return { $$type: 'PlaceBid' as const };
}

export function loadGetterTuplePlaceBid(source: TupleReader) {
    return { $$type: 'PlaceBid' as const };
}

export function storeTuplePlaceBid(source: PlaceBid) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserPlaceBid(): DictionaryValue<PlaceBid> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePlaceBid(src)).endCell());
        },
        parse: (src) => {
            return loadPlaceBid(src.loadRef().beginParse());
        }
    }
}

export type Finalize = {
    $$type: 'Finalize';
}

export function storeFinalize(src: Finalize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(67, 32);
    };
}

export function loadFinalize(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 67) { throw Error('Invalid prefix'); }
    return { $$type: 'Finalize' as const };
}

export function loadTupleFinalize(source: TupleReader) {
    return { $$type: 'Finalize' as const };
}

export function loadGetterTupleFinalize(source: TupleReader) {
    return { $$type: 'Finalize' as const };
}

export function storeTupleFinalize(source: Finalize) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserFinalize(): DictionaryValue<Finalize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFinalize(src)).endCell());
        },
        parse: (src) => {
            return loadFinalize(src.loadRef().beginParse());
        }
    }
}

export type AuctionState = {
    $$type: 'AuctionState';
    active: boolean;
    finalized: boolean;
    minBid: bigint;
    endTime: bigint;
    highestBidder: Address;
    highestBid: bigint;
}

export function storeAuctionState(src: AuctionState) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.active);
        b_0.storeBit(src.finalized);
        b_0.storeCoins(src.minBid);
        b_0.storeUint(src.endTime, 32);
        b_0.storeAddress(src.highestBidder);
        b_0.storeCoins(src.highestBid);
    };
}

export function loadAuctionState(slice: Slice) {
    const sc_0 = slice;
    const _active = sc_0.loadBit();
    const _finalized = sc_0.loadBit();
    const _minBid = sc_0.loadCoins();
    const _endTime = sc_0.loadUintBig(32);
    const _highestBidder = sc_0.loadAddress();
    const _highestBid = sc_0.loadCoins();
    return { $$type: 'AuctionState' as const, active: _active, finalized: _finalized, minBid: _minBid, endTime: _endTime, highestBidder: _highestBidder, highestBid: _highestBid };
}

export function loadTupleAuctionState(source: TupleReader) {
    const _active = source.readBoolean();
    const _finalized = source.readBoolean();
    const _minBid = source.readBigNumber();
    const _endTime = source.readBigNumber();
    const _highestBidder = source.readAddress();
    const _highestBid = source.readBigNumber();
    return { $$type: 'AuctionState' as const, active: _active, finalized: _finalized, minBid: _minBid, endTime: _endTime, highestBidder: _highestBidder, highestBid: _highestBid };
}

export function loadGetterTupleAuctionState(source: TupleReader) {
    const _active = source.readBoolean();
    const _finalized = source.readBoolean();
    const _minBid = source.readBigNumber();
    const _endTime = source.readBigNumber();
    const _highestBidder = source.readAddress();
    const _highestBid = source.readBigNumber();
    return { $$type: 'AuctionState' as const, active: _active, finalized: _finalized, minBid: _minBid, endTime: _endTime, highestBidder: _highestBidder, highestBid: _highestBid };
}

export function storeTupleAuctionState(source: AuctionState) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.active);
    builder.writeBoolean(source.finalized);
    builder.writeNumber(source.minBid);
    builder.writeNumber(source.endTime);
    builder.writeAddress(source.highestBidder);
    builder.writeNumber(source.highestBid);
    return builder.build();
}

export function dictValueParserAuctionState(): DictionaryValue<AuctionState> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuctionState(src)).endCell());
        },
        parse: (src) => {
            return loadAuctionState(src.loadRef().beginParse());
        }
    }
}

export type Auction$Data = {
    $$type: 'Auction$Data';
    owner: Address;
    minBid: bigint;
    endTime: bigint;
    highestBidder: Address;
    highestBid: bigint;
    active: boolean;
    finalized: boolean;
}

export function storeAuction$Data(src: Auction$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeCoins(src.minBid);
        b_0.storeUint(src.endTime, 32);
        b_0.storeAddress(src.highestBidder);
        b_0.storeCoins(src.highestBid);
        b_0.storeBit(src.active);
        b_0.storeBit(src.finalized);
    };
}

export function loadAuction$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _minBid = sc_0.loadCoins();
    const _endTime = sc_0.loadUintBig(32);
    const _highestBidder = sc_0.loadAddress();
    const _highestBid = sc_0.loadCoins();
    const _active = sc_0.loadBit();
    const _finalized = sc_0.loadBit();
    return { $$type: 'Auction$Data' as const, owner: _owner, minBid: _minBid, endTime: _endTime, highestBidder: _highestBidder, highestBid: _highestBid, active: _active, finalized: _finalized };
}

export function loadTupleAuction$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _minBid = source.readBigNumber();
    const _endTime = source.readBigNumber();
    const _highestBidder = source.readAddress();
    const _highestBid = source.readBigNumber();
    const _active = source.readBoolean();
    const _finalized = source.readBoolean();
    return { $$type: 'Auction$Data' as const, owner: _owner, minBid: _minBid, endTime: _endTime, highestBidder: _highestBidder, highestBid: _highestBid, active: _active, finalized: _finalized };
}

export function loadGetterTupleAuction$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _minBid = source.readBigNumber();
    const _endTime = source.readBigNumber();
    const _highestBidder = source.readAddress();
    const _highestBid = source.readBigNumber();
    const _active = source.readBoolean();
    const _finalized = source.readBoolean();
    return { $$type: 'Auction$Data' as const, owner: _owner, minBid: _minBid, endTime: _endTime, highestBidder: _highestBidder, highestBid: _highestBid, active: _active, finalized: _finalized };
}

export function storeTupleAuction$Data(source: Auction$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.minBid);
    builder.writeNumber(source.endTime);
    builder.writeAddress(source.highestBidder);
    builder.writeNumber(source.highestBid);
    builder.writeBoolean(source.active);
    builder.writeBoolean(source.finalized);
    return builder.build();
}

export function dictValueParserAuction$Data(): DictionaryValue<Auction$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuction$Data(src)).endCell());
        },
        parse: (src) => {
            return loadAuction$Data(src.loadRef().beginParse());
        }
    }
}

 type Auction_init_args = {
    $$type: 'Auction_init_args';
}

function initAuction_init_args(src: Auction_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
    };
}

async function Auction_init() {
    const __code = Cell.fromHex('b5ee9c724102120100033600022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d90109020271020702014803050159b6b49da89a1a400031c25f481f401a63ff481f401a401a400aac0d82f3461f084e041f08442e0e1c5b678d8e30040002260159b5e2bda89a1a400031c25f481f401a63ff481f401a401a400aac0d82f3461f084e041f08442e0e1c5b678d8ed006000c5471055477650159bf6caf6a268690000c7097d207d00698ffd207d00690069002ab0360bcd187c2138107c2110b838716d9e3638c08000a209123e06d04d801d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e12fa40fa00d31ffa40fa00d200d20055606c179a30f8427020f842217070e208925f08e07027d74920c21f953107d31f08de218210cfe9bc04bae3023820c042e30220c043e302c00007c12117b00a0b0e1100ce10265f063301fa00d31f3082008aabf84224c705f2f482008c9204b314f2f48200e5d221c200f2f422c200f2e5f1f8235003a070227f70f842c8cf8508ce70cf0b6ec98042fb0010561023c87f01ca0055605067ce5004fa0212cb1fce01fa02ca00ca00c9ed5402fe3036820082b026f2f48200b788f82324b9f2f48200ee02f84226c705b3f2f4f8416f24135f0382009a3a5315bef2f48200848f5312bcf2f421c2008ebc7288103410245a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00926c21e2f8420c0d0022000000004f757462696420726566756e64004610461035443302c87f01ca0055605067ce5004fa0212cb1fce01fa02ca00ca00c9ed5402d0303636820082b05005f2f48200ac6bf82322bef2f4707f820afaf0805370bc8ebe5270a172882755205a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb009130e21046103510240f1000280000000041756374696f6e2070726f63656564730038c87f01ca0055605067ce5004fa0212cb1fce01fa02ca00ca00c9ed5400708e30f842c8cf8508ce70cf0b6ec98042fb0010465513c87f01ca0055605067ce5004fa0212cb1fce01fa02ca00ca00c9ed54e05f07f2c08256a96a0e');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initAuction_init_args({ $$type: 'Auction_init_args' })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const Auction_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    1521: { message: "Duration must be positive" },
    33456: { message: "No active auction" },
    33935: { message: "Must exceed current bid" },
    35499: { message: "Only owner" },
    35986: { message: "Auction already active" },
    39482: { message: "Below minimum bid" },
    44139: { message: "Auction not ended yet" },
    46984: { message: "Auction ended" },
    58834: { message: "Min bid must be positive" },
    60930: { message: "Owner cannot bid" },
} as const

export const Auction_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Duration must be positive": 1521,
    "No active auction": 33456,
    "Must exceed current bid": 33935,
    "Only owner": 35499,
    "Auction already active": 35986,
    "Below minimum bid": 39482,
    "Auction not ended yet": 44139,
    "Auction ended": 46984,
    "Min bid must be positive": 58834,
    "Owner cannot bid": 60930,
} as const

const Auction_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"StartAuction","header":3488201732,"fields":[{"name":"minBid","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"duration","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"PlaceBid","header":66,"fields":[]},
    {"name":"Finalize","header":67,"fields":[]},
    {"name":"AuctionState","header":null,"fields":[{"name":"active","type":{"kind":"simple","type":"bool","optional":false}},{"name":"finalized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"minBid","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"highestBidder","type":{"kind":"simple","type":"address","optional":false}},{"name":"highestBid","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"Auction$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"minBid","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"highestBidder","type":{"kind":"simple","type":"address","optional":false}},{"name":"highestBid","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"active","type":{"kind":"simple","type":"bool","optional":false}},{"name":"finalized","type":{"kind":"simple","type":"bool","optional":false}}]},
]

const Auction_opcodes = {
    "StartAuction": 3488201732,
    "PlaceBid": 66,
    "Finalize": 67,
}

const Auction_getters: ABIGetter[] = [
    {"name":"state","methodId":77589,"arguments":[],"returnType":{"kind":"simple","type":"AuctionState","optional":false}},
    {"name":"winner","methodId":126357,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"contractOwner","methodId":71076,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const Auction_getterMapping: { [key: string]: string } = {
    'state': 'getState',
    'winner': 'getWinner',
    'contractOwner': 'getContractOwner',
}

const Auction_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"StartAuction"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PlaceBid"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Finalize"}},
]


export class Auction implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = Auction_errors_backward;
    public static readonly opcodes = Auction_opcodes;
    
    static async init() {
        return await Auction_init();
    }
    
    static async fromInit() {
        const __gen_init = await Auction_init();
        const address = contractAddress(0, __gen_init);
        return new Auction(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new Auction(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Auction_types,
        getters: Auction_getters,
        receivers: Auction_receivers,
        errors: Auction_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | StartAuction | PlaceBid | Finalize) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'StartAuction') {
            body = beginCell().store(storeStartAuction(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'PlaceBid') {
            body = beginCell().store(storePlaceBid(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Finalize') {
            body = beginCell().store(storeFinalize(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getState(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('state', builder.build())).stack;
        const result = loadGetterTupleAuctionState(source);
        return result;
    }
    
    async getWinner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('winner', builder.build())).stack;
        const result = source.readAddressOpt();
        return result;
    }
    
    async getContractOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('contractOwner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
}