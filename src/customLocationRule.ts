import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.TypedRule {
  public static FAILURE_STRING = "Use our custom location utility!";

  public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
    const walker = new CustomLocationWalker(sourceFile, this.getOptions(), program);
    return this.applyWithWalker(walker);
  }
}

class CustomLocationWalker extends Lint.ProgramAwareRuleWalker {
}
