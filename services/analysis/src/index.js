const path = require('path')

const { Project } = require('ts-morph')

function run() {
  const project = new Project()

  const exampleFile = `
  function twice(x: number) {
    return x + x
  }

  module.exports = twice
  `


  const sourceFile = project.createSourceFile(path.join(__dirname, '../output/twice.ts'), exampleFile);
  // console.log('sourceFile', sourceFile)

  sourceFile.forEachChild(child => {
    const kindName = child.getKindName()

    console.log('kindName', kindName)

    if (kindName === 'FunctionDeclaration') {
      child.forEachChild(child => {
        const kindName = child.getKindName()

        console.log('child.getKindName()', child.getKindName())

        if (kindName === 'Identifier') console.log('Function name:', child.getSymbol().getName())
        if (kindName === 'Parameter') console.log('Function arg:', child.getSymbol().getName(), child.getType().getText())
      })
    }
  })
}

run()
