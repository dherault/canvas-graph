export const persistStorageKey = 'canvas-graph'
export const nodesMetadata = {
  moveTo: {
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
      },
    ],
  },
  lineTo: {
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
      },
    ],
  },
  endShape: {
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
        label: 'next',
      },
    ],
  },
}
