const abi = {
	"compiler": {
		"version": "0.8.29+commit.ab55807c"
	},
	"language": "Solidity",
	"output": {
		"abi": [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "OwnableInvalidOwner",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "OwnableUnauthorizedAccount",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "token",
						"type": "address"
					}
				],
				"name": "SafeERC20FailedOperation",
				"type": "error"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "pid",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "reward",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "fee",
						"type": "uint256"
					}
				],
				"name": "Claimed",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "pid",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "Deposited",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "pid",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "penalty",
						"type": "uint256"
					}
				],
				"name": "EmergencyWithdrawn",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "message",
						"type": "string"
					}
				],
				"name": "NotificationCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "previousOwner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "OwnershipTransferred",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "stakedToken",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "rewardToken",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "APY",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "lockDays",
						"type": "uint256"
					}
				],
				"name": "PoolAdded",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "pid",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "depositor",
						"type": "address"
					}
				],
				"name": "RewardDeposited",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "pid",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "fee",
						"type": "uint256"
					}
				],
				"name": "Withdrawn",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "DECIMALS",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "EMERGENCY_PENALTY",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "FEE_PERCENT",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "MAX_MULTIPLIER",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "TEST_DAY",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "contract IERC20",
						"name": "_stakedToken",
						"type": "address"
					},
					{
						"internalType": "contract IERC20",
						"name": "_rewardToken",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "_APY",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_lockDays",
						"type": "uint256"
					}
				],
				"name": "addPool",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_pid",
						"type": "uint256"
					}
				],
				"name": "claimReward",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_pid",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_amount",
						"type": "uint256"
					}
				],
				"name": "deposit",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_pid",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_amount",
						"type": "uint256"
					}
				],
				"name": "depositRewards",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_pid",
						"type": "uint256"
					}
				],
				"name": "emergencyWithdraw",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getNotifications",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "poolId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "sender",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "message",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "timestamp",
								"type": "uint256"
							}
						],
						"internalType": "struct CoroTashi.Notification[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "notifications",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "poolId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "message",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "poolCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "poolInfo",
				"outputs": [
					{
						"internalType": "contract IERC20",
						"name": "stakedToken",
						"type": "address"
					},
					{
						"internalType": "contract IERC20",
						"name": "rewardToken",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "totalStaked",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalRewards",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "APY",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lockDays",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "renounceOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "transferOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "userInfo",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastRewardAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lockUntil",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rewardDebt",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_pid",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_amount",
						"type": "uint256"
					}
				],
				"name": "withdraw",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		],
		"devdoc": {
			"errors": {
				"OwnableInvalidOwner(address)": [
					{
						"details": "The owner is not a valid owner account. (eg. `address(0)`)"
					}
				],
				"OwnableUnauthorizedAccount(address)": [
					{
						"details": "The caller account is not authorized to perform an operation."
					}
				],
				"SafeERC20FailedOperation(address)": [
					{
						"details": "An operation with an ERC-20 token failed."
					}
				]
			},
			"kind": "dev",
			"methods": {
				"owner()": {
					"details": "Returns the address of the current owner."
				},
				"renounceOwnership()": {
					"details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."
				},
				"transferOwnership(address)": {
					"details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
				}
			},
			"version": 1
		},
		"userdoc": {
			"kind": "user",
			"methods": {},
			"version": 1
		}
	},
	"settings": {
		"compilationTarget": {
			"contracts/CoroYami/StakingDapp.sol": "CoroTashi"
		},
		"evmVersion": "shanghai",
		"libraries": {},
		"metadata": {
			"bytecodeHash": "ipfs"
		},
		"optimizer": {
			"enabled": false,
			"runs": 200
		},
		"remappings": []
	},
	"sources": {
		"@openzeppelin/contracts/access/Ownable.sol": {
			"keccak256": "0xff6d0bb2e285473e5311d9d3caacb525ae3538a80758c10649a4d61029b017bb",
			"license": "MIT",
			"urls": [
				"bzz-raw://8ed324d3920bb545059d66ab97d43e43ee85fd3bd52e03e401f020afb0b120f6",
				"dweb:/ipfs/QmfEckWLmZkDDcoWrkEvMWhms66xwTLff9DDhegYpvHo1a"
			]
		},
		"@openzeppelin/contracts/interfaces/IERC1363.sol": {
			"keccak256": "0x9b6b3e7803bc5f2f8cd7ad57db8ac1def61a9930a5a3107df4882e028a9605d7",
			"license": "MIT",
			"urls": [
				"bzz-raw://da62d6be1f5c6edf577f0cb45666a8aa9c2086a4bac87d95d65f02e2f4c36a4b",
				"dweb:/ipfs/QmNkpvBpoCMvX8JwAFNSc5XxJ2q5BXJpL5L1txb4QkqVFF"
			]
		},
		"@openzeppelin/contracts/interfaces/IERC165.sol": {
			"keccak256": "0xde7e9fd9aee8d4f40772f96bb3b58836cbc6dfc0227014a061947f8821ea9724",
			"license": "MIT",
			"urls": [
				"bzz-raw://11fea9f8bc98949ac6709f0c1699db7430d2948137aa94d5a9e95a91f61a710a",
				"dweb:/ipfs/QmQdfRXxQjwP6yn3DVo1GHPpriKNcFghSPi94Z1oKEFUNS"
			]
		},
		"@openzeppelin/contracts/interfaces/IERC20.sol": {
			"keccak256": "0xce41876e78d1badc0512229b4d14e4daf83bc1003d7f83978d18e0e56f965b9c",
			"license": "MIT",
			"urls": [
				"bzz-raw://a2608291cb038b388d80b79a06b6118a42f7894ff67b7da10ec0dbbf5b2973ba",
				"dweb:/ipfs/QmWohqcBLbcxmA4eGPhZDXe5RYMMEEpFq22nfkaUMvTfw1"
			]
		},
		"@openzeppelin/contracts/security/ReentrancyGuard.sol": {
			"keccak256": "0xa535a5df777d44e945dd24aa43a11e44b024140fc340ad0dfe42acf4002aade1",
			"license": "MIT",
			"urls": [
				"bzz-raw://41319e7f621f2dc3733511332c4fd032f8e32ad2aa7fd6f665c19741d9941a34",
				"dweb:/ipfs/QmcYR3bd862GD1Bc7jwrU9bGxrhUu5na1oP964bDCu2id1"
			]
		},
		"@openzeppelin/contracts/token/ERC20/IERC20.sol": {
			"keccak256": "0xe06a3f08a987af6ad2e1c1e774405d4fe08f1694b67517438b467cecf0da0ef7",
			"license": "MIT",
			"urls": [
				"bzz-raw://df6f0c459663c9858b6cba2cda1d14a7d05a985bed6d2de72bd8e78c25ee79db",
				"dweb:/ipfs/QmeTTxZ7qVk9rjEv2R4CpCwdf8UMCcRqDNMvzNxHc3Fnn9"
			]
		},
		"@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol": {
			"keccak256": "0x4ea01544758fd2c7045961904686bfe232d2220a04ecaa2d6b08dac17827febf",
			"license": "MIT",
			"urls": [
				"bzz-raw://fabe6bef5167ae741dd8c22d7f81d3f9120bd61b290762a2e8f176712567d329",
				"dweb:/ipfs/QmSnEitJ6xmf1SSAUeZozD7Gx7h8bNnX3a1ZBzqeivsvVg"
			]
		},
		"@openzeppelin/contracts/utils/Context.sol": {
			"keccak256": "0x493033a8d1b176a037b2cc6a04dad01a5c157722049bbecf632ca876224dd4b2",
			"license": "MIT",
			"urls": [
				"bzz-raw://6a708e8a5bdb1011c2c381c9a5cfd8a9a956d7d0a9dc1bd8bcdaf52f76ef2f12",
				"dweb:/ipfs/Qmax9WHBnVsZP46ZxEMNRQpLQnrdE4dK8LehML1Py8FowF"
			]
		},
		"@openzeppelin/contracts/utils/introspection/IERC165.sol": {
			"keccak256": "0x79796192ec90263f21b464d5bc90b777a525971d3de8232be80d9c4f9fb353b8",
			"license": "MIT",
			"urls": [
				"bzz-raw://f6fda447a62815e8064f47eff0dd1cf58d9207ad69b5d32280f8d7ed1d1e4621",
				"dweb:/ipfs/QmfDRc7pxfaXB2Dh9np5Uf29Na3pQ7tafRS684wd3GLjVL"
			]
		},
		"contracts/CoroYami/StakingDapp.sol": {
			"keccak256": "0xa87176e171efc6a92ebe7d4a0af4ab6d2ebda7bbcee6e8dcceb78f943c6206de",
			"license": "MIT",
			"urls": [
				"bzz-raw://0f4538c7fb396ab603416a68e254e03c35775e6ccbbc9e09eca88f8597d68d69",
				"dweb:/ipfs/QmTPszU6JzRvRwx6nkwxFaxdyU1Y62UhUcZUrasnKaL58x"
			]
		}
	},
	"version": 1
}
export default abi.output.abi;