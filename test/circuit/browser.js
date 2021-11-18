/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */

import delay from 'delay'
import { isWebWorker } from 'wherearewe'
import {
  createJs,
  createGo,
  createGoRelay,
  createProc,
  connWithTimeout,
  getWsAddr,
  getWrtcStarAddr
} from '../utils/circuit.js'

const base = '/ip4/127.0.0.1/tcp/0'

// note: the order nodeA-nodeB-relay means "node A connect to B over relay"
export default {
  'browser-go-js': {
    skip: () => true, // FIXME no circuit v2 support in js-ipfs
    create: async (factory) => {
      const goRelayV2 = await createGoRelay([`${base}/ws`], factory)
      return Promise.all([
        createProc([], factory),
        goRelayV2,
        createJs([`${base}/ws`], factory, goRelayV2)
      ])
    },
    connect: connWithTimeout(1500)
  },
  'browser-go-go': {
    skip: () => true, // FIXME no circuit v2 support in js-ipfs
    create: async (factory) => {
      const goRelayV2 = await createGoRelay([`${base}/ws`], factory)
      return Promise.all([
        createProc([], factory),
        goRelayV2,
        createGo([`${base}/ws`], factory, goRelayV2)
      ])
    },
    connect: connWithTimeout(1500)
  },
  'browser-js-js': {
    create: (factory) => Promise.all([
      createProc([], factory),
      createJs([`${base}/ws`], factory),
      createJs([`${base}/ws`], factory)
    ]),
    connect: connWithTimeout(1500)
  },
  'browser-js-go': {
    create: (factory) => Promise.all([
      createProc([], factory),
      createJs([`${base}/ws`], factory),
      createGo([`${base}/ws`], factory)
    ]),
    connect: connWithTimeout(1500)
  },
  'js-go-browser': {
    skip: () => true, // FIXME no circuit v2 support in js-ipfs
    create: async (factory) => {
      const goRelayV2 = await createGoRelay([`${base}/ws`], factory)
      return Promise.all([
        createJs([`${base}/ws`], factory),
        goRelayV2,
        createProc([], factory, goRelayV2)
      ])
    },
    connect: connWithTimeout(1500)
  },
  'go-go-browser': {
    skip: () => true, // FIXME no circuit v2 support in js-ipfs
    create: async (factory) => {
      const goRelayV2 = await createGoRelay([`${base}/ws`], factory)
      return Promise.all([
        createGo([`${base}/ws`], factory),
        goRelayV2,
        createProc([], factory, goRelayV2)
      ])
    },
    connect: connWithTimeout(1500)
  },
  'js-js-browser': {
    create: (factory) => Promise.all([
      createJs([`${base}/ws`], factory),
      createJs([`${base}/ws`], factory),
      createProc([], factory)
    ]),
    connect: connWithTimeout(1500)
  },
  'go-js-browser': {
    create: (factory) => Promise.all([
      createGo([`${base}/ws`], factory),
      createJs([`${base}/ws`], factory),
      createProc([], factory)
    ]),
    connect: connWithTimeout(1500)
  },
  'go-browser-browser': {
    create: (factory) => Promise.all([
      createGo([`${base}/ws`], factory),
      createProc(['/ip4/127.0.0.1/tcp/24642/ws/p2p-webrtc-star'], factory),
      createProc(['/ip4/127.0.0.1/tcp/24642/ws/p2p-webrtc-star'], factory)
    ]),
    connect: async (nodeA, nodeB, relay) => {
      await relay.api.swarm.connect(getWsAddr(nodeA.api.peerId.addresses))
      await relay.api.swarm.connect(getWrtcStarAddr(nodeB.api.peerId.addresses))
      // TODO: needed until https://github.com/ipfs/interop/issues/17 is resolved
      await delay(5000)
      const nodeBCircuitAddr = `${getWrtcStarAddr(relay.api.peerId.addresses)}/p2p-circuit/p2p/${nodeB.api.peerId.id}`
      await nodeA.api.swarm.connect(nodeBCircuitAddr)
    },
    skip: () => true // go-ipfs does not know what p2p-webrtc-star is
  },
  'js-browser-browser': {
    create: (factory) => Promise.all([
      createJs([`${base}/ws`], factory),
      createProc(['/ip4/127.0.0.1/tcp/24642/ws/p2p-webrtc-star'], factory),
      createProc(['/ip4/127.0.0.1/tcp/24642/ws/p2p-webrtc-star'], factory)
    ]),
    connect: async (nodeA, nodeB, relay) => {
      await relay.api.swarm.connect(getWsAddr(nodeA.api.peerId.addresses))
      await relay.api.swarm.connect(getWrtcStarAddr(nodeB.api.peerId.addresses))
      // TODO: needed until https://github.com/ipfs/interop/issues/17 is resolved
      await delay(3000)
      const nodeBCircuitAddr = `${getWrtcStarAddr(relay.api.peerId.addresses)}/p2p-circuit/p2p/${nodeB.api.peerId.id}`
      await nodeA.api.swarm.connect(nodeBCircuitAddr)
    },
    skip: () => isWebWorker // no webrtc support in webworkers
  },
  'browser-browser-go': {
    create: (factory) => Promise.all([
      createProc(['/ip4/127.0.0.1/tcp/24642/wss/p2p-webrtc-star'], factory),
      createProc(['/ip4/127.0.0.1/tcp/24642/wss/p2p-webrtc-star'], factory),
      createGo([`${base}/ws`], factory)
    ]),
    connect: async (nodeA, nodeB, relay) => {
      await relay.api.swarm.connect(getWrtcStarAddr(nodeA.api.peerId.addresses))
      await relay.api.swarm.connect(getWsAddr(nodeB.api.peerId.addresses))
      // TODO: needed until https://github.com/ipfs/interop/issues/17 is resolved
      await delay(5000)
      const nodeBCircuitAddr = `${getWrtcStarAddr(relay.api.peerId.addresses)}/p2p-circuit/p2p/${nodeB.api.peerId.id}`
      await nodeA.api.swarm.connect(nodeBCircuitAddr)
    },
    skip: () => isWebWorker // no webrtc support in webworkers
  },
  'browser-browser-js': {
    create: (factory) => Promise.all([
      createProc(['/ip4/127.0.0.1/tcp/24642/wss/p2p-webrtc-star'], factory),
      createProc(['/ip4/127.0.0.1/tcp/24642/wss/p2p-webrtc-star'], factory),
      createJs([`${base}/ws`], factory)
    ]),
    connect: async (nodeA, nodeB, relay) => {
      await relay.api.swarm.connect(getWrtcStarAddr(nodeA.api.peerId.addresses))
      await relay.api.swarm.connect(getWsAddr(nodeB.api.peerId.addresses))
      // TODO: needed until https://github.com/ipfs/interop/issues/17 is resolved
      await delay(3000)
      const nodeBCircuitAddr = `${getWrtcStarAddr(relay.api.peerId.addresses)}/p2p-circuit/p2p/${nodeB.api.peerId.id}`
      await nodeA.api.swarm.connect(nodeBCircuitAddr)
    },
    skip: () => isWebWorker // no webrtc support in webworkers
  }
}
