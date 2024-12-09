// Smart Contract Details
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
        await window.ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
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
    const newNumber = document.getElementById("newNumber").value;
    if (!newNumber) {
        alert("Please enter a number.");
        return;
    }
    try {
        const tx = await contract.set_number(newNumber);
        await tx.wait();
        alert("Number set successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to set number.");
    }
}

// Set String
async function setString() {
    const newString = document.getElementById("newString").value;
    if (!newString) {
        alert("Please enter a string.");
        return;
    }
    try {
        const tx = await contract.set_string(newString);
        await tx.wait();
        alert("String set successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to set string.");
    }
}

// Get Number
async function getNumber() {
    try {
        const number = await contract.get_number();
        document.getElementById("numberResult").querySelector("span").textContent = number;
    } catch (error) {
        console.error(error);
        alert("Failed to get number.");
    }
}

// Get String
async function getString() {
    try {
        const string = await contract.get_string();
        document.getElementById("stringResult").querySelector("span").textContent = string;
    } catch (error) {
        console.error(error);
        alert("Failed to get string.");
    }
}
