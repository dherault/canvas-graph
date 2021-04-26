const fs = require('fs')
const path = require('path')

const uuid = require('uuid').v4
const { Project } = require('ts-morph')

function run() {
  const project = new Project()

  const exampleFile = `
    function add(x: number, y: number): number {
      return x + y;
    }
  `

  const sourceFile = project.createSourceFile(path.join(__dirname, '../output/function.ts'), exampleFile)

  // sourceFile.getTypeAlias
  // sourceFile.getSymbol().getName()
  // State
  const state = {
    parentIds: [],
    nodes: {},
    edges: {},
    identifierToNodeMetadata: {},
  }

  function getCurrentParentId() {
    return state.parentIds[state.parentIds.length - 1] || null
  }

  function setParentId(parentId) {
    state.parentIds.push(parentId)
  }

  function unsetParentId() {
    state.parentIds.pop()
  }

  function createNode(type, attributes = {}) {
    const node = {
      id: uuid(),
      parentId: getCurrentParentId(),
      type,
      inputs: [],
      outputs: [],
      ...attributes,
    }

    state.nodes[node.id] = node

    return node
  }

  function createEdge(type, inputNodeId, outputNodeId, inputNodeOutputIndex, outputNodeInputIndex) {
    const edge = {
      id: uuid(),
      parentId: getCurrentParentId(),
      type,
      inputNodeId,
      outputNodeId,
      inputNodeOutputIndex,
      outputNodeInputIndex,
    }

    state.edges[edge.id] = edge

    return edge
  }
  function createData(nodes = [], edges = [], metadata = null) {
    return {
      nodes,
      edges,
      metadata,
    }
  }

  const traversers = {
    SourceFile(node, { next }) {
      const fileNode = createNode('file')

      setParentId(fileNode.id)

      next()

      return createData(fileNode)
    },
    FunctionDeclaration(node, { next }) {
      const returnIo = {
        name: 'return',
        type: node.getReturnType().getText(),
      }

      const functionNode = createNode('function', {
        name: node.getSymbol().getName(),
        outputs: [returnIo],
      })

      setParentId(functionNode.id)
      state.identifierToNodeMetadata = {}

      const argumentsNode = createNode('arguments', {
        functionId: functionNode.id,
      })
      const returnNode = createNode('return', {
        functionId: functionNode.id,
        inputs: [returnIo],
      })

      next()

      functionNode.inputs = argumentsNode.outputs

      return createData([functionNode, argumentsNode, returnNode])
    },
    Parameter(node, { next }) {
      const functionNode = state.nodes[getCurrentParentId()]
      const argumentNode = Object.values(state.nodes).find(n => n.functionId === functionNode.id && n.type === 'arguments')

      const argument = {
        name: node.getSymbol().getName(),
        type: node.getType().getText(),
      }

      const argumentIndex = argumentNode.outputs.push(argument) - 1

      state.identifierToNodeMetadata[argument.name] = {
        type: argument.type,
        nodeId: argumentNode.id,
        outputIndex: argumentIndex,
      }

      next()

      return createData()
    },
    ReturnStatement(node, { next }) {
      const functionNode = state.nodes[getCurrentParentId()]
      const returnNode = Object.values(state.nodes).find(n => n.functionId === functionNode.id && n.type === 'return')

      const { nodes } = next()

      const nodeConnectedToReturn = nodes[0] // TODO

      const edge = createEdge(
        nodeConnectedToReturn.outputs[0].type,
        nodeConnectedToReturn.id,
        returnNode.id,
        0,
        0,
      )

      return {
        nodes: [],
        edges: [edge],
      }
    },
    BinaryExpression(node, { next }) {
      const children = node.forEachChildAsArray()

      const child1Metadata = traverse(children[0]).metadata // TODO, use next
      const child2Metadata = traverse(children[2]).metadata
      const operatorNodeText = children[1].getText()

      let functionNode

      const functionNodeParameters = {
        inputs: [
          {
            name: '0',
            type: 'number',
          },
          {
            name: '1',
            type: 'number',
          },
        ],
        outputs: [
          {
            name: 'result',
            type: 'number',
          },
        ],
      }

      switch (operatorNodeText) {
        case '+':
          functionNode = createNode('add', functionNodeParameters)
          break

        case '*':
          functionNode = createNode('multiply', functionNodeParameters)
          break

        case '/':
          functionNode = createNode('divide', functionNodeParameters)
          break

        case '%':
          functionNode = createNode('modulo', functionNodeParameters)
          break

        default:
          throw new Error(`Unknown operator: ${operatorNodeText}`)
      }

      const edge1 = createEdge(
        child1Metadata.type,
        child1Metadata.nodeId,
        functionNode.id,
        child1Metadata.outputIndex,
        0
      )
      const edge2 = createEdge(
        child2Metadata.type,
        child2Metadata.nodeId,
        functionNode.id,
        child2Metadata.outputIndex,
        1
      )

      return createData([functionNode], [edge1, edge2])
    },
    Identifier(node, { next }) {
      const sourceMetadata = state.identifierToNodeMetadata[node.getText()]

      next()

      return {
        nodes: [],
        edges: [],
        metadata: sourceMetadata,
      }
    },
  }

  function getPrefix(node, prefix = '') {
    const nextPrefix = `${node.getKindName()}.${prefix}`
    const parent = node.getParent()

    if (parent) {
      return getPrefix(parent, nextPrefix)
    }

    return nextPrefix.slice(0, -1)
  }

  function traverse(node) {
    const kindName = node.getKindName()
    const traverser = traversers[kindName]

    const helpers = {
      next: () => {
        const data = createData()

        node.forEachChild(child => {
          const { nodes, edges } = traverse(child)

          data.nodes.push(...nodes)
          data.edges.push(...edges)
        })

        return data
      },
      log: (...x) => console.log(`[${getPrefix(node)}]`, ...x),
      logError: (...x) => console.error(`[${getPrefix(node)}]`, ...x),
    }

    if (typeof traverser === 'function') {
      return traverser(node, helpers)
    }

    helpers.log('traverse: no traverser, calling next')

    return helpers.next() || { nodes: [], edges: [] }
  }

  function traverseToLog(node, prefix = '') {
    const kindName = node.getKindName()
    const nextPrefix = `${prefix}.${kindName}`

    console.log(nextPrefix)

    node.forEachChild(child => traverseToLog(child, nextPrefix))
  }

  console.log('_____')
  traverseToLog(sourceFile)
  console.log('_____')
  traverse(sourceFile)

  delete state.parentIds
  delete state.identifierToNodeMetadata

  fs.writeFileSync(path.join(__dirname, 'output', 'state.json'), JSON.stringify(state, null, 2))
}

run()
