import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import type { Address } from 'viem';
import { baseSepolia } from 'viem/chains'
import { abi } from '../abi2.ts'; // Ensure the path to your ABI is correct



let player = {
  name: 'player',
  life: 50,
  timegated: 1,
  forgednumber: 0,
  timeremaining: "9000",
  specials: 1,
  tinkererbombactive: 0,
 
};
// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }


let progressMarker = {

  backButton:1,
  inventorySlot1: 0,
  inventorySlot2: 0,
  inventorySlot3: 0,
  
};

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
   //hub: pinata(),
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/', (c) => {
    let image;
    let intents;
    let randomNum;

    // Assuming player.forgednumber is defined somewhere in your code
    if (player.forgednumber > 0) {
        randomNum = 1; // Assign value without redeclaring
    } else {
        randomNum = 0; // Assign value without redeclaring
    }

    if (randomNum === 0) {
        // not minted yet
        image = 'https://gateway.pinata.cloud/ipfs/QmRoe4Td6MDh4r5geiXDeogUpzMz4Xa9mb5bgHAWXSchNq';
        intents = [
            <Button.Transaction key="mint" target="/mint">Mint</Button.Transaction>,
            <Button key="showPlayerStatus" action="/showPlayerStatus">Status</Button>
        ];
    } else {
        // minted already
        image = 'https://gateway.pinata.cloud/ipfs/QmVWkExkvZ5qBaSZDXPB8F914tTaLvEGXGhUSjK5rvGUrk';
        intents = [
            <Button key="showPlayerStatus" action="/showPlayerStatus">Status</Button>
        ];
    }

    return c.res({
        action: '/finish',
        image: image,
        intents: intents
    });
});





