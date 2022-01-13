import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log("webSearchAll activate !");

	let disposable = vscode.commands.registerTextEditorCommand('selections-web-search.webSearchAll', function (textEditor, edit) {
		//加载配置
		let searchUrl = vscode.workspace.getConfiguration('selections-web-search').get('url', 'https://www.google.com/search?q=%s');

		//读取选中文本
		const text = textEditor.document.getText(textEditor.selection);
		console.log('selections ->%s', text);

		//判断空内容
		if (emptyStr(text)) {
			vscode.window.showInformationMessage('webSearchAll require edit selections !');
			return;
		}

		//去除markdown标记。
		var textWithoutMd = text.trim().replace(/[\t]*[-\*\+]+(.*)/g, '$1')      //全局匹配无序列表
			.replace(/[\t]*[0-9]+\.(.*)/g, '$1')                           //全局匹配有序列表
			.replace(/#+(.*)/g, '$1');                                 //全局匹配标题

		//以换行作为第一次分割
		textWithoutMd.replace("\r\n", "\n").replace("\r", "\n")
			.split("\n").forEach(function (line) {
				if (emptyStr(line)) {
					return;
				}

				//以中英文`?`作为第二次分割
				line.split(/[?|？]/).forEach(
					function (query) {
						if (emptyStr(query)) {
							return;
						}
						console.log('query ->%s', query);
						vscode.env.openExternal(vscode.Uri.parse(searchUrl.replace("%s", query.trim())));
					}
				);
			});

		function emptyStr(str: string = ''): boolean {
			return str.trim().length === 0;
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
