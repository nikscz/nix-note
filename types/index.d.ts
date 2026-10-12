export type LastPrompt = string

declare module 'claude-code' {
  interface PluginState {
    'nix-note': { lastPrompt: LastPrompt }
  }
}
