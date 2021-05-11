#!/bin/bash
if [ -z $1 ]; then
  truffle run verify OniToken --network bsctestnet
  truffle run verify SyrupBar --network bsctestnet
  truffle run verify MasterChef --network bsctestnet
else
  if [ -z $2 ]; then
    truffle run verify $1 --network bsctestnet
  else
    if [[ $1 = "all" ]]; then
      truffle run verify OniToken --network $2
      truffle run verify SyrupBar --network $2
      truffle run verify MasterChef --network $2
    else
      truffle run verify $1 --network $2
    fi
  fi
fi
