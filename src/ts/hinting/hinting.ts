import { commands } from '@rakeli/commands';
import type { Command } from '@rakeli/commands/types';

type TrieNode = {
	children: Map<string, TrieNode>;
	line?: string;
	command?: Command;
};

// Create the root of the trie
export const buildCommandTrie = (commands: Command[]): TrieNode => {
	const root: TrieNode = { children: new Map() };

	for (const command of commands) {
		let node = root;

		for (const char of command.name) {
			if (!node.children.has(char)) {
				node.children.set(char, { children: new Map() });
			}
			node = node.children.get(char)!;
		}

		// Store the command at the end of the word
		node.command = command;
	}

	return root;
};

export const autocompleteCommand = (prefix: string): string[] => {
	if (!prefix || root === null) return [];

	let node = root;

	// Step 1: Traverse the trie to the end of the prefix
	for (const char of prefix) {
		const next = node.children.get(char);
		if (!next) return [];
		node = next;
	}

	// Step 2: Find first matching command in subtree
	function dfs(current: TrieNode): string | undefined {
		if (current.command?.name.startsWith(prefix)) {
			return current.command.name;
		}

		if (current.line?.startsWith(prefix)) {
			return current.line;
		}

		for (const child of current.children.values()) {
			const found = dfs(child);
			if (found) return found;
		}

		return undefined;
	}

	const match = dfs(node);
	return match ? [match] : [];
};

export const findCommand = (name: string): Command | undefined => {
	if (!name || root === null) return undefined;

	let node = root;

	for (const char of name) {
		const next = node.children.get(char);
		if (!next) return undefined;
		node = next;
	}

	// Match only if this node has a full command with exact name
	return node.command?.name === name ? node.command : undefined;
};

export const addSuggestion = (line: string, into: TrieNode = root): void => {
	let node = into;

	for (const char of line) {
		if (!node.children.has(char)) {
			node.children.set(char, { children: new Map() });
		}
		node = node.children.get(char)!;
	}

	node.line = line;
};

const root = buildCommandTrie(commands);
