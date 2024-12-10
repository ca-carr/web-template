
const contractAddress = "0x231f50145d2B7a80070C0efD2dc6BCC0D5667C0c";
const contractABI = [
    {"type":"function","name":"set_number","stateMutability":"nonpayable","inputs":[{"name":"newValue","type":"uint256","components":null}],"outputs":[]},
    {"type":"function","name":"set_string","stateMutability":"nonpayable","inputs":[{"name":"newString","type":"string","components":null}],"outputs":[]},
    {"type":"function","name":"get_number","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256","components":null}]},
    {"type":"function","name":"get_string","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"string","components":null}]}
];

let contract;
let provider;
let signer;

// Connect Wallet
async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to use this application.");
        return;
    }
    try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Initialize provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        // Initialize contract
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Debug logs
        console.log("Provider:", provider);
        console.log("Signer:", signer);
        console.log("Contract Object:", contract);

        // Update UI
        const address = await signer.getAddress();
        document.getElementById("walletAddress").textContent = `Connected Wallet: ${address}`;
        document.getElementById("connectWalletBtn").textContent = "Wallet Connected";
        document.getElementById("connectWalletBtn").disabled = true;

        alert("Wallet connected successfully!");
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet.");
    }
}

// Set Number
async function setNumber() {
    if (!contract) {
        alert("Please connect your wallet first.");
        return;
    }
    const newNumber = document.getElementById("newNumber").value;
    if (!newNumber) {
        alert("Please enter a number.");
        return;
    }
    try {
        const tx = await contract.set_number(newNumber); // Sends transaction
        await tx.wait(); // Waits for the transaction to be mined
        alert("Number set successfully!");
    } catch (error) {
        console.error("Error in setNumber:", error);
        alert("Failed to set number.");
    }
}
