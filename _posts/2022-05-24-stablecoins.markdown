---
layout: post
title:  "Stablecoins"
date:   2022-05-24 10:00:00 -0400
---
*I know with the great fall of UST, this post seems reactive. That's kind of true in that it sort of reinvigorated me to understand what the hell is going on, and to therefore write up some notes. But I've wanted to write about stablecoins for a while now. So here we go.*

*Thanks to Vidal for proofreading and giving me feedback.*

### What's a stablecoin?
Crypto assets are notoriously volatile. The most famous crypto asset is, of course, Bitcoin. Without smart contract functionality, Bitcoin was originally intended as a digital currency - a mechanism by which individual parties could directly transact with each other in a decentralized way. But the vision of Bitcoin being a widely accepted currency hasn't really caught on, and it's probably because Bitcoin, like almost all other crypto assets, is extremely volatile.

Here's a graph showing the volatility of Bitcoin over a two year period from May 2020 - May 2022:
<figure>
  <img src="../../../images/stablecoins/bitcoin_volatile.png" class="center">
  <figcaption align = "center">Source: CoinGecko</figcaption>
</figure>

Within just this two year period, the value of a Bitcoin swung from $10,000 up to $63,000, down to $30,000, up to $67,000, and back down to $28,000. That's called a roller coaster. A seller accepting Bitcoin payments would be signing up to ride this roller coaster (unless of course they immediately sell any Bitcoin they receive), and most sellers [understandably] have motion sickness 🤢.

An asset which aims to be used as a currency must not have such volatile value. A currency must have a relatively *stable* value. 

A **stablecoin** is a crypto asset that is designed to maintain a *stable* value over time.

### How can a stablecoin achieve stable value?
Stablecoins generally achieve stability by "pegging" their value to the value of some stable real-world asset. Most popular stablecoins peg themselves to the US dollar (USD). This means that they aim to maintain the following property: the value of 1 stablecoin is equal to the value of 1 USD. Assuming that the value of 1 USD remains stable[^1], the value of 1 stablecoin should then also remain stable. 

Now the question becomes: how can a stablecoin be disigned such that the value of 1 stablecoin equals (or remains very close to) the value of 1 USD?

There are three primary flavors of stablecoins, each with its own unique method of achieving this property:

1. Fiat-collateralized stablecoins
2. Crypto-collateralized stablecoins
3. Algorithmic stablecoins

Let's take a look at each of these three flavors, and explore how each of them maintains its peg. For each type of stablecoin, we'll examine a representative example. 

### Fiat-collateralized stablecoins
The idea here is simple: each stablecoin is backed 1:1 by a USD. For every stablecoin in circulation, there is actually a dollar stored in a reserve corresponding to that stablecoin. At any point in time, a stablecoin can be exchanged for a USD, and vice versa. There generally needs to be a central issuer that is responsible for holding the reserve funds and enabling deposits/withdrawals. 

