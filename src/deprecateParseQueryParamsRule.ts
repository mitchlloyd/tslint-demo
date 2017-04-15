import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "parseQueryParams is deprecated! Please use `query-params`";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DeprecatedModulesWalker(sourceFile, this.getOptions()));
  }
}

class DeprecatedModulesWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    if (node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
      const importString = <ts.StringLiteral>node.moduleSpecifier;

      if (importString.text === 'parse-query-params') {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
      }
    }

    super.visitImportDeclaration(node);
  }
}
