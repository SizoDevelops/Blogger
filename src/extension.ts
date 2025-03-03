// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import matter from "gray-matter";
import path from "path";
import stringify from "json-stringify-pretty-compact";
export function activate(context: vscode.ExtensionContext) {
  //   const intervalId = setInterval(() => {
  //     const activeEditor = vscode.window.activeTextEditor;
  //   }, 1000); // Check every 1 second

  const disposable = vscode.commands.registerCommand(
    "markdownToJson",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        const text = activeEditor.document.getText();
        const { content, data } = matter(text);
        const jsonData = { content, data };

        //   create file in file system
        // Find src folder in workspace
        // const jsonFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, 'MarkdownToJson');
        // vscode.workspace.fs.createDirectory(jsonFolder);
        const workspaceFolders = vscode.workspace.workspaceFolders!;
        if (workspaceFolders) {
          const srcFolder = vscode.Uri.file(
            workspaceFolders[0].uri.fsPath + "/src"
          );
          const markdownFolder = vscode.Uri.file(
            srcFolder.fsPath + "/markdown"
          );

          vscode.workspace.fs.createDirectory(srcFolder);
          vscode.workspace.fs.createDirectory(markdownFolder);

          const jsonFilePath = path.join(
            markdownFolder.fsPath,
            `${activeEditor.document.fileName
              .split(".")[0]
              .split("\\")
              .pop()}.json`
          );
          const jsonUri = vscode.Uri.file(jsonFilePath);

          const formattedJson = stringify(jsonData, {
            indent: 2, // use 2 spaces for indentation
            maxLength: 40, // wrap lines at 80 characters
          });
          vscode.workspace.fs.writeFile(jsonUri, Buffer.from(formattedJson));

          //   use a formarter to format this file
        }
      }
    }
  );

  context.subscriptions.push(disposable);
  //   context.subscriptions.push({
  //     dispose: () => clearInterval(intervalId),
  //   });
}
