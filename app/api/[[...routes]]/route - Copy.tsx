import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import type { Address } from 'viem';
import { arbitrum } from 'viem/chains'; // Ensure this import is correct
import { abi } from '../abi.ts'; // Ensure the path to your ABI is correct




// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }
const arbitrumChain = {
  id: 42161,
  name: 'Arbitrum One',
  network: 'arbitrum',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://arb1.arbitrum.io/rpc',
  },
  blockExplorers: {
    etherscan: { name: 'Arbiscan', url: 'https://arbiscan.io' },
    default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
  },
  testnet: false,
};

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
  return c.res({
    action: '/finish',
    image: (
      <div style={{ color: 'red', display: 'flex', fontSize: 60 }}>
        Perform a transaction
      </div>
    ),
    intents: [<Button.Transaction target="/mint">Mint</Button.Transaction>,<Button action="/showPlayerStatus">Status</Button>],
  })
})

app.frame('/finish', (c) => {
  const { transactionId } = c

  progressMarker = { ...progressMarker, inventorySlot1: 1 };
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
  const address = c.address as Address;

  console.log('address', address);
  return c.contract({
    abi,
    functionName: 'claim',
    args: [
      address, // _receiver
      1n, // _quantity
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // _currency
      0n, // _pricePerToken
      {
        proof: [], // _allowlistProof.proof
        quantityLimitPerWallet: 100n, // _allowlistProof.quantityLimitPerWallet
        pricePerToken: 0n, // _allowlistProof.pricePerToken
        currency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // _allowlistProof.currency
      }, // _allowlistProof
      '0x', // _data
    ],
    chainId: `eip155:${arbitrumChain.id}`,
    to: '0x0E4f27c36Bebd073695D7f544dC28065Bc066EcC',
  });
});




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
                    100
                </p>
            </div>
        ),
        intents: intents
    });
});










devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
