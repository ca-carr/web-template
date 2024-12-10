let provider;
let signer;
let connectedAccount = null;
let contract;
const contractAddress = "0x231f50145d2B7a80070C0efD2dc6BCC0D5667C0c";
const contractABI = [
    {"type":"function","name":"set_number","stateMutability":"nonpayable","inputs":[{"name":"newValue","type":"uint256"}],"outputs":[]},
    {"type":"function","name":"set_string","stateMutability":"nonpayable","inputs":[{"name":"newString","type":"string"}],"outputs":[]},
    {"type":"function","name":"get_number","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256"}]},
    {"type":"function","name":"get_string","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"string"}]}
];


if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed');
} else {
    alert('MetaMask is not installed. It needs to be installed to use this app.');
}

// Connect to MetaMask
async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed!');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        connectedAccount = accounts[0];

        // Update UI
        updateUI();
        await updateBalance();
        await updateNetwork();

        console.log('Connected account:', connectedAccount);
        alert('Connected to MetaMask');
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Failed to connect to MetaMask.');
    }
}

// Update ETH Balance
async function updateBalance() {
    if (!connectedAccount) return;

    try {
        const balance = await provider.getBalance(connectedAccount);
        const ethBalance = ethers.formatEther(balance);
        document.getElementById('balance').textContent = `Balance: ${ethBalance} ETH`;
    } catch (error) {
        console.error('Error fetching balance:', error);
        alert('Failed to fetch balance.');
    }
}

// Update Network
async function updateNetwork() {
    try {
        const network = await provider.getNetwork();
        const networkName = getNetworkName(network.chainId);
        document.getElementById('network').textContent = `Network: ${networkName} (Chain ID: ${network.chainId})`;
    } catch (error) {
        console.error('Error fetching network:', error);
        alert('Failed to fetch network information.');
    }
}

// Get Network Name by Chain ID
function getNetworkName(chainId) {
    const networks = {
        1: 'Mainnet',
        5: 'Goerli',
        11155111: 'Sepolia',
        17000: 'Holesky',
        // Add more networks as needed
    };
    return networks[chainId] || 'Unknown';
}

// Update UI Based on Connection Status
function updateUI() {
    if (connectedAccount) {
        document.getElementById('connectButton').textContent = 'Connected';
        document.getElementById('status').textContent = 'Status: Connected';
        document.getElementById('account').textContent = `Account: ${connectedAccount}`;
    } else {
        document.getElementById('connectButton').textContent = 'Connect to MetaMask';
        document.getElementById('status').textContent = 'Status: Disconnected';
        document.getElementById('account').textContent = 'Account: N/A';
        document.getElementById('balance').textContent = 'Balance: N/A';
        document.getElementById('network').textContent = 'Network: N/A';
    }
}

// Listen for Account Changes
window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
        // User disconnected wallet
        connectedAccount = null;
        updateUI();
    } else {
        connectedAccount = accounts[0];
        updateUI();
        updateBalance();
    }
});

// Listen for Chain Changes
window.ethereum.on('chainChanged', () => {
    window.location.reload(); // Reload to reflect network changes
});

// Add Event Listener for Connect Button
document.getElementById('connectButton').addEventListener('click', connectMetaMask);


// Get Number
async function getNumber() {
    try {
        const number = await contract.get_number();
        document.getElementById('numberResult').textContent = `Number: ${number}`;
    } catch (error) {
        console.error('Error getting number:', error);
        alert('Failed to fetch number.');
    }
}

// Get String
async function getString() {
    try {
        const string = await contract.get_string();
        document.getElementById('stringResult').textContent = `String: ${string}`;
    } catch (error) {
        console.error('Error getting string:', error);
        alert('Failed to fetch string.');
    }
}


// Event listners for get Number and String 
document.getElementById('getNumberButton').addEventListener('click', getNumber);
document.getElementById('getStringButton').addEventListener('click', getString);