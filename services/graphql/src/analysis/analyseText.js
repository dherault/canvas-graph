const path = require('path')

const tmp = require('tmp-promise')
const uuid = require('uuid').v4
const { Project } = require('ts-morph')

async function analyseText(sourceText, previousData) {
  const pathToNodeId = {}

  Object.values(previousData.nodes).forEach(node => {
    pathToNodeId[node.path] = node.id
  })

  const project = new Project()

  const dir = await tmp.dir()
  const sourceFile = project.createSourceFile(path.join(dir.path, 'file.ts'), sourceText)

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
    console.log('parentId', parentId)
    state.parentIds.push(parentId)
  }

  function unsetParentId() {
    state.parentIds.pop()
  }

  function createNode(path, type, attributes = {}) {
    const node = {
      id: pathToNodeId[path] || uuid(),
      parentId: getCurrentParentId(),
      type,
      name: type,
      path,
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
    SourceFile(node, { path, next }) {
      const fileNode = createNode(path, 'file')

      setParentId(fileNode.id)
      next()
      unsetParentId()

      return createData(fileNode)
    },
    FunctionDeclaration(node, { path, next }) {
      const returnIo = {
        name: 'return',
        type: node.getReturnType().getText(),
      }

      const functionNode = createNode(path, 'function', {
        name: node.getSymbol().getName(),
        outputs: [returnIo],
      })

      setParentId(functionNode.id)
      state.identifierToNodeMetadata = {}

      const argumentsNode = createNode(`${path}[arguments]`, 'arguments', {
        functionId: functionNode.id,
      })
      const returnNode = createNode(`${path}[return]`, 'return', {
        functionId: functionNode.id,
        inputs: [returnIo],
      })

      next()
      unsetParentId()

      functionNode.inputs = argumentsNode.outputs

      return createData([functionNode, argumentsNode, returnNode])
    },
    Parameter(node, { path, next }) {
      console.log('getCurrentParentId()', getCurrentParentId())
      const functionNode = state.nodes[getCurrentParentId()]
      console.log('functionNode', functionNode)
      const argumentNode = Object.values(state.nodes).find(n => n.functionId === functionNode.id && n.type === 'arguments')
      console.log('argumentNode', argumentNode)

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
    ReturnStatement(node, { path, next }) {
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
    BinaryExpression(node, { path }) {
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
          functionNode = createNode(path, 'add', functionNodeParameters)
          break

        case '*':
          functionNode = createNode(path, 'multiply', functionNodeParameters)
          break

        case '/':
          functionNode = createNode(path, 'divide', functionNodeParameters)
          break

        case '%':
          functionNode = createNode(path, 'modulo', functionNodeParameters)
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
    const parent = node.getParent()
    const kindName = node.getKindName()

    let index = 0

    if (kindName === 'FunctionDeclaration') {
      index = node.getSymbol().getName()
    }
    else if (parent) {
      index = parent.forEachChildAsArray().indexOf(node)
    }

    const nextPrefix = `${kindName}[${index}].${prefix}`

    if (parent) {
      return getPrefix(parent, nextPrefix)
    }

    return nextPrefix.slice(0, -1)
  }

  function traverse(node) {
    const kindName = node.getKindName()
    const prefix = getPrefix(node)

    console.log('prefix', prefix, pathToNodeId[prefix])

    const traverser = traversers[kindName]

    const helpers = {
      path: prefix,
      next: () => {
        const data = createData()

        node.forEachChild(child => {
          const { nodes, edges } = traverse(child)

          data.nodes.push(...nodes)
          data.edges.push(...edges)
        })

        return data
      },
      log: (...x) => console.log(`[${prefix}]`, ...x),
      logError: (...x) => console.error(`[${prefix}]`, ...x),
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

  return state
}

module.exports = analyseText
