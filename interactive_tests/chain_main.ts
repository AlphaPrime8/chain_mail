import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ChainMail } from '../target/types/chain_mail';
const prompt = require('prompt-sync')();

let response = prompt('Its starting... proceed?');
console.log(`Ok... ${response}`);

const provider = anchor.Provider.local();
const program = anchor.workspace.ChainMail as Program<ChainMail>;
let voteName = "test_ido";

// init bump struct... might need to look in program?
let bumps = new VoteBumps()

async function run_test() {

    const [stateAccount, stateAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(voteName)],
        program.programId
    );
    bumps.stateAccount = stateAccountBump;

    const tx0 = await program.rpc.initialize(
        voteName,
        bumps,
        {
            accounts: {
                stateAccount: stateAccount,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
        });

    console.log("Got tx id {}", tx0);
    response = prompt('Ok we got transaction...continue? ');
    console.log(`Ok... ${response}`);
}

function VoteBumps() {
    this.stateAccount;
};

run_test();