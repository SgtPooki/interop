#!/usr/bin/env bash

# This script ensures go-libp2p-relay-daemon is available
# for use in  circuit v1 and v2 tests.

set -eo pipefail

if ! test -e ./go-libp2p-relay-daemon/relayd; then
    echo "Building ./go-libp2p-relay-daemon/relayd binary.."
    rm -rf ./go-libp2p-relay-daemon
    git clone https://github.com/libp2p/go-libp2p-relay-daemon.git
    cd go-libp2p-relay-daemon
    # no releases atm, so we pin implementation to specific commit
    git checkout 65211a0b6d881086feb7c386d780f55c37dff101 # 2021-11-19
    go build ./...
    echo "./go-libp2p-relay-daemon/relayd is ready"
fi
