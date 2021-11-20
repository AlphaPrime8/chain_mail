import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ChainMail } from '../target/types/chain_mail';
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as assert from "assert";

describe('chain_mail', () => {

  // Configure the client to use the local cluster.
  // anchor.setProvider(anchor.Provider.env());
  const provider = anchor.Provider.local();

  // setup state account
  const stateAccount = anchor.web3.Keypair.generate();

  const program = anchor.workspace.ChainMail as Program<ChainMail>;

  it('Is initialized!', async () => {

    const tx0 = await program.rpc.initialize({
      accounts: {
        stateAccount: stateAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [stateAccount],
    });

    console.log("Your transaction 0 signature", tx0);

  });
});
