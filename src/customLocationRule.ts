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
  public visitIdentifier(node) {
    if (node.text === 'location') {
      // This is the TypeScript type checker!
      // https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
      const checker = this.getTypeChecker();

      const type = checker.getTypeAtLocation(node);

      if (checker.typeToString(type) === 'Location') {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
      }
    }

    // No super because identifiers don't have children.
  }
}
