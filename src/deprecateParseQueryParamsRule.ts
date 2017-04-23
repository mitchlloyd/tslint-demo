import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "parseQueryParams is deprecated! Please use `query-params`";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DeprecatedModulesWalker(sourceFile, this.getOptions()));
  }
}

class DeprecatedModulesWalker extends Lint.RuleWalker {
  // Method from https://github.com/palantir/tslint/blob/eea89e5a5b35d6226c02a9dcffeffbe6dd3ebd22/src/language/walker/syntaxWalker.ts
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    // Per ES spec, the moduleSpecifier must be a StringLiteral. However, it is treated as
    // a generic expression so that TypeScript can add better errors.
    if (node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
      // Using a type assertion to allow us to use `text`.
      const importString = <ts.StringLiteral>node.moduleSpecifier;

      // importString.getText() would return "\'parse-query-param\'" or "\"parse-query-param\""
      if (importString.text === 'parse-query-params') {
        // Determines exactly where we report the failure.
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
      }
    }

    // Often we want to call super, this is somewhat rare that we do not.
    // super.visitImportDeclaration(node);
  }
}
