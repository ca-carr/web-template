let provider;
let signer;
let connectedAccount = null;

if (typeof window.ethereum !== 'undefined') {
    console.log('Wallet is installed');
} else {
    alert('No wallet is installed');
}

// function to connect to wallet
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Wallet not installed!');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); // Prompt user to connect
        if (accounts.length === 0) {
            alert('No accounts found, connect wallet.');
            return;
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        connectedAccount = accounts[0];
        
        // Update the status UI
        const statusElement = document.getElementById('statusText');
        if (statusElement) {
            statusElement.textContent = 'Connected.';
        }

        // Fetch the latest block number
        const blockNum = await provider.getBlockNumber();
        const blockElement = document.getElementById('blockNumber');
        if (blockElement) {
            blockElement.textContent = `Block number: ${blockNum}`;
        } else {
            blockElement.textContent = `Block 0: ${blockNum}`;
        }

        console.log('Connected to account:', connectedAccount);
        alert('Success: connected to wallet');
    } catch (error) {
        console.error('Error when connecting to wallet:', error);
        alert('Failed: could not connect to wallet.');
    }
}

// Ensure DOM elements are available before accessing them
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.ethereum !== 'undefined') {
        document.getElementById('connectButton').addEventListener('click', connectWallet);
    } else {
        console.error('Wallet not installed.');
    }
});
