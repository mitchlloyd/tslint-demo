import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "Use our custom location utility!";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new CustomLocationWalker(sourceFile, this.getOptions()));
  }
}

class CustomLocationWalker extends Lint.RuleWalker {
  private isShadowedStack = [false];

  public visitIdentifier(node: ts.Identifier) {
    if (
      node.text === 'location' && (
        (!isProperty(node) && !this.isLocationShadowed()) ||
        isWindowDotLocationIdentifier(node)
      )
    ) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }

    super.visitIdentifier(node);
  }

  public visitVariableDeclaration(node: ts.VariableDeclaration) {
    if (node.name.kind === ts.SyntaxKind.Identifier && node.name.text === 'location') {
      this.isShadowedStack[this.isShadowedStack.length - 1] = true;
    }

    super.visitVariableDeclaration(node);
  }

  protected visitNode(node: ts.Node) {
    const isNewBlockScope = Lint.isBlockScopeBoundary(node);

    if (isNewBlockScope) {
      this.isShadowedStack.push(false);
    }

    super.visitNode(node);

    if (isNewBlockScope) {
      this.isShadowedStack.pop();
    }
  }

  private isLocationShadowed() {
    return this.isShadowedStack[this.isShadowedStack.length - 1]
  }
}

function isWindowDotLocationIdentifier(node) {
  return (
    node.parent.kind === ts.SyntaxKind.PropertyAccessExpression &&
    node.parent.getText() === 'window.location'
  );
}

function isProperty(node) {
  return (
    node.parent.kind === ts.SyntaxKind.PropertyAccessExpression &&
    node.parent.expression !== node
  );
}
