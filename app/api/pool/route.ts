import bs58 from 'bs58';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { Raydium } from '@raydium-io/raydium-sdk-v2';
import {
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';

// const SENDER_SECRET_KEY = process.env.SOLANA_SECRET_KEY //
//     ? new Uint8Array(process.env.SOLANA_SECRET_KEY.split(',').map(Number)) 
//     : new Uint8Array([]);

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {

    try {
      const searchParams = await req.nextUrl.searchParams;
      // const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>
      
      // try{ 
      //   const perPage = searchParams.get('perPage');
      //   console.log('perPage: ', perPage)
      // } catch (error) {
      //   return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message as string }), {
      //         status: 500,
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //   });
      // }

      // const page: number = Number(searchParams.get('page'));
      // const perPage: number = Number(searchParams.get('perPage'));
      const poolId: string | null = searchParams.get('poolId');

      if(!poolId){
        return new NextResponse(JSON.stringify({ success: false, error: '!poolId'}), {
                  status: 500,
                  headers: {
                    'Content-Type': 'application/json',
                  },
        });
      }
      // const poolsM: any[] = [];
      // const pools = await getProgramAccounts6(connection, 1, 2);
      // const pools = await getProgramAccounts6(connection, page, perPage);
      // for (let index = 0; index < pools.length; index++) {
      //   await fetchRpcPoolInfo(String(pools[index])).then(res => poolsM.push(res))
      // }

      // const data = poolsM;
      const data = await fetchRpcPoolInfo(poolId);
      // const data = {
      //   state: 'ok'
      // }
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

// async function getProgramAccounts6(connection: Connection, page: number, perPage: number) {
//   // const raydium = await initSdk();
//   const programId = new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo');

//   const accountsWithoutData = await connection.getProgramAccounts(
//     programId,
//     {
//       dataSlice: { offset: 0, length: 0 },
//       filters: [
//         {
//           dataSize: 637  //637 byte(s)
//         }
//       ]
//     }
//   )
  
//   const accountKeys = accountsWithoutData.map(account => account.pubkey)
//   // console.log('accountKeys: ', accountKeys)

//   const paginatedKeys = accountKeys.slice((page-1)*perPage, page*perPage)  //slect only first 5 accounts
 
//   return paginatedKeys
// }

const fetchRpcPoolInfo = async (pool1: string) => {
  const raydium = await initSdk()
  // SOL-RAY
  // const pool1 = '4y81XN75NGct6iUYkBp2ixQKtXdrQxxMVgFbFF9w5n4u'
  // const pool1 = 'HMa1rFjBY35jW6KvpLJf79XFsThSj1ZJBp8KoVe8nHkB'

  const res = await raydium.cpmm.getRpcPoolInfos([pool1])
  const programId = new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo');

  const pool1Info = res[pool1]

  // console.log('pool id: ', pool1)
  // console.log('SOL-RAY pool price:', pool1Info.poolPrice)
  // // console.log('cpmm pool infos:', res)
  // console.log('SOL-SALD pool poolCreator:', `${pool1Info.poolCreator}`) //poolCreator:
  // console.log('pool1Info.mintA, pool1Info.mintB, pool1Info.mintLp :', 
  //   `${pool1Info.mintA}`, 
  //   `${pool1Info.mintB}`, 
  //   `${pool1Info.mintLp}`
  // )

  const poolInfo = {
    poolId: pool1,
    // programId: `${programId}`,
    programId: String(programId),  //Or
    poolCreator: `${pool1Info.poolCreator}`,
    configId: `${pool1Info.configId}`,
    mintA: `${pool1Info.mintA}`,
    mintProgramA: `${pool1Info.mintProgramA}`,
    vaultA: `${pool1Info.vaultA}`,
    mintB: `${pool1Info.mintB}`,
    mintProgramB: `${pool1Info.mintProgramB}`,
    vaultB: `${pool1Info.vaultB}`,
    bump: pool1Info.bump,
    status: pool1Info.status,
    lpAmount: Number(pool1Info.lpAmount),
    openTime: Number(pool1Info.openTime),
    poolPrice: pool1Info.poolPrice,
  }

  // console.log('poolInfo: ', poolInfo)
  return poolInfo
}

const initSdk = async (params?: { loadToken?: boolean }) => {
  const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>
  const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")));
  let raydium: Raydium | undefined
  if (raydium) return raydium
  raydium = await Raydium.load({
    owner,
    connection,
    cluster: 'devnet', // 'mainnet' | 'devnet'
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
    blockhashCommitment: 'finalized',
    // urlConfigs: {
    //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
    // },
  })

  /**
   * By default: sdk will automatically fetch token account data when need it or any sol balace changed.
   * if you want to handle token account by yourself, set token account data after init sdk
   * code below shows how to do it.
   * note: after call raydium.account.updateTokenAccount, raydium will not automatically fetch token account
   */

  /*  
  raydium.account.updateTokenAccount(await fetchTokenAccountData())
  connection.onAccountChange(owner.publicKey, async () => {
    raydium!.account.updateTokenAccount(await fetchTokenAccountData())
  })
  */

  return raydium
}


// pool1Info:  {
//   configId: PublicKey [PublicKey(Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK)] {
//     _bn: <BN: af3a14a67c821b7cb2e2524481c7e0002f4d14b5c963983ad573a20ec9c76d34>
//   },
//   poolCreator: PublicKey [PublicKey(hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus)] {
//     _bn: <BN: a4c7faa41f8f53a721ba8f242254fd88dcf79861b48b1556989baa82792af26>
//   },
//   vaultA: PublicKey [PublicKey(Hq3SerZ6uptsaKYiVuL5Xy61ARwm81sHjdByBr7WfKGx)] {
//     _bn: <BN: fa09a193b7faa2f997302f50cfa403bd4f1f57ea13ab80d31d48a7a79ff045e5>
//   },
//   vaultB: PublicKey [PublicKey(BBDBRP1KtJLssQYatYM6fyx4VmJG5YmWBi7365sJT9BG)] {
//     _bn: <BN: 973272edc8dc52c4e82a46a36a13e3d8b776ad2e1df2ca83787aafb5a253ba53>
//   },
//   mintLp: PublicKey [PublicKey(Fhs7bAXDrQa3XVTWjbaGDYLUKAMPC6ALTE4xFMkg9Thv)] {
//     _bn: <BN: da7b8351a7fee259ff846c14dc88f972ed6b2dc1a68394bb9e72bafffeaad87d>
//   },
//   mintA: PublicKey [PublicKey(So11111111111111111111111111111111111111112)] {
//     _bn: <BN: 69b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001>
//   },
//   mintB: PublicKey [PublicKey(Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb)] {
//     _bn: <BN: bfd59403f7b4900bf11b554ec83a635f7cae6fd3c0b317af42aaba3a0f0b772e>
//   },
//   mintProgramA: PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
//     _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
//   },
//   mintProgramB: PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
//     _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
//   },
//   observationId: PublicKey [PublicKey(BMybyajCy2U776QizNaNREtDHGHKccZvYV5G49J3DeVY)] {
//     _bn: <BN: 99f47c97cc3bf31b42808e0d43e9cc48e2cafbc3b0114a0b8550f1d6f2c870cb>
//   },
//   bump: 254,
//   status: 0,
//   lpDecimals: 9,
//   mintDecimalA: 9,
//   mintDecimalB: 9,
//   lpAmount: <BN: 64>,
//   protocolFeesMintA: <BN: 0>,
//   protocolFeesMintB: <BN: 0>,
//   fundFeesMintA: <BN: 0>,
//   fundFeesMintB: <BN: 0>,
//   openTime: <BN: 66880147>,
//   baseReserve: <BN: 1>,
//   quoteReserve: <BN: 2710>,
//   configInfo: undefined,
//   poolPrice: 10000
// }