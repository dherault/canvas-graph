const fs = require('fs')
const path = require('path')

const uuid = require('uuid').v4
const { Project, ForStatement } = require('ts-morph')

function splice(array, predicate) {
  const index = array.findIndex(predicate)

  return array.splice(index, 1)
}

function run() {
  const project = new Project()

  const exampleFile = `
    function add(x: number, y: number): number {
      return x + y;
    }
  `

  const sourceFile = project.createSourceFile(path.join(__dirname, '../output/twice.ts'), exampleFile);

  sourceFile.getTypeAlias
  // sourceFile.getSymbol().getName()
  // State
  const state = {
    parentIds: [],
    nodes: [],
    edges: [],
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
      ...attributes,
    }

    state.nodes.push(node)

    return node
  }

  const traversers = {
    SourceFile(node, prefix) {
      const filenode = createNode('file')

      setParentId(filenode.id)

      node.forEachChild(child => {
        traverse(child, prefix)
      })
    },
    FunctionDeclaration(node, prefix) {
      const functionNode = createNode('function', {
        name: 'anonymous',
        arguments: [],
        returnType: node.getReturnType().getText(),
      })

      node.forEachChild(child => {
        const kindName = child.getKindName()

        switch (kindName) {
          case 'Identifier': {
            functionNode.name = child.getSymbol().getName()
            break;
          }

          case 'Parameter': {
            // TODO, use traverser
            functionNode.arguments.push({
              name: child.getSymbol().getName(),
              type: child.getType().getText(),
            })
            break;
          }

          case 'Block': {
            traverse(child, prefix)
            break;
          }

          default:
            console.log(prefix, kindName, 'Unhandled kind')
            break;
        }
      })

      console.log('functionNode', functionNode)
    },
    Block(node, prefix) {

    }
  }

  function traverse(node, prefix = '') {
    const kindName = node.getKindName()
    const nextPrefix = `${prefix}.${kindName}`
    const traverser = traversers[kindName]

    console.log(nextPrefix)

    if (typeof traverser === 'function') {
      traverser(node, nextPrefix)
    }
    else {
      console.warn('No traverser for', kindName)
    }
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

  fs.writeFileSync(path.join(__dirname, 'output', 'state.json'), JSON.stringify(state, null, 2))
}

run()
