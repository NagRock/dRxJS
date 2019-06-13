import * as ts from 'typescript';

export const dummyTransformer = <T extends ts.Node>(context: ts.TransformationContext) => {
  return (rootNode: ts.SourceFile) => {
    console.log('Transforming file: ' + rootNode.fileName);

    function visit(node: ts.Node): ts.Node {
      if (rootNode.fileName.endsWith('component.ts') && ts.isImportDeclaration(node)) {
        console.log('IMPORT', node.getText(), ':', node.getSourceFile().getLineAndCharacterOfPosition(node.pos));
      }
      if (rootNode.fileName.endsWith('component.ts') && ts.isCallLikeExpression(node)) {
        console.log('CALL LIKE:', node.getText());
        // console.log(node.parent);
        console.log('> CALL LIKE parent >', node.parent.getText());
        console.log('FILE:', node.getSourceFile().fileName, ':', node.getSourceFile().getLineAndCharacterOfPosition(node.pos));
      }
      if (rootNode.fileName.endsWith('component.ts') && ts.isPropertyAccessExpression(node)) {
        console.log(node.getText());
        if (node.getText().endsWith('.pipe')) {
          console.log('> parent >', node.parent.getText());
          console.log('> childCount >', node.getChildCount());
          node.getChildren().forEach(child => {
            console.log('> child >', child.getText());
            if (child.getText() === 'pipe') {
              console.log('> pipe childCount >', child.getChildCount());
            }
          });
        }
      }
      // if (ts.isCallExpression(node)) {
      //   const calleeExpression = node.expression;
      //   if (ts.isIdentifier(calleeExpression)) {
      //     console.log(calleeExpression.text);
      //   }
      // }
      return ts.visitEachChild(node, visit, context);
    }

    return ts.visitNode(rootNode, visit);
  };
};

