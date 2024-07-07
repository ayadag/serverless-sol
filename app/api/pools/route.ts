import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// const SENDER_SECRET_KEY = process.env.SOLANA_SECRET_KEY 
//     ? new Uint8Array(process.env.SOLANA_SECRET_KEY.split(',').map(Number)) 
//     : new Uint8Array([]);

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {

    try {
      const searchParams = await req.nextUrl.searchParams;
      const perPage = searchParams.get('perPage');
      console.log('perPage: ', perPage)
      try{

      } catch (error) {
        return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message as string }), {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
        });
      }

      const data = {
        state: 'ok'
      }
      return new NextResponse(JSON.stringify({ success: true, data }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
      });

      // const { recipientAddress, amount } = await req.json();
      
      // try {
      //   new PublicKey(recipientAddress);
      // } catch (error) {
      //   return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message as string }), {
      //     status: 500,
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   });
      // }
      
      // const senderKeypair = Keypair.fromSecretKey(SENDER_SECRET_KEY);
      // const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      // const senderBalance = await connection.getBalance(senderKeypair.publicKey);
      
      // if (senderBalance < amount * LAMPORTS_PER_SOL) {
      //   return new NextResponse(JSON.stringify({ success: false, error: 'Insufficient balance' }), {
      //     status: 500,
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   });
      // }

      // const instructions: TransactionInstruction[] = [
      //   SystemProgram.transfer({
      //     fromPubkey: senderKeypair.publicKey,
      //     toPubkey: new PublicKey(recipientAddress),
      //     lamports: LAMPORTS_PER_SOL * amount,
      //   }),
      // ]

      // let latestBlockhash = await connection.getLatestBlockhash();

      // const messageV0 = new TransactionMessage({
      //   payerKey: senderKeypair.publicKey,
      //   recentBlockhash: latestBlockhash.blockhash,
      //   instructions,
      // }).compileToV0Message();

      // const transaction = new VersionedTransaction(messageV0);

      // transaction.sign([senderKeypair]);

      // const signature = await connection.sendTransaction(transaction, { maxRetries: 3})

      // const confirmation = await connection.confirmTransaction({
      //   signature,
      //   blockhash: latestBlockhash.blockhash,
      //   lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      // })

      // if (confirmation.value.err) {
      //   return new NextResponse(JSON.stringify({ success: false, error: confirmation.value.err }), {
      //     status: 500,
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   });
      // }
      
      // console.log("View tx on explorer:", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);

      // return new NextResponse(JSON.stringify({ success: true, signature }), {
      //   status: 200,
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
    
    } catch (error) {
      console.log("Error: ", error)
      return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message as string }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } else {
    return new NextResponse('Method Not Allowed', {
      status: 405,
      headers: {
        'Allow': 'GET',
      },
    });
  }
}
