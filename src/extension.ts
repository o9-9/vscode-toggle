import { isWeb } from '@env/platform'
import type { ExtensionContext } from 'vscode'
import { ExtensionMode, Uri, version as codeVersion, env, window } from 'vscode'
import { fromOutputLevel } from './config'
import { Container } from './container'
import { Configuration, configuration } from './system/configuration'
import { Logger } from './system/logger'
import { satisfies } from './system/version'

export function activate(context: ExtensionContext) {
	const extensionVersion: string = context.extension.packageJSON.version
	const prerelease = satisfies(extensionVersion, '> 2023.0.0')

	Logger.configure(
		{
			name: 'Toggle Excluded',
			createChannel: function (name: string) {
				return window.createOutputChannel(name)
			},
			toLoggable: function (o: any) {
				if (o instanceof Uri) return `Uri(${o.toString(true)})`
				return undefined
			},
		},
		fromOutputLevel(configuration.get('outputLevel')),
		context.extensionMode === ExtensionMode.Development,
	)

	Logger.log(
		`VSCode Toggle${prerelease ? ' (pre-release)' : ''} v${extensionVersion} activating in ${
			env.appName
		}(${codeVersion}) on the ${isWeb ? 'web' : 'desktop'}`,
	)

	Configuration.configure(context)
	Container.create(context)
}

export function deactivate() {
	// nothing to do
}
