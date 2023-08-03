import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		this.addCommand({
			id: 'format-yunxiao-share-link-to-markdown-link-command',
			name: 'format yunxiao share link to markdown link command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log('param: ' + editor.getSelection());
				const formatResult = this.formatLink(editor.getSelection());
				console.log('format result: ' + formatResult);
				editor.replaceSelection(formatResult);
			}
		});
	}

	formatLink(link: string) {
		// https://devops.aliyun.com/projex/bug/SISKIN-3882# 《Fedex TDF 文件字段存储取值错误》
		// 需要提取的内容: "{url} 《{title}》"
		link = link.trim();
		const regex = '(https.*#) (《.*》)';
		// if match, replace to [$2]($1)
		const replacedText = link.replace(new RegExp(regex), '[$2]($1)');
		return replacedText;
	}

	onunload() {
		console.log('Unloading MyPlugin');
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
