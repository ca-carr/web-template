# ERC20 Token Contract in Vyper

# Events
event Transfer:
    sender: indexed(address)
    receiver: indexed(address)
    amount: uint256

event Approval:
    owner: indexed(address)
    spender: indexed(address)
    amount: uint256

# Storage Variables
name: public(String[64])  # Token Name
symbol: public(String[32])  # Token Symbol
decimals: public(uint256)  # Decimal Places
total_supply: public(uint256)  # Total Supply

balances: public(HashMap[address, uint256])  # Account Balances
allowances: public(HashMap[address, HashMap[address, uint256]])  # Allowances

@deploy
def __init__(_name: String[64], _symbol: String[32], _decimals: uint256, _total_supply: uint256):
    """
    Constructor to initialize the token with name, symbol, decimals, and total supply.
    """
    self.name = _name
    self.symbol = _symbol
    self.decimals = _decimals
    self.total_supply = _total_supply

    # Assign the entire supply to the deployer
    self.balances[msg.sender] = _total_supply
    log Transfer(ZERO_ADDRESS, msg.sender, _total_supply)

@view
@external
def balanceOf(owner: address) -> uint256:
    """
    Get the balance of an address.
    """
    return self.balances[owner]

@view
@external
def allowance(owner: address, spender: address) -> uint256:
    """
    Get the remaining allowance for a spender.
    """
    return self.allowances[owner][spender]

@external
def transfer(receiver: address, amount: uint256) -> bool:
    """
    Transfer tokens to a given address.
    """
    assert self.balances[msg.sender] >= amount, "Insufficient balance"
    assert receiver != ZERO_ADDRESS, "Invalid receiver"

    self.balances[msg.sender] -= amount
    self.balances[receiver] += amount

    log Transfer(msg.sender, receiver, amount)
    return True

@external
def approve(spender: address, amount: uint256) -> bool:
    """
    Approve a spender to transfer up to a certain amount.
    """
    self.allowances[msg.sender][spender] = amount
    log Approval(msg.sender, spender, amount)
    return True

@external
def transferFrom(sender: address, receiver: address, amount: uint256) -> bool:
    """
    Transfer tokens on behalf of the owner.
    """
    assert self.allowances[sender][msg.sender] >= amount, "Allowance exceeded"
    assert self.balances[sender] >= amount, "Insufficient balance"
    assert receiver != ZERO_ADDRESS, "Invalid receiver"

    self.allowances[sender][msg.sender] -= amount
    self.balances[sender] -= amount
    self.balances[receiver] += amount

    log Transfer(sender, receiver, amount)
    return True
