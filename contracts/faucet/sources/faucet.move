module faucet::faucet;

use sui::coin;
use sui::sui::SUI;
use sui::dynamic_field as df;
use sui::balance;

const TRANSFER_AMOUNT: u64 = 1000;
const EAlreadyClaimed: u64 = 1;

#[test_only]
use sui::test_scenario as ts;

public struct Faucet has key {
    id: UID,
    balance: balance::Balance<SUI>,
}

fun init(ctx: &mut TxContext) {
    let faucet = Faucet {id: object::new(ctx), balance: balance::zero<SUI>()};
    transfer::share_object(faucet);
}

public entry fun top_up_faucet (faucet: &mut Faucet, coin: coin::Coin<SUI>) {
    let add_balance = coin::into_balance(coin);
    balance::join(&mut faucet.balance, add_balance);
}

public entry fun get_tokes(faucet: &mut Faucet, ctx: &mut TxContext) {
    assert!(balance::value(&faucet.balance) >= TRANSFER_AMOUNT);
    assert!(!df::exists_(&faucet.id, ctx.sender()), EAlreadyClaimed);

    let subtract_balance = balance::split(&mut faucet.balance, TRANSFER_AMOUNT);
    let new_coin = coin::from_balance<sui::sui::SUI>(subtract_balance, ctx);
    transfer::public_transfer(new_coin, ctx.sender());
 
    df::add(&mut faucet.id, ctx.sender(), true);
}

public fun balance(faucet: &Faucet): u64 {
    balance::value(&faucet.balance)
}

#[test_only]
public fun init_for_test(ctx: &mut TxContext) {
    init(ctx);
}

#[test]
fun faucet_test() {
    let addr = @0xA;

    let mut scenario = ts::begin(addr);
    {
        init_for_test(ts::ctx(&mut scenario));
    };

    ts::next_tx(&mut scenario, addr);
    {
        let init_tokens = coin::mint_for_testing<SUI>(3000, ts::ctx(&mut scenario));

        let mut faucet = ts::take_shared<Faucet>(&scenario);
        assert!(faucet.balance() == 0);

        top_up_faucet(&mut faucet, init_tokens);

        assert!(faucet.balance() == 3000);

        ts::return_shared(faucet);
    };

    ts::next_tx(&mut scenario, addr);
    {
        let mut faucet = ts::take_shared<Faucet>(&scenario);
        get_tokes(&mut faucet, ts::ctx(&mut scenario));

        assert!(faucet.balance() == 2000);

        ts::return_shared(faucet);
    };

    ts::next_tx(&mut scenario, addr);
    {
        let received_coin = ts::take_from_sender<coin::Coin<SUI>>(&scenario);
        assert!(coin::value(&received_coin) == TRANSFER_AMOUNT);

        coin::burn_for_testing(received_coin);
    };


    ts::end(scenario);
}

#[test, expected_failure(abort_code = EAlreadyClaimed)]
fun faucet_test_fail() {
    let addr = @0xA;

    let mut scenario = ts::begin(addr);
    {
        init_for_test(ts::ctx(&mut scenario));
    };

    ts::next_tx(&mut scenario, addr);
    {
        let init_tokens = coin::mint_for_testing<SUI>(3000, ts::ctx(&mut scenario));

        let mut faucet = ts::take_shared<Faucet>(&scenario);
        assert!(faucet.balance() == 0);

        top_up_faucet(&mut faucet, init_tokens);

        assert!(faucet.balance() == 3000);

        ts::return_shared(faucet);
    };

    ts::next_tx(&mut scenario, addr);
    {
        let mut faucet = ts::take_shared<Faucet>(&scenario);
        get_tokes(&mut faucet, ts::ctx(&mut scenario));
        get_tokes(&mut faucet, ts::ctx(&mut scenario));

        assert!(faucet.balance() == 2000);

        ts::return_shared(faucet);
    };

    ts::next_tx(&mut scenario, addr);
    {
        let received_coin = ts::take_from_sender<coin::Coin<SUI>>(&scenario);
        assert!(coin::value(&received_coin) == TRANSFER_AMOUNT);

        coin::burn_for_testing(received_coin);
    };

    ts::end(scenario);
}

