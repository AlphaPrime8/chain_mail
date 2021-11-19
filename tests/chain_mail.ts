import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ChainMail } from '../target/types/chain_mail';

describe('chain_mail', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.ChainMail as Program<ChainMail>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
