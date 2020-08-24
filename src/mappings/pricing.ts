/* eslint-disable prefer-const */
import { Pair, Token, Bundle } from '../types/schema'
import { BigDecimal, Address, BigInt } from '@graphprotocol/graph-ts/index'
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD } from './helpers'

const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'
const USDC_ETH_PAIR = '0x61bb2fda13600c497272a8dd029313afdb125fd3' // created 10634677
const DAI_ETH_PAIR = '0x75116bd1ab4b0065b44e1a4ea9b4180a171406ed' // created block 10634917
const USDT_ETH_PAIR = '0xbeabef3fc02667d8bd3f702ae0bb2c4edb3640cc' // created block 10638158

// dummy for testing
export function getEthPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin

  let daiPair = Pair.load(DAI_ETH_PAIR) // dai is token1
  let usdcPair = Pair.load(USDC_ETH_PAIR) // usdc is token1
  let usdtPair = Pair.load(USDT_ETH_PAIR) // usdt is token1

  // all 3 have been created
  if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
    let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve0).plus(usdtPair.reserve0)
    let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH)
    let usdtWeight = usdtPair.reserve0.div(totalLiquidityETH)
    return daiPair.token1Price
      .times(daiWeight)
      .plus(usdcPair.token1Price.times(usdcWeight))
      .plus(usdtPair.token1Price.times(usdtWeight))
    // dai and USDC have been created
  } else if (daiPair !== null && usdcPair !== null) {
    let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve0)
    let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH)
    return daiPair.token1Price.times(daiWeight).plus(usdcPair.token1Price.times(usdcWeight))
    // USDC is the only pair so far
  } else if (usdcPair !== null) {
    return usdcPair.token1Price
  } else {
    return ZERO_BD
  }
}

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
   ETH_ADDRESS, // ETH
  '0x476c5e26a75bd202a9683ffd34359c0cc15be0ff', // SRM
  '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6', // sBTC
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', // YFI
  '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2', // MTA
  '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', // yCRV
  '0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7', // ACRO
  '0x0d438f3b5175bebc262bf23753c1e53d03432bde', // wNXM
  '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
  '0xd533a949740bb3306d119cc777fa900ba034cd52', // CRV
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  '0xb6ed7644c69416d67b522e20bc294a9a9b405b31',
  '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d',
  '0x737f98ac8ca59f2c68ad658e3c3d8c8963e40a4c',
  '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
  '0xcd62b1c403fa761baadfc74c525ce2b51780b184',
  '0x960b236a07cf122663c4303350609a66a7b288c0',
  '0x27054b13b1b798b345b591a4d22e6562d47ea75a',
  '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  '0x107c4504cd79c5d2696ea0030a8dd4e92601b82e',
  '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
  '0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd',
  '0x4f9254c83eb525f9fcf346490bbb3ed28a81c667',
  '0xf5dce57282a584d2746faf1593d3121fcac444dc',
  '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
  '0x39aa39c021dfbae8fac545936693ac917d5e7563',
  '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
  '0x06af07097c9eeb7fd685c692751d5c66db49c215',
  '0xc00e94cb662c3520282e6f5717214004a7f26888',
  '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  '0x0cf0ee63788a0849fe5297f3407f701e122cc023',
  '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a',
  '0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf',
  '0xc719d010b63e5bbf2c0551872cd5316ed26acd83',
  '0xc0f9bd5fa5698b6505f643900ffa515ea5df54a9',
  '0x86fadb80d8d2cff3c3680819e4da99c10232ba0f',
  '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
  '0x06f65b8cfcb13a9fe37d836fe9708da38ecb29b2',
  '0x4946fcea7c692606e8908002e55a582af44ac121',
  '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
  '0x4a57e687b9126435a9b19e4a802113e266adebde',
  '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
  '0x6810e776880c02933d47db1b9fc05908e5386b96', // GNO
  '0x12b19d3e2ccc14da04fae33e63652ce469b3f2fd',
  '0x0000000000b3f879cb30fe243b4dfee438691c04',
  '0xf1290473e210b2108a85237fbcd7b6eb42cc654f',
  '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
  '0x493c57c4763932315a328269e1adad09653b9081',
  '0x14094949152eddbfcd073717200da82fed8dc960',
  '0x6fb3e0a217407efff7ca062d46c26e5d60a14d69',
  '0x4cd988afbad37289baaf53c13e98e2bd46aaea8c',
  '0xdd974d5c2e2928dea5f71b9825b8b646686bd200', // KNC
  '0x514910771af9ca656af840dff83e8264ecf986ca',
  '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
  '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
  '0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0',
  '0x58b6a8a3302369daec383334672404ee733ab239',
  '0xd29f0b5b3f50b07fe9a9511f7d86f4f4bac3f8c4',
  '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  '0x8888889213dd4da823ebdd1e235b09590633c150',
  '0xd15ecdcf5ea68e3995b2d0527a0ae0a3258302f8',
  '0xa3d58c4e56fedcae3a7c43a725aee9a71f0ece4e',
  '0x80f222a749a2e18eb7f676d371f19ad7efeee3b7',
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // MKR
  '0xec67005c4e498ec7f55e092bd1d35cbc47c91892',
  '0x957c30ab0426e0c93cd8241e2c60392d08c6ac8e',
  '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
  '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206',
  '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
  '0x985dd3d42de1e256d09e1c10f112bccb8015ad41',
  '0x4575f41308ec1483f3d399aa9a2826d74da13deb',
  '0xd56dac73a4d6766464b38ec6d91eb45ce7457c44',
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
  '0x45804880de22913dafe09f4980848ece6ecbaf78',
  '0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d',
  '0x6758b7d441a9739b98552b373703d8d3d14f9e62',
  '0x687bfc3e73f6af55f0ccca8450114d107e781a0e',
  '0x4a220e6096b25eadb88358cb44068a3248254675',
  '0x99ea4db9ee77acd40b119bd1dc4e33e1c070b80d',
  '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
  '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6',
  '0x408e41876cccdc0f92210600ef50372656052a38', // REN
  '0x459086f2376525bdceba5bdda135e4e9d3fef5bf',
  '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
  '0x1c5db575e2ff833e46a2e9864c22f4b22e0b37c2',
  '0x1985365e9f78359a9b6ad760e32412f4a445e862',
  '0x9469d013805bffb7d3debe5e7839237e535ec483',
  '0x607f4c5bb672230e8672085532f7e901544a7375',
  '0xb4efd85c19999d84251304bda99e90b92300bd93',
  '0x4156d3342d5c385a87d264f90653733592000581',
  '0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098',
  '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb', // sETH
  '0x3a9fff453d50d4ac52a6890647b823379ba36b9e',
  '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  '0x23b608675a2b2fb1890d3abbd85c5775c51691d5',
  '0x42d6622dece394b54999fbd73d108123806f6a18',
  '0x0ae055097c6d159879521c384f1d2123d1f195e6',
  '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51', // sUSD
  '0x261efcdd24cea98652b9700800a13dfbca4103ff',
  '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
  '0x00006100f7090010005f1bd7ae6122c3c2cf0090',
  '0x00000100f2a2bd000715001920eb70d229700085',
  '0x00000000441378008ea67f4284a57932b1c000a5',
  '0x0000852600ceb001e08e00bc008be620d60031f2',
  '0xaaaf91d9b90df800df4f55c205fd6989c977e73a',
  '0x0ba45a8b5d5575935b8158a88c631e9f9c95a2e5',
  '0xcb94be6f13a1182e4a4b6140cb7bf2025d28e41b',
  '0x2c537e5624e4af88a7ae4060c022609376c8d0eb',
  '0x0000000000085d4780b73119b644ae5ecd22b376',
  '0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e',
  '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  '0xa4bdb11dc0a2bec88d24a3aa1e6bb17201112ebe',
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  '0xeb269732ab75a6fd61ea60b06fe994cd32a83549',
  '0x8f3470a7388c05ee4e7af3d01d8c722b0ff52374',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  '0x09fe5f0236f0ea5d930197dce254d77b04128075',
  '0xb4272071ecadd69d933adcd19ca99fe80664fc08',
  '0x0f7f961648ae6db43c75663ac7e5414eb79b5704',
  '0xe41d2489571d322189246dafa5ebde1f4699f498'
]


// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('400000')

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('2')

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == ETH_ADDRESS) {
    return ONE_BD
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.pools(Address.fromString(token.id), Address.fromString(WHITELIST[i]))
    if (pairAddress.toHexString() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHexString())
      if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        let token1 = Token.load(pair.token1)
        return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
      }
      if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        let token0 = Token.load(pair.token0)
        return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
      }
    }
  }
  return ZERO_BD // nothing was found return 0
}


/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
    let reserve0USD = pair.reserve0.times(price0)
    let reserve1USD = pair.reserve1.times(price1)
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0
      .times(price0)
      .plus(tokenAmount1.times(price1))
      .div(BigDecimal.fromString('2'))
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0)
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}
