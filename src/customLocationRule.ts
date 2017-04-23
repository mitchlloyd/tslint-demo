import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "Use our custom location utility!";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new CustomLocationWalker(sourceFile, this.getOptions()));
  }
}

class CustomLocationWalker extends Lint.RuleWalker {
  public visitIdentifier(node: ts.Identifier) {
    if (
      node.text === 'location' && (
        !isProperty(node) || isWindowDotLocationIdentifier(node)
      ) && node.parent.kind !== ts.SyntaxKind.PropertyAssignment
    ) {
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    }

    super.visitIdentifier(node);
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
