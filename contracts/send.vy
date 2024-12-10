#@version ^0.4.0 
#pragma optimize gas

storedData: public(uint256)
storedString: public(String[32])

@external
def set_number(newValue: uint256):
    self.storedData = newValue

@external
def set_string(newString: String[32]):
    self.storedString = newString

@view
@external
def get_number() -> uint256:
    return self.storedData

@view
@external
def get_string() -> String[32]:
    return self.storedString