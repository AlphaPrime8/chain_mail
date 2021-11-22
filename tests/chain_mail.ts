import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ChainMail } from '../target/types/chain_mail';
// import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import * as assert from "assert";

describe('chain_mail', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.local();
  const program = anchor.workspace.ChainMail as Program<ChainMail>;
  let voteName = "test_ido";

  it('Is initialized!', async () => {

    // init bump struct... might need to look in program?
    let bumps = new VoteBumps()

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
  });

  it('Opened registration!', async () => {
    const [stateAccount] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(voteName)],
        program.programId
    );

    const tx1 = await program.rpc.openRegistration({
      accounts: {
        stateAccount: stateAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    });



  });
});

function VoteBumps() {
  this.stateAccount;
};