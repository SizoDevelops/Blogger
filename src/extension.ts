// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import matter from 'gray-matter';
import path from 'path';



export function activate(context: vscode.ExtensionContext) {
	const intervalId = setInterval(() => {
	  const activeEditor = vscode.window.activeTextEditor;
	}, 1000); // Check every 1 second
  
	const disposable = vscode.commands.registerCommand('markdownToJson', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
		  const text = activeEditor.document.getText();
		  const { content, data } = matter(text);
		  const jsonData = JSON.stringify({ content, data });
		  
		//   create file in file system
		// create a folder called json in the workspace
		const jsonFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, 'Blogger');
		vscode.workspace.fs.createDirectory(jsonFolder);
		
		const jsonFilePath = path.join(jsonFolder.fsPath, `${activeEditor.document.fileName.split('.')[0].split('\\').pop()}.json`);
		const jsonUri = vscode.Uri.file(jsonFilePath);
		console.log(activeEditor.document.fileName.split('.')[0].split('\\').pop());
		vscode.workspace.fs.writeFile(jsonUri, Buffer.from(jsonData));
		}
			
	});
  
	context.subscriptions.push(disposable);
	context.subscriptions.push({
	  dispose: () => clearInterval(intervalId)
	});
  }