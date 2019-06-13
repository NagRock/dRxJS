import * as ts from 'typescript';

function addConsoleLog(rootNode: ts.SourceFile, log: string) {
  return ts.updateSourceFileNode(rootNode, [
    ...rootNode.statements,
    ts.createExpressionStatement(
      ts.createCall(
        ts.createPropertyAccess(
          ts.createIdentifier('console'),
          ts.createIdentifier('log')
        ),
        undefined,
        [ts.createStringLiteral(log)]
      )
    )
  ]);
}

function createTap() {
  return ts.createCall(ts.createIdentifier('tap'), undefined, [
    ts.createArrowFunction(
      undefined,
      undefined,
      [
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          ts.createIdentifier('x'),
          undefined,
          undefined,
          undefined
        )
      ],
      undefined,
      ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      ts.createCall(
        ts.createPropertyAccess(
          ts.createIdentifier('console'),
          ts.createIdentifier('log')
        ),
        undefined,
        [
          ts.createBinary(
            ts.createStringLiteral('added in transformer:'),
            ts.createToken(ts.SyntaxKind.PlusToken),
            ts.createIdentifier('x')
          )
        ]
      )
    )
  ]);
}

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

