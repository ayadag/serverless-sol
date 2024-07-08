import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import  web3  from '@solana/web3.js';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {

    try {
      const searchParams = await req.nextUrl.searchParams;

      const tokenId = searchParams.get('tokenId');

      if(!tokenId){
        return new NextResponse(JSON.stringify({ success: false, error: '!tokenId)'}), {
                  status: 500,
                  headers: {
                    'Content-Type': 'application/json',
                  },
        });
      }

      const data = await Token(tokenId);

      return new NextResponse(JSON.stringify({ success: true, data }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
      });

    
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


async function Token(tokenId: string) {
  // const token = new web3.PublicKey('So11111111111111111111111111111111111111112'); //SOL
  // const token = new web3.PublicKey('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb'); //SALD
  const token = new web3.PublicKey(tokenId); //SALD
  // const umi = createUmi('https://api.devnet.solana.com', 'processed')
  // Use the RPC endpoint of your choice.
  // const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())
  const umi = createUmi('https://api.devnet.solana.com')
  const mint = fromWeb3JsPublicKey(token);
  const asset = await fetchDigitalAsset(umi, mint) 
  // console.log('asset: ', asset);
  const tokenData = {
    publicKey: asset.publicKey,
    owner: asset.mint.header.owner,
    mintAuthority: asset.mint.mintAuthority,
    updateAuthority: asset.metadata.updateAuthority,
    name: asset.metadata.name,
    symbol: asset.metadata.symbol,
    uri: asset.metadata.uri,
    decimals: asset.mint.decimals,
    supply: asset.mint.supply,
    executable: asset.mint.header.executable,
  }
  // console.log('tokenData: ', tokenData)
  return tokenData
}