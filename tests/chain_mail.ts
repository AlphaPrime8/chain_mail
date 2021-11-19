import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ChainMail } from '../target/types/chain_mail';

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

    // const tx1 = await program.rpc.openCandidateRegistration({
    //   accounts: {
    //     stateAccount: stateAccount.publicKey,
    //   }
    // });
    // console.log("Your transaction 1 signature", tx1);
    //
    // const tx2 = await program.rpc.registerCandidate({});
    // console.log("Your transaction 2 signature", tx2);
    //
    // const tx3 = await program.rpc.unregisterCandidate({});
    // console.log("Your transaction 3 signature", tx3);
    //
    // const tx4 = await program.rpc.closeCandidateRegistration({
    //   accounts: {
    //     stateAccount: stateAccount.publicKey,
    //   }
    // });
    // console.log("Your transaction 4 signature", tx4);

  });
});
