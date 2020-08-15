const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const loaderUtils = require("loader-utils")

const DEFAULT_OPTIONS = {
  catchCode: identifier => `console.error(${identifier})`,
  identifier: "e",
  finallyCode: null
};

const isAsyncFuncNode = node =>
  t.isFunctionDeclaration(node, {
    async: true
  }) ||
  t.isArrowFunctionExpression(node, {
    async: true
  }) ||
  t.isFunctionExpression(node, {
    async: true
  }) ||
  t.isObjectMethod(node, {
    async: true
  });

module.exports = function (source) {
  let options = loaderUtils.getOptions(this)
  options = { ...DEFAULT_OPTIONS, ...options }
  const ast = parser.parse(source, {
    // 支持 es6 module
    sourceType: "module",
    // 支持动态 import
    plugins: ["dynamicImport"]
  })

  if (typeof options.catchCode === "function") {
    options.catchCode = options.catchCode(options.identifier);
  }
  const catchNode = parser.parse(options.catchCode).program.body;
  const finallyNode =
    options.finallyCode && parser.parse(options.finallyCode).program.body;

  traverse(ast, {
    AwaitExpression(path) {
      while (path && path.node) {
        const parentPath = path.parentPath

        if (t.isBlockStatement(path.node) && isAsyncFuncNode(parentPath.node)) {
          const tryCatchAST = t.tryStatement(
            path.node,
            t.catchClause(
              t.identifier(options.identifier),
              t.blockStatement(catchNode)
            ),
            finallyNode && t.blockStatement(finallyNode)
          )
          path.replaceWithMultiple([tryCatchAST])
          return
        } else if (t.isBlockStatement(path.node) && t.isTryStatement(parentPath.node)) {
          // 若已包含 try 语句
          return
        }
        path = parentPath
      }
    }
  })
  return source
}