#### Tether (USDT)
[Tether (USDT)](https://tether.to/) is the most popular fiat-collateralized stablecoin, with a market cap of over $75 billion (as of May 2022). Tether is maintained by the Hong Kong company Tether Limited. 

Tether initially launched on top of the Bitcoin blockchain[^2], but has since expanded to many blockchains, most notably Ethereum. This means that a user can obtain a representation of a USDT token on any of Tether's supported blockchains.

<figure>
  <img src="../../../images/stablecoins/usdt_flow.png" class="center">
  <figcaption align = "center">The flow of funds between USD and USDT</figcaption>
  <figcaption align = "center">[Source: Tether whitepaper]</figcaption>
</figure>

The above diagram shows the flow of funds managed by Tether Limited. The company is responsible for exchanging between USD and USDT:
  - USD to USDT (steps 1 & 2 in diagram):
    - Bob sends $$x$$ USD to Tether Limited's reserves
    - Tether Limited mints $$x$$ USDT and issues it to the Bob's address
  - USDT to USD (steps 4 & 5 in diagram):
    - Bob redeems $$x$$ USDT by sending it to a contract owned by Tether Limited (thus removing this amount of USDT from circulation)
    - Tether Limited sends $$x$$ USD from its reserves to Bob

Step 3 of the diagram demonstrates the utility of USDT (and stablecoins in general): once issued, it can be freely exchanged on-chain without the need of any 3rd-party facilitator.

In addition to being responsible for exchanges between USD and USDT, Tether Limited is also responsible for managing its fiat reserves. Tether Limited assures that the ratio of [USDT in circulation] to [USD in its reserves] is 1:1. Tether Limited exercises a mechanism to validate this called "Proof of Reserves"[^3].

The total amount of USDT in circulation across blockchains is publicly available: one can simply scan over all supported blockchains, compute the total amount of USDT minted, the total amount of USDT redeemed, and from these two values compute the total amount of USDT in circulation.

Tether Limited regularly publishes the balance of its reserve, comprised primarily of non-digital assets. It also hires 3rd party auditing companies to verify the published values. Tether Limited thus attempts to provide transparency into the assurance that USDT is backed sufficiently by USD. The below figure is the quarterly transparency report released by Tether Limited on March 31, 2022. It displays the breakdown of their reserve by asset type. 
<figure>
  <img src="../../../images/stablecoins/usdt_reserves.png" class="center">
  <figcaption align = "center">Tether's reported reserve breakdown as of March 31, 2022</figcaption>  
  <figcaption align = "center">[Source: <a href="https://tether.to/en/transparency/">Tether transparency report</a>]</figcaption>
</figure>

### Crypto-collateralized stablecoins
As the name suggests, these stablecoins maintain digital crypto assets (such as Bitcoin or Ether) as collateral. A major advantage of crypto-collateralized stablecoins is that they are decentralized: there is no off-chain centralized issuer required to manage reserves or perform exchanges. Rather, the notion of "issuer" is moved on-chain: the protocol is carried out by smart-contracts, rather than by a trusted centralized issuer. This results in transparency and trustlessness.

#### Dai
[Dai](https://makerdao.com/) is the most popular crypto-collateralized stablecoin, with a market cap of over $6 billion (as of May 2022). It is a project built and maintained by Maker DAO[^4].

Anyone can mint Dai by using Maker's Collateralized Debt Position (CDP) smart contracts. The easiest way to think of it is as a collateralized loan: a user deposits some Ether into a CDP contract (known as the "collateral"), and then takes out a loan in Dai (known as the "debt"). In order to gain back ownership of the collateral, the user needs to pay back the debt in Dai, along with an accruing interest fee ("stability fee"). If at any point in time the collateral drops in value such that it is no longer deemed sufficient, the position is liquidated: the collateral is sold on the open market to recover the outstanding debt. 

#### Over-collateralization
Maker enforces over-collateralization: the value of the collateral initially deposited must exceed the value of the debt withdrawn. 

Exactly *how* overly-collateralized a position must be is left as a parameter called the "liquidation ratio": this is the minimum collateral-to-debt ratio which must be maintained by a position in order to avoid liquidation. If the collateral-to-debt ratio of a position drops below the liquidation ratio, the position is liquidated.

This parameter varies per collateralization asset[^5]: more volatile assets will have higher liquidation ratios, while more stable assets will have lower liquidation ratios (although the liquidation ratio will always remain >1).

#### Liquidation
When a position's collateral-to-debt ratio falls below its liquidation ratio, a portion of the collateral is sold to recoup the debt, and any excess collateral (remember that the debt was *over*-collateralized) is returned to the original user who opened the position.

In an ideal world, this liquidation logic would be performed by the CDP contract itself. However, contracts cannot initiate transactions on Ethereum - only user accounts can initiate transactions. This means, unfortunately, that the CDP contract can't just "wake up" when the collateral's value drops below the liquidation ratio and initiate some corresponding actions. Any action needs to be initiated externally by a user.

The initiation of liquidations is therefore left (and incentivized) to be performed by external individual actors ("keepers"). A keeper scans through existing CDP contracts and find ones with insufficient collateral-to-debt ratios. Once such a contract is found, the keeper can submit a transaction initiate liquidation of the position.

Once liquidation is triggered by a keeper, an auction is performed to sell enough collateral to pay off the outstanding debt. The initial keeper that triggered the liquidation receives a percentage of the Dai raised from the liquidation auction. There is a flat fee for each trigger, as well as a fee proportional to the liquidated position's magnitude. These fees are [adjustable](https://makerdao.world/en/learn/governance/param-flat-kick-incentive/) [parameters](https://makerdao.world/en/learn/governance/param-proportional-kick-incentive/) within the protocol.

#### Example

Let's look at an example. Suppose Bob wants to use the ETH-A Vault, with the following parameters: *liquidationRatio*=150%, *stabilityFee*=2.5%, *liquidationFee*=2%, *flatKickIncentive*=10 Dai, *proportionalKickIncentive*=1%. Suppose the initial price of Ether is $40. 

Let's see how Bob can mint 100 Dai:
1. Bob creates a new CDP contract
2. Bob sends 5 Ether (worth $200) to the contract
3. Bob withdraws 100 Dai from the contract

Note that Bob's collateral-to-debt ratio is 200/100 = 200%, which is above the liquidation ratio of 150%. This means that Bob could withdraw even more Dai (133 in total) and still remain sufficiently collateralized. However, if Bob were to take out 133 Dai, his collateral-to-debt ratio would be [almost] exactly equal to the liquidation ratio of 150%, and even the slightest dip in Ether's price would cause it to drop below it and trigger a liquidation. In practice, collateral-to-debt ratios are much larger than the minimum liquidation ratio in order to provide a buffer for flucation in Ether's price.

After Bob withdraws 100 Dai from the contract, his collateral (5 Ether) is locked in the contract (he cannot withdraw it). To withdraw his collateral, Bob must first pay back the debt of 100 Dai plus the stability fee to the contract. 

Now let's suppose Bob, tired from minting Dai, falls asleep for 1 year. Upon waking up, there are two possible scenarios Bob could find himself in:

- Sad scenario 😞: at some point during the year of Bob's slumber, the price of Ether dropped below $30
  - When the price of Ether drops below $30, then the value of Bob's collateral falls below 5 * 30 = $150, causing the collateral-to-debt ratio to drop below the liquidation ratio of 150%.
  - Kim the Keeper spots that Bob's CDP contract has become insufficiently collateralized, and triggers a liquidation on Bob's position
    - Kim is rewarded a flat kick incentive of 10 Dai, plus a proportional kick incentive of 1% * 100 = 1 Dai
    - This kick incentive comes from the [System Surplus Buffer](https://makerdao.world/en/learn/governance/param-system-surplus-buffer/), which is a buffer of Dai built up from stability fees.
    - Note that in order for Keepers to be profitable, the total kick incentive must exceed the gas price of a trigger transaction.
  - Bob's collateral is seized by the protocol, and sold for Dai in a Dutch auction. The auction continues until enough Dai has been raised to cover the total outstanding debt (initial debt + liquidation penalty). In this case, Bob's Ether will be auctioned off until 100 + 2% * 100 = 102 Dai is raised. Assuming really efficient markets, the Ether will be auctioned off at a price of roughly $30, and so 102 / 30 = 3.4 Ether will be sold to cover the debt.
  - The remaining collateral is returned to Bob. In this case, 5 - 3.4 = 1.6 Ether is returned.
    - Bob initially started with 200 USD worth of Ether
    - He ends up with 1.6 * 30 = 48 USD worth of Ether and 100 Dai, which sums to a value of 148 USD.
- Happpy scenario 😊: throughout the entire year of slumber, the price of Ether remained above $30
  - Since the collateral-to-debt ratio remained above the liquidation ratio of 150%, the position was not liquidated, and Bob can recover his collateral if he desires:
    - Bob transfers 102.5 Dai to the CDP contract
      - This covers (a) the debt of 100 Dai, plus (b) the stability fee of 2.5% * 100 = 2.5 Dai.
    - Bob is now able to withdraw his original collateral of 5 Ether.

#### Additional safeguard mechanisms
Dai has two additional protection mechanisms to try and keep its peg to the dollar during extreme market conditions:
1. Target Rate Feedback Mechanism (TRFM)
  - The system has a notion of "target price," which is used primarily to calculate the collateral-to-debt ratio (the value of debt in USD is computed by *target price \* amount of Dai*). The target price is denominated in USD and is initially set to 1. 
  - The system also has a notion of "target rate," which determines the change in target price over time. It is initialized to 0, as the target price should remain stable.
    - In severe market conditions, the DAO can vote to adjust the target rate. Altering this parameter can serve to balance the supply/demand of Dai:
      - When target rate > 0
        - Individuals are incentivized to hold Dai since its value will increase over time, increasing demand
        - Dai becomes more expensive to generate from CDP contracts, decreasing supply
      - When target rate < 0
        - Individuals are disincentivized to hold Dai since its value will decrease over time, decreasing demand
        - Dai becomes cheaper to generate from CDP contracts, increasing supply
2. Global settlement
    - The notion of "global settlement" is basically a big red emergency eject button that can be pushed in case there is a catastrophic event (such as a hack or security breach).
      - There are a number of entities known as "global settlers" who, if enough of them vote to, can trigger global settlement. 
        - MakerDAO votes to maintain the list of entities who have this privilege.
    - Once global settlement is triggered, the entire system (including all CDP contracts, the current target price, and price feeds) is frozen.
    - Users can then claim the total amount of their frozen assets in the equivalent amount of Ether.
      - Users can exchange their Dai or their CDP contracts for an equivalent amount Ether
      - The value which they receive back is a function of 1) the target price of Dai, and 2) the price feed of Ether (both evaluated at the time when the global settlement was triggered)

### Algorithmic stablecoins
Unlike fiat-collateralized and crypto-collateralized stablecoins, algorithmic stablecoins do not rely on collateralized assets to maintain their value. The value of these stablecoins is maintained through algorithmic policies, such as an automatically self-regulating elastic monetary policy. 

#### UST
UST ~~is~~ was ([R.I.P.](https://www.coindesk.com/learn/the-fall-of-terra-a-timeline-of-the-meteoric-rise-and-crash-of-ust-and-luna/)) the latest and greatest algorithmic stablecoin project. At its peak, UST had a market cap of over $18 billion.

Powering UST, which is pegged to USD, is the Terra Protocol.[^6] The Terra Protocol runs on its own Proof of Stake (PoS) blockchain, on which miners stake in the chain's native token, Luna. 

Let's see how the Terra Protocol works.

#### Determining market price on-chain
The spirit of an algorithmic stablecoin is to monitor the price of the coin, and adjust policies automatically in order to drive the market price back towards its target value (the value of the peg). The first step of this process is how to determine the current market price of the coin. This is achieved in Terra by using an on-chain oracle mechanism.

Terra's on-chain oracle mechanism works as follows: 
- Miners submit votes on what the current value of UST is (denominated in USD).
- Every $$n$$ blocks, the votes are tallied, and the median is selected as the new price.
- Miners who voted within 1 standard deviation of the median are rewarded with some amount of UST. Miners who did not may be punished by having their stakes slashed.

This standard oracle mechansim allows the (approximated) market price of UST to be continuously updated and available on-chain. The same mechanism can be used to approximate the price of Luna.

#### Price correction mechanism
Next, we consider how the system reacts to price deviations. When the price of UST deviates from its peg of 1 USD, the system must react and push the price back towards 1 USD. 

This is achieved through a clever exchange mechanism between Luna and UST: 
- A user can send 1 UST to the system, and receive 1 USD worth of Luna.
- A user can send 1 USD worth of Luna to the system, and receive 1 UST.

[Note that the "1 USD worth of Luna" can be computed using the price oracles described above!]

When the price of UST deviates from 1 USD, the exchange mechanism enables arbitrage opportunities which serve to re-adjust the price back towards the peg:
- If the price of UST drops to $0.99, an arbitrager can exchange 1 UST for 1 USD worth of Luna
  - The arbitrager nets $0.01 of profit, while reducing the supply of UST, causing its price to increase.
- If the price of UST rises to $1.01, an arbitrager can exchange 1 USD worth of Luna for 1 UST
  - The arbitrager nets $0.01 of profit, while increasing the supppply of UST, causing its price to decrease.

With this exchange mechanism, one can in a sense understand UST to be "backed by" Luna. An individual with 1 UST should always be able to exchange it for 1 USD worth of Luna, and sell that Luna. 

#### Downfall
Despite these clever exchange mechanics, UST eventually met the same fate as all algorithmic stablecoins that came before: it collapsed.

<figure>
  <img src="../../../images/stablecoins/ust_graph.png" class="center">
  <figcaption align = "center">UST fell from its $1 peg in May 2022</figcaption>
  <figcaption align = "center">[Source: CoinGecko]</figcaption>
</figure>

What happened? Doesn't the exchange mechanism incentivize arbitragers to readjust the price?

Things started to go south on May 9, when some big whales[^7] sold large quantities of UST on Curve[^8]. This caused the price of UST to fall relative to other stablecoins, knocking it off of its peg. 

Once knocked below its peg, UST holders became fearful that it would keep dropping - they wanted to get out before the house came down. They rushed to redeem their $$x$$ UST for $$x$$ USD worth of Luna, and then sold this Luna on DEXs. This caused DEXs to be flooded with fresh Luna supply, devaluing the price of Luna. This market devaluation of Luna makes it so that future UST redemptions require the minting of even more Luna, and one can see how the vicious cycle of hyperinflation is born. 

<figure>
  <img src="../../../images/stablecoins/luna_supply.png" class="center">
  <figcaption align = "center">From 5/10 to 5/13, Luna supply increased over 18,000%</figcaption>
  <figcaption align = "center">[Source: <a href="https://twitter.com/MaxInvestor89/status/1524990394747998208">TerraScope</a>]</figcaption>
</figure>

<figure>
  <img src="../../../images/stablecoins/luna_graph.png" class="center">
  <figcaption align = "center">Luna's value fell as its supply increased</figcaption>
  <figcaption align = "center">[Source: CoinGecko]</figcaption>
</figure>

With Luna being completely devalued, Terra's PoS chain (on which UST-Luna exchanges are performed) became vulnerable to attack (since stake is measured in absolute number of Luna tokens), and was eventually [halted](https://twitter.com/terra_money/status/1524935730308456448). As the chain came screeching to a halt, so too did the Luna-UST exchange mechanism, and any hope of recovery. 

In the end, the Terra Protocol's clever exchange mechanism was not enough to withstand sustained UST selling pressure.

#### Is an algorithmic stablecoin possible?
For those who have been in the crypto space for a while, UST's collapse did not come as a surprise. There have been [many](https://medium.com/reserve-currency/the-end-of-a-stablecoin-the-case-of-nubits-dd1f0fb427a9) [historical](https://www.coindesk.com/markets/2021/06/17/iron-finances-titan-token-falls-to-near-zero-in-defi-panic-selling/) [attempts](https://www.coindesk.com/tech/2022/05/11/usts-do-kwon-was-behind-earlier-failed-stablecoin-ex-terra-colleagues-say/) at creating an algorithmic stablecoin, and none have stood the test of time. UST is the latest, and by far the largest, of these failed tries.

The continued failures of algorithmic stablecoins poses a natural question: is a long-term algorithmic stablecoin possible? My intuition says no: I think that a stablecoin must be backed by "real" collateral (not some made up/correlated token like Luna) in order to be robust to fear-induced death spirals. Holders should be able to logically justify their confidence in the value of the asset, even in the wake of doubt and fear. This assured "real" value provides the robustness necessary to withstand the Wild West warzone of DeFi. 

That's my intuition, but I am of course not sure. I think it could be an interesting research direction to try and prove such an intuition formally.  

## Recap
Stablecoins are set to play an important role in the crypto ecosystem. Their maturity seems to be key in enabling large-scale adoption of decentralized payments. 

We've studied the mechanics of all 3 flavors of stablecoins.[^9] Each flavor has its own unique set of pros and cons. Let's do a quick recap:

1. **Fiat-collateralized stablecoins** are backed 1-to-1 by real (off-chain) reserves. An individual is able to trade 1 stablecoin for 1 unit of the fiat currency, and vice versa. A 3rd party custodian is responsible for executing these exchanges, and is also responsible for maintaining the 1-to-1 ratio between stablecoins and its reserves.
- 👍 Simplest to understand
- 👍 Robust to volatile crypto market conditions
- 👎 Requires trust in 3rd party custodian
2. **Crypto-collateralized stablecoins** are backed by crypto assets. To offset the volatility of crypto assets, these stablecoins are over-collateralized. 
- 👍 Trustless (entire protocol is transparently on-chain)
- 👎 Vulnerable to price volatility (positions subject to liquidation)
- 👎 Inefficient use of capital (requires over-collateralization)
- 👎 Complex, difficult to understand
3. **Algorithmic stablecoins** are not backed by collateral. Instead, their peg is maintained by algorithmic policy. 
- 👍 Trustless (entire protocol is transparently on-chain)
- 👍 Efficient (no collateral)
- 👎 Vulnerable to crashes
- 🦄 An ideal which doesn't really exist (yet?)

## Sources
- [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf) - Satoshi Nakamoto
- [The Search for a Stable Cryptocurrency](https://blog.ethereum.org/2014/11/11/search-stable-cryptocurrency/) - Vitalik Buterin
- [What Are Stablecoins?](https://www.gemini.com/cryptopedia/what-are-stablecoins-how-do-they-work) - Cryptopedia team
- [Stablecoins: designing a price-stable cryptocurrency](https://haseebq.com/stablecoins-designing-a-price-stable-cryptocurrency/) - Haseeb Qureshi
- [Tether: Fiat currencies on the Bitcoin blockchain](https://assets.ctfassets.net/vyse88cgwfbl/5UWgHMvz071t2Cq5yTw5vi/c9798ea8db99311bf90ebe0810938b01/TetherWhitePaper.pdf) - Tether team
- [The Dai Stablecoin System](https://makerdao.com/whitepaper/Dai-Whitepaper-Dec17-en.pdf) - Maker team
- [MakerDAO - Liquidation](https://youtu.be/O6Zu0Fgjsfo) - Campbell Harvey
- [MakerDAO Auction Keeper](https://youtu.be/3sUfu6ayozY) - Petru Catana
- [Terra Money: Stability and Adoption](https://assets.website-files.com/611153e7af981472d8da199c/618b02d13e938ae1f8ad1e45_Terra_White_paper.pdf) - Do Kwon et. al.
- [The Reign of Terra: The Rise and Fall of UST](https://medium.com/dragonfly-research/the-reign-of-terra-the-rise-and-fall-of-ust-208dabbc8e6e) - Haseeb Qureshi

## Footnotes
[^1]: There are of course issues with this assumption, as the value of 1 USD does indeed fluctuate. This is evidenced by yearly inflation, for example. There are some [projects](https://www.olympusdao.finance/) that view this as a problem, and try to maintain a "truly stable" currency. But, in general, the value of 1 USD is much more stable than the value of any other non-stablecoin digital asset, and is therefore a desirable target to peg against.
[^2]: Bitcoin does not natively support custom tokens, and therefore does not natively support USDT. Rather, USDT is built on [Omni Layer Protocol](https://www.omnilayer.org/), which is a protocol that sits on top of Bitcoin. Omni Layer Protocol represents custom tokens as metadata stored on the Bitcoin blockchain, and then provides a mechanism to interact with the data. This kind of functionality to operate over custom tokens is natively built into more modern blockchains such as Ethereum.
[^3]: As a math guy, this name really bothers me. The term "proof" should be reserved for arguments which are undoubtedly correct. Tether's "Proof of Reserves" certainly has room for doubt.
[^4]: "DAO" stands for "Decentralized Autonomous Organization", and is an exciting concept enabled by blockchain technology. The basic idea is captured by its name: it is an organization which is 1) composed of individuals, 2) owned by no one individual/entity, and 3) capable of making decisions and performing actions.
[^5]: Actually, liquidation ratios are not *exclusively* determined by an asset's volatility. It also depends on the values of other risk parameters. For a given asset, there can be different Maker Vaults with differrent mixes of risk parameters. For example, there may be two Vaults for Ether, one with a collateralization ratio of 145% and a stability fee of 2.25%, and the other with a collateralization ratio of 170% and stability fee of 0.50%. See [Block Analitica](https://maker.blockanalitica.com/vaults/) to explore current Maker Vault parameters. 
[^6]: The Terra Protocol actually supports stablecoins pegged to various different national currencies (not just the USD), all sharing underlying liquidity. For simplicity, we will focus just on UST, Terra's stablecoin pegged to USD.
[^7]: "Whale" is a term in trading that refers to a trader with a lot of capital. Big whales can make big splashes with a flap of the tail: their trades can move the market.
[^8]: Curve is an decentralized exchange (DEX) specifically designed for trading combinations of tokens which have stable value relative to eachother (e.g. USDT/USDC/Dai, or ETH/stETH). 
[^9]: Note that not all stablecoins fit *strictly* into a single category. There are actually a couple recent "hybrid" projects ([FRAX](https://docs.frax.finance/), [Sperax USDs](https://docs.sperax.io/)) that blend the crypto-collateralized and algorithmic models. These stablecoins are partially (mostly) backed by crypto-collateral, and partially backed by a protocol token (like Luna). The ratio of these backings is parameterized and can shift over time. I think it's an interesting idea, and it will be interesting to keep an eye on these projects over the next couple of years. 