app.frame('/finish', (c) => {
  const { transactionId } = c
  player = { ...player, forgednumber: 1 };
  progressMarker = { ...progressMarker, inventorySlot2: 1 };
  return c.res({
    image: (
      <div style={{ color: 'red', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    ),
    intents: [<Button action="/showPlayerStatus">Status</Button>],
  })
})

app.transaction('/mint', (c) => {
  const address = c.address as Address

  console.log('address', address)
  return c.contract({
    abi,
    functionName: 'claim',
    args: [
      address,
      0n,
      1n,
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      0n,
      {
        proof: [],
        quantityLimitPerWallet: 100n,
        pricePerToken: 0n,
        currency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      },
      '0x',
    ],
    chainId: `eip155:${baseSepolia.id}`,
    to: '0x858ee7182907599100270328c7a76a2e062F6645',
  })
})




app.frame('/showPlayerStatus', (c) => {
    let image: string;
    let intents: JSX.Element[] = [];

    // Check the different combinations of inventory slots
    if (progressMarker.inventorySlot1 === 1 && progressMarker.inventorySlot2 === 1 && progressMarker.inventorySlot3 === 1) {
        image = 'https://gateway.pinata.cloud/ipfs/QmfNerwFzgrmxy6VijLGamzpdKubNaK42npPUaNxHSZurW';
    } else if (progressMarker.inventorySlot1 === 1 && progressMarker.inventorySlot2 === 0 && progressMarker.inventorySlot3 === 1) {
        image = 'https://gateway.pinata.cloud/ipfs/QmfSd5kndQoHDqGnzSocHAen1jbWy2d6W1M9PoFCFpVWsM';
    } else if (progressMarker.inventorySlot1 === 0 && progressMarker.inventorySlot2 === 1 && progressMarker.inventorySlot3 === 1) {
        image = 'https://gateway.pinata.cloud/ipfs/QmZn57vyWprfyEK9nbkbgAWUmsYyFT3JeTMsGG2RoRfP6Q';
    } else if (progressMarker.inventorySlot1 === 1 && progressMarker.inventorySlot2 === 1 && progressMarker.inventorySlot3 === 0) {
        image = 'https://gateway.pinata.cloud/ipfs/QmViozrZ1YHyNfMpPGCJQ5dus2wXrA8oxwJiFyYMGsdvTn';
    } else if (progressMarker.inventorySlot1 === 1 && progressMarker.inventorySlot2 === 0 && progressMarker.inventorySlot3 === 0) {
        image = 'https://gateway.pinata.cloud/ipfs/QmXMyuj3Nc6RYEbaHHwDtmFNmFCw4Rid6tunBGxjzyp9mx';
    } else if (progressMarker.inventorySlot1 === 0 && progressMarker.inventorySlot2 === 1 && progressMarker.inventorySlot3 === 0) {
        image = 'https://gateway.pinata.cloud/ipfs/QmWWiJuyKX2q7QopT3Ug8NtgRQdkvKZT3MvsrFPkmtuJM4';
    } else if (progressMarker.inventorySlot1 === 0 && progressMarker.inventorySlot2 === 0 && progressMarker.inventorySlot3 === 1) {
        image = 'https://gateway.pinata.cloud/ipfs/QmQEqpEiKjakiro1xudf6FwDxoWsf1z7SmiMeU25G36AuX';
    } else {
        // Default case where all inventory slots are 0 or any unexpected combination
        image = 'https://gateway.pinata.cloud/ipfs/QmatyUPpccdoYX9eELzF1ApFPNpkHoH4Dp8NAdCT7rfdjQ';
    }

    // Add buttons based on inventory slots
    if (progressMarker.inventorySlot1 === 1) {
        intents.push(<Button action="/mysticpotionused">Mystic Potion</Button>);
    }
    if (progressMarker.inventorySlot2 === 1) {
        intents.push(<Button action="/medickitused">Medic Kit</Button>);
    }
    if (progressMarker.inventorySlot3 === 1) {
        intents.push(<Button action="/tinkererbombused">Tinkerers Bomb</Button>);
    }
    if (progressMarker.backButton === 1) {
        intents.push(<Button action='/'>Close</Button>);
    }

    return c.res({
        image: (
            <div
                style={{
                    position: 'relative',  // Set the container to relative positioning
                    height: '100vh',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <img
                    src={image}
                    alt="Status Image"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',  // Ensure the image covers the entire container
                    }}
                />
                <p style={{ fontSize: '38px', margin: '0', marginTop: '-514px', color: 'green', textAlign: 'right', marginRight: '-892px', fontWeight: 'bold' }}>
                    {player.life}
                </p>
            </div>
        ),
        intents: intents
    });
});





app.frame('/mysticpotionused', (c) => {
   progressMarker = { ...progressMarker, inventorySlot1: 0 };
   
   player = { ...player, specials: player.specials += 1 };

  return c.res({

    
    image : 'https://gateway.pinata.cloud/ipfs/QmbQYZX8ZSvGYtb5ztiNxNJ18Qu22ndimkMH7wqBRz4mrQ',
  
    
    intents: [
     
      <Button action="/showPlayerStatus">Continue</Button>,
     
    ],
  }) 

});


app.frame('/medickitused', (c) => {
   progressMarker = { ...progressMarker, inventorySlot2: 0 };
   player.life += 50;

   if (player.life > 100) {
      player = { ...player, life: 100 };
    }


  return c.res({

    
    image : 'https://gateway.pinata.cloud/ipfs/QmXvqsvx2copXefucXBbkA3Z1yMYcTvobBc9ScbhemEQFJ',
  
    
    intents: [
     
      <Button action="/showPlayerStatus">Continue</Button>,
     
    ],
  }) 

});



app.frame('/tinkererbombused', (c) => {
   progressMarker = { ...progressMarker, inventorySlot3: 0 };
   player.tinkererbombactive += 1;

  return c.res({

    
    image : 'https://gateway.pinata.cloud/ipfs/QmXvqsvx2copXefucXBbkA3Z1yMYcTvobBc9ScbhemEQFJ',
  
    
    intents: [
     
      <Button action="/showPlayerStatus">Continue</Button>,
     
    ],
  }) 

});






devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
