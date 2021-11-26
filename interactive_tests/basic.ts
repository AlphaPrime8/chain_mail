// Read the generated IDL.
import {Keypair} from "@solana/web3.js";
import {Provider, Wallet, web3} from "@project-serum/anchor";
const prompt = require('prompt-sync')();
import * as anchor from "@project-serum/anchor";
let idl = JSON.parse(require('fs').readFileSync('./target/idl/chain_mail.json', 'utf8'));

let program_id = '7UyzMpfjUUNVzU8Wzi11DhzBmoK7XG6dBvwpwfVerPAx';
idl.metadata.address = program_id
console.log("got idl program_id %s", idl.metadata.address);

const programId = new anchor.web3.PublicKey(program_id);
// const programId = new anchor.web3.PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
const localKeypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(require("fs").readFileSync("/home/myware/.config/solana/id.json", {encoding: "utf-8",}))));
let wallet = new Wallet(localKeypair);
let opts = Provider.defaultOptions();
let connection = new web3.Connection("http://localhost:8899", opts.preflightCommitment);
let provider = new Provider(connection, wallet, opts);
const program = new anchor.Program(idl, programId, provider);

console.log('loaded program... and local wallet: %s', localKeypair.publicKey.toString());
console.log("ProgramID: %s == program.program_id: %s", programId.toString(), program.programId.toString());


// Execute the RPC.
// async function run_test_1() {
//
//     const tx0 = await program.rpc.registerAsCandidate(
//         {
//             accounts: {
//                 systemProgram: anchor.web3.SystemProgram.programId,
//             },
//         });
//     console.log("Empy instruction test pass with txid: ", tx0);
// }

// async function run_test_1() {
//
//     let voteName = "test_ido";
//     function VoteBumps() {
//         this.stateAccount;
//     };
//     let bumps = new VoteBumps()
//
//     const [stateAccount, stateAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
//         [Buffer.from(voteName)],
//         program.programId
//     );
//     bumps.stateAccount = stateAccountBump;
//
//     console.log("Got state account address: %s and bump: %s", stateAccount.toString(), stateAccountBump);
//
//     const tx0 = await program.rpc.initialize(
//         voteName,
//         bumps,
//         {
//             accounts: {
//                 stateAccount: stateAccount,
//                 user: localKeypair.publicKey,
//                 systemProgram: anchor.web3.SystemProgram.programId,
//             },
//         });
//
//     console.log("Got tx id {}", tx0);
// }

async function run_test_1() {

    let voteName = "test_ido";
    function VoteBumps() {
        this.stateAccount;
    };
    let bumps = new VoteBumps()

    const [stateAccount, stateAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(voteName)],
        program.programId
    );
    bumps.stateAccount = stateAccountBump;

    console.log("Got state account address: %s and bump: %s", stateAccount.toString(), stateAccountBump);

    const tx0 = await program.rpc.openRegistration(
        {
            accounts: {
                stateAccount: stateAccount,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
        });

    console.log("Got tx id {}", tx0);
}

run_test_1()
    .then(value => {
        console.log("success with value: {}", value);
    })
    .catch(err => {
        console.error("got err: {}", err);
    });

// let response = prompt('Ok we got transaction...continue? ');
// console.log(`Ok... ${response}`);





