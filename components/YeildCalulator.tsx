import React from 'react'

const YieldCalculator = () => {
  return (
    <div className="bg-gray-800/40 rounded-xl p-1 backdrop-blur-sm">
    <div className="bg-gray-800/60 rounded-lg p-6 h-full backdrop-blur-lg shadow-inner">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-5 mb-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white">BTC Yield Router</h3>
                <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 flex items-center">
                        <span className="h-2 w-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                        Live
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 flex items-center">
                        <span className="h-2 w-2 bg-blue-400 rounded-full mr-1 animate-pulse"></span>
                        AI Active
                    </span>
                </div>
            </div>
            <div className="flex justify-between mb-4" id="tvl-data">
                <div>
                    <p className="text-gray-400 text-xs">Total Value Locked</p>
                    <p className="text-xl font-medium text-white flex items-center">
                        <span id="tvl-value">1,246.5</span> BTC
                        <span className="text-green-400 text-xs ml-2">+0.8%</span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">Current APR</p>
                    <p className="text-xl font-medium text-green-400 flex items-center">
                        <span id="apr-value">8.74</span>%
                        <span className="text-green-400 text-xs ml-2">+0.3%</span>
                    </p>
                </div>
            </div>
            <div className="h-1 w-full bg-gray-700 rounded-full mb-1 overflow-hidden">
                <div
                    className="h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full w-[64%] transition-all duration-1000"
                    id="coredao-bar"
                ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
                <span
                    id="coredao-percentage"
                    className="hover:text-blue-300 cursor-pointer transition-colors"
                >
                    CoreDAO: 64%
                </span>
                <span
                    id="uniswap-percentage"
                    className="hover:text-blue-300 cursor-pointer transition-colors"
                >
                    Uniswap: 25%
                </span>
                <span
                    id="aave-percentage"
                    className="hover:text-blue-300 cursor-pointer transition-colors"
                >
                    Aave: 11%
                </span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-700">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                        Last updated: <span id="last-updated">Just now</span>
                    </span>
                    <button
                        className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors flex items-center"
                        id="refresh-data"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                            <polyline points="21 3 21 9 15 9"></polyline>
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
            <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 transition-all h-24 border border-gray-700 group">
                <span className="material-symbols-outlined text-3xl mb-2 text-blue-300 group-hover:text-blue-200 transition-colors">
                    security
                </span>
                <span className="text-sm text-white">Conservative</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 transition-all h-24 border border-blue-500/30 group">
                <span className="material-symbols-outlined text-3xl mb-2 text-blue-300 group-hover:text-blue-200 transition-colors">
                    balance
                </span>
                <span className="text-sm text-white">Balanced</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 transition-all h-24 border border-gray-700 group">
                <span className="material-symbols-outlined text-3xl mb-2 text-blue-300 group-hover:text-blue-200 transition-colors">
                    rocket_launch
                </span>
                <span className="text-sm text-white">Aggressive</span>
            </button>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white mb-3 font-medium">AI Prediction</h4>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-blue-900/50 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-blue-300"
                        >
                            <path d="M11 2v2.07A8.002 8.002 0 0 0 4.07 11H2v2h2.07A8.002 8.002 0 0 0 11 19.93V22h2v-2.07A8.002 8.002 0 0 0 19.93 13H22v-2h-2.07A8.002 8.002 0 0 0 13 4.07V2h-2zm2 4.08V8h-2V6.09c-2.5.41-4.5 2.41-4.9 4.91H8v2H6.09c.41 2.5 2.41 4.5 4.91 4.9V16h2v1.91c2.5-.41 4.5-2.41 4.9-4.91H16v-2h1.91c-.41-2.5-2.41-4.5-4.91-4.91zM12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                        </svg>
                    </div>
                    <span className="text-sm text-white">CoreDAO</span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-green-400 text-sm">+0.26%</span>
                    <span className="text-blue-300 text-sm">9.12% APR</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-teal-900/50 flex items-center justify-center">
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-teal-300"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18.875 0.068726C16.6395 -0.0626792 14.6799 0.945138 12.5 2.55302C10.3201 0.945138 8.36047 -0.0626792 6.125 0.068726C2.48301 0.296182 0 3.32783 0 7.5481V13.0303C0 17.1552 2.5293 20.2814 5.98047 20.6367C8.22699 20.8582 10.2344 19.859 12.5 18.1893C14.7656 19.859 16.773 20.8582 19.0195 20.6367C22.4707 20.2814 25 17.1552 25 13.0303V7.5481C25 3.32783 22.517 0.296182 18.875 0.068726ZM21.875 13.0303C21.875 15.6175 20.4492 17.4512 18.4961 17.6479C17.1777 17.7789 15.9037 17.0605 14.0625 15.6436V5.15137C15.9033 3.75464 17.1826 3.05187 18.5039 3.1833C20.4805 3.38187 21.875 5.20593 21.875 7.5481V13.0303ZM3.125 7.5481C3.125 5.20593 4.51953 3.38187 6.49609 3.1833C7.81738 3.05187 9.09668 3.75464 10.9375 5.15137V15.6436C9.09668 17.0605 7.82227 17.7789 6.50391 17.6479C4.55078 17.4512 3.125 15.6175 3.125 13.0303V7.5481Z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm text-white">Aave</span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-green-400 text-sm">+0.31%</span>
                    <span className="text-blue-300 text-sm">5.86% APR</span>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default YieldCalculator