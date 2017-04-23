import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "parseQueryParams is deprecated! Please use `query-params`";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DeprecatedModulesWalker(sourceFile, this.getOptions()));
  }
}

class DeprecatedModulesWalker extends Lint.RuleWalker {
}
