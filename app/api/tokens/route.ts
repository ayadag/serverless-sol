import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {

    try {
      const searchParams = await req.nextUrl.searchParams;

      const listType = searchParams.get('listType');
      const page: number = Number(searchParams.get('page'));
      const perPage: number = Number(searchParams.get('perPage'));

      if(!listType || !page || !perPage){
        return new NextResponse(JSON.stringify({ success: false, error: '!listType || !page || !perPage)'}), {
                  status: 500,
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  },
        });
      }
      
      const tokensM = await Tokens(listType, page, perPage);

      const data = tokensM;

      return new NextResponse(JSON.stringify({ success: true, data }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
      });

    
    } catch (error) {
      console.log("Error: ", error)
      return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message as string }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
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


async function Tokens(listType: string, page: number, perPage: number) {
  // const tokensList = await getTokenList('strict');
  // const tokens = await getTokenList('all');
  // console.log('tokens: ', tokensList)
  const tokensList = await getTokenList(listType);
  if(!tokensList){return console.error('!tokenList')}
  const tokens = tokensList.slice((page-1)*perPage, page*perPage);
  // console.log('tokens: ', tokens)
  return tokens
}

async function getTokenList(list: string) {
  // let listType: 'strict' | 'all';
  // if (list == 'strict'){
  //     listType = 'strict'
  // } else if (list == 'all'){
  //     listType = 'all'
  // }
  // const listType = getListType(`${list}`);
  const listType = getListType(list);
  if(!listType){return console.error('!listType');
  }
  try{
    const tList: [] = await ( await fetch (
      //   `https://token.jup.ag/strict` //strict
        // `https://token.jup.ag/all` //all
        `https://token.jup.ag/${listType}`
      )
    ).json();
    // setTTokenList(tList);
  //   setTokenList(tList); 
    // setTokenList(tList.splice(0,10));  //splice(0,10) to take gest the first ten idems.
  //   console.log('tokenList: ',tokenList);
  // console.log('tList: ', tList)
  return tList;
  } catch(e) {return console.error('can not get tokens', e)}
}

function getListType(list:string) {
  let listType: 'strict' | 'all';
  if (list == 'strict'){
      return listType = 'strict'
  } else if (list == 'all'){
      return listType = 'all'
  }
}