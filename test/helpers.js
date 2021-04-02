export const EVM_REVERT = 'VM Exception while processing transaction: revert';
export const EVM_REVERT_ERC20 = 'VM Exception while processing transaction: revert ERC20: transfer amount exceeds allowance -- Reason given: ERC20: transfer amount exceeds allowance';

export const ether = n => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

export const tokens = (n) => ether(n);