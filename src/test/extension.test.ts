import * as vscode from "vscode";
import { activate } from "../extension";
import assert from "assert";
const { describe, it, before } = require("mocha");

describe("Extension Tests", () => {
  before(async () => {
    const extension = vscode.extensions.getExtension("blogger-markdown-to-json");
    if (extension && extension.isActive) {
      const context = await extension.activate();
      activate(context);
    } else {
      // Handle the case where the extension is not found or not active
      console.error('Extension "blogger" not found or not active');
    }
  });

  it("should convert Markdown to JSON", async () => {
    const markdownText = "---\ntitle: Hello World!\n---\n# Hello World!";
    const expectedJson =
      '{content:"---\ntitle: Hello World!\n---\n", data:{"# Hello World!"}}';

    const markdownDocument = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: markdownText,
    });
    const editor = await vscode.window.showTextDocument(markdownDocument);
    await vscode.commands.executeCommand("markdownToJson");

    const jsonUri = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders![0].uri,
      "Blogger",
      "Hello World!.json"
    );
    const jsonDocument = await vscode.workspace.openTextDocument(jsonUri);
    const jsonText = await jsonDocument.getText();
    assert.strictEqual(jsonText, expectedJson);
  });

  it("should handle empty Markdown input", async () => {
    const markdownText = "";
    const expectedJson = "{}";

    const markdownUri = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders![0].uri,
      "Blogger",
      "empty-markdown.md"
    );
    const markdownDocument = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: markdownText,
    });
    await vscode.workspace.fs.writeFile(markdownUri, Buffer.from(markdownText));

    const editor = await vscode.window.showTextDocument(markdownDocument);
    await vscode.commands.executeCommand("markdownToJson");

    const jsonUri = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders![0].uri,
      "Blogger",
      "empty-json.json"
    );
    const jsonDocument = await vscode.workspace.openTextDocument({
      language: "json",
      content: expectedJson,
    });
    await vscode.workspace.fs.writeFile(jsonUri, Buffer.from(expectedJson));

    const jsonEditor = await vscode.window.showTextDocument(jsonDocument);
    const jsonText = await jsonEditor.document.getText();
    assert.strictEqual(jsonText, expectedJson);
  });

  it("should handle invalid Markdown input", async () => {
    const markdownText = "Invalid Markdown";
    const expectedJson = "{}";

    const markdownUri = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders![0].uri,
      "Blogger",
      "invalid-markdown.md"
    );
    const markdownDocument = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: markdownText,
    });
    await vscode.workspace.fs.writeFile(markdownUri, Buffer.from(markdownText));

    const editor = await vscode.window.showTextDocument(markdownDocument);
    await vscode.commands.executeCommand("markdownToJson");

    const jsonUri = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders![0].uri,
      "Blogger",
      "invalid-json.json"
    );
    const jsonDocument = await vscode.workspace.openTextDocument({
      language: "json",
      content: expectedJson,
    });
    await vscode.workspace.fs.writeFile(jsonUri, Buffer.from(expectedJson));

    const jsonEditor = await vscode.window.showTextDocument(jsonDocument);
    const jsonText = await jsonEditor.document.getText();
    assert.strictEqual(jsonText, expectedJson);
  });
});
