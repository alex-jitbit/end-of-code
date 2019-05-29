// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log("activated");
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.goToEndOfCode', function () {
		// The code you place here will be executed every time your command is executed

		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			do {
				let languageId = activeEditor.document.languageId; //get current lang (like js or csharp etc)
				let commentSeparator = _langMap.get(languageId);
				if (!commentSeparator) break;

				let lineNum = activeEditor.selection.active.line;
				let line = activeEditor.document.lineAt(lineNum);
				let pos = line.text.indexOf(commentSeparator);
				if (pos < 1) break; //0 is when the whole string is a comment
				
				while (line.text.charAt(pos - 1) === ' ' && pos > 0) pos--;
				let position = new vscode.Position(lineNum, pos);
				activeEditor.selection = new vscode.Selection(position, position);
				return;
			}
			while(false);

			//run default action
			vscode.commands.executeCommand('cursorMove', { to: 'wrappedLineEnd' });
		}
	});

	context.subscriptions.push(disposable);
}

//we need this stupid map
//before vscode make it possible to read the current LanguageConfiguration
//issue here: https://github.com/Microsoft/vscode/issues/2871
const _langMap = new Map([
	["javascript", "//"],
	["csharp", "//"],
	['typescript', '//'],
	['html', '<!--'],
	['cpp', '//'],
	['php', '//'],
	['python', '#'],
	['ruby', '#'],
	['java', '//']
]);

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
