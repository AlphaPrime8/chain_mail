import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ChainMail } from '../target/types/chain_mail';
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
      },
      signers: [stateAccount],
    });
    console.log("Your transaction 0 signature", tx0);
    // fetch newly created account
    const newStateAccount = await program.account.stateAccount.fetch(stateAccount.publicKey);
    assert.equal(newStateAccount.candidateRegistrationIsActive, false);
  });

  it('Opening candidate registration', async () => {
    const tx1 = await program.rpc.openCandidateRegistration({
      accounts: {
        stateAccount: stateAccount.publicKey,
      }
    });
    console.log("Your transaction 1 signature", tx1);

    // fetch newly created account
    const newStateAccount = await program.account.stateAccount.fetch(stateAccount.publicKey);
    assert.equal(newStateAccount.candidateRegistrationIsActive, true);
  });

  it('Closing candidate registration', async () => {
    const tx1 = await program.rpc.closeCandidateRegistration({
      accounts: {
        stateAccount: stateAccount.publicKey,
      }
    });
    console.log("Your transaction 2 signature", tx1);

    // fetch newly created account
    const newStateAccount = await program.account.stateAccount.fetch(stateAccount.publicKey);
    assert.equal(newStateAccount.candidateRegistrationIsActive, false);
  });

});
