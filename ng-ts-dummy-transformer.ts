import * as ts from 'typescript';

function createInstrumentCall(rootNode: ts.SourceFile, expression: ts.Expression) {
  const pos = rootNode.getLineAndCharacterOfPosition(expression.getStart());
  return ts.createCall(
    ts.createPropertyAccess(
      ts.createIdentifier('window'),
      ts.createIdentifier('__instrument__')
    ),
    undefined,
    [
      expression,
      ts.createStringLiteral(rootNode.fileName),
      ts.createStringLiteral(expression.getText()),
      ts.createNumericLiteral(`${pos.line + 1}`),
      ts.createNumericLiteral(`${pos.character + 1}`)
    ]
  );
}

export const dummyTransformer = <T extends ts.Node>(context: ts.TransformationContext) => {
  return (rootNode: ts.SourceFile) => {
    if (rootNode.fileName.includes('__instrument__')) {
      return rootNode;
    }

    function visitor(node) {
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isPropertyAccessExpression(expression)) {
          const name = expression.name;
          if (name.text === 'pipe') {
            node = ts.createCall(
              node.expression,
              node.typeArguments,
              node.arguments.map((expr) => createInstrumentCall(rootNode, expr)));
          }
        }
      }

      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitNode(rootNode, visitor);
  };
};

