export const persistStorageKey = 'canvas-graph'
export const nodesMetadata = {
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
    isValue: true,
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
    isValue: true,
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
