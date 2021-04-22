export const persistStorageKey = 'canvas-graph'
export const nodesMetadata = {
  function: {
    width: 128,
    height: 128,
    inputs: [],
    outputs: [],
  },
  moveTo: {
    width: 128,
    height: 128,
    inputs: [
      {
        type: 'scalar',
        label: 'x',
      },
      {
        type: 'scalar',
        label: 'y',
      },
      {
        type: 'follow',
        label: 'previous',
      },
    ],
    outputs: [
      {
        type: 'follow',
        label: 'next',
        multiple: true,
      },
    ],
  },
  lineTo: {
    width: 128,
    height: 128,
    inputs: [
      {
        type: 'scalar',
        label: 'x',
      },
      {
        type: 'scalar',
        label: 'y',
      },
      {
        type: 'follow',
        label: 'previous',
      },
    ],
    outputs: [
      {
        type: 'follow',
        label: 'next',
        multiple: true,
      },
    ],
  },
  endShape: {
    width: 148,
    height: 128,
    inputs: [
      {
        type: 'color',
        label: 'fill color',
      },
      {
        type: 'color',
        label: 'stroke color',
      },
      {
        type: 'follow',
        label: 'previous',
      },
    ],
    outputs: [
      {
        type: 'shape',
        label: 'shape',
        multiple: true,
      },
    ],
  },
  scalar: {
    width: 128,
    height: 22,
    isLiteral: true,
    value: 0,
    inputs: [],
    outputs: [
      {
        type: 'scalar',
        label: 'scalar',
        multiple: true,
      },
    ],
  },
  color: {
    width: 64,
    height: 22,
    isLiteral: true,
    value: 'rgba(255, 255, 255, 1)',
    inputs: [],
    outputs: [
      {
        type: 'color',
        label: 'color',
        multiple: true,
      },
    ],
  },
}

export const initialNodeId = '__root__'
export const initialNode = {
  id: initialNodeId,
  label: 'Main',
  type: 'function',
  functionId: null,
  inputs: [],
  outputs: [
    {
      type: 'shape',
      label: 'canvas',
      multiple: true,
    },
  ],
}
export const argumentsNode = {
  id: `arguments${initialNodeId}`,
  label: 'arguments',
  type: 'arguments',
  functionId: initialNodeId,
  inputs: [],
  outputs: [],
  width: 128,
  height: 22,
  x: 11208,
  y: 9294,
}
export const returnNode = {
  id: `return${initialNodeId}`,
  label: 'return',
  type: 'return',
  functionId: initialNodeId,
  inputs: [],
  outputs: [],
  width: 128,
  height: 22,

  x: 11864,
  y: 9294,
}
