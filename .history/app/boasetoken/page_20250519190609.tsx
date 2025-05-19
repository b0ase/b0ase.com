'use client';

import React from 'react';
import { FaBitcoin } from 'react-icons/fa6';
import { SiSolana, SiEthereum } from 'react-icons/si';

const BoaseTokenPage = () => {
  const tokenDetails = {
    name: '$BOASE',
    totalSupply: '1,000,000,000',
    description:
      'A versatile utility and governance token for the BOASE ecosystem. $BOASE can be issued, traded, and utilized across multiple blockchain networks, facilitating seamless interaction with BOASE services and platforms.',
    features: [
      'Cross-chain compatibility (Bitcoin SV, Solana, Ethereum, and more planned).',
      'Used for accessing premium features and services within BOASE projects.',
      'Governance rights for token holders in future DAO proposals.',
      'Staking rewards and incentives.',
      'Tradable on various decentralized and centralized exchanges (future plan).',
    ],
    networks: [
      {
        name: 'Bitcoin SV (BSV21)',
        Icon: FaBitcoin,
        status: 'Live',
        details: 'Currently active and tradable as a BSV21 standard token.',
        marketLink: 'https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1',
      },
      {
        name: 'Solana',
        Icon: SiSolana,
        status: 'Planned',
        details: 'Integration with the Solana network is in development to leverage its high throughput and low transaction fees.',
      },
      {
        name: 'Ethereum',
        Icon: SiEthereum,
        status: 'Planned',
        details: 'Deployment on the Ethereum network is planned to tap into its vast DeFi ecosystem and user base.',
      },
      // Add more networks as needed
    ],
    disclaimer:
      'The information provided on this page is for informational purposes only and does not constitute financial advice, an offer to sell, or a solicitation of an offer to buy any $BOASE tokens. The value of tokens can go down as well as up. Always do your own research (DYOR) before participating in any token sale or trading activities.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 dark:bg-gradient-to-b dark:from-gray-950 dark:via-black dark:to-gray-950 dark:text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white dark:text-white mb-4">
            {tokenDetails.name} Token
          </h1>
          <p className="text-xl text-sky-400 dark:text-sky-300">
            Total Supply: {tokenDetails.totalSupply}
          </p>
        </header>

        <section className="mb-12 bg-gray-900/70 p-6 rounded-lg shadow-xl border border-gray-700/50">
          <h2 className="text-3xl font-semibold text-white dark:text-white mb-4">About {tokenDetails.name}</h2>
          <p className="text-lg leading-relaxed text-gray-300 dark:text-gray-300 mb-6">
            {tokenDetails.description}
          </p>
          <h3 className="text-2xl font-semibold text-white dark:text-white mb-3">Key Features:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300 dark:text-gray-300">
            {tokenDetails.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-center text-white dark:text-white mb-8">
            Network Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tokenDetails.networks.map((network, index) => (
              <div
                key={index}
                className="bg-gray-800/70 p-6 rounded-lg shadow-lg border border-gray-700/50 flex flex-col items-center text-center transition-all duration-300 hover:shadow-sky-500/30 hover:border-sky-500/70"
              >
                <network.Icon className="w-16 h-16 mb-4 text-sky-400 dark:text-sky-300" />
                <h3 className="text-2xl font-semibold text-white dark:text-white mb-2">{network.name}</h3>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full mb-3 ${
                    network.status === 'Live'
                      ? 'bg-green-600/30 text-green-300 border border-green-500/50'
                      : 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/50'
                  }`}
                >
                  {network.status}
                </span>
                <p className="text-gray-400 dark:text-gray-400 text-sm mb-4 flex-grow">
                  {network.details}
                </p>
                {network.marketLink && (
                  <a
                    href={network.marketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-block px-6 py-2 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700 transition-colors shadow-md"
                  >
                    Trade on 1Sat Market
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 p-6 bg-gray-800/50 rounded-lg shadow-md border border-gray-700/30">
          <h2 className="text-2xl font-semibold text-amber-400 dark:text-amber-300 mb-3">Disclaimer</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {tokenDetails.disclaimer}
          </p>
        </section>
      </div>
    </div>
  );
};

export default BoaseTokenPage; 