/**
 * Supported provider definitions for the UI.
 */
export const PROVIDERS = [
  { name: 'openai', label: 'OpenAI', category: 'LLM' },
  { name: 'anthropic', label: 'Anthropic', category: 'LLM' },
  { name: 'google', label: 'Google Gemini', category: 'LLM' },
  { name: 'openrouter', label: 'OpenRouter', category: 'LLM' },
  { name: 'replicate', label: 'Replicate', category: 'IMAGE_GENERATION' },
  { name: 'elevenlabs', label: 'ElevenLabs', category: 'AUDIO' },
  { name: 'tavily', label: 'Tavily', category: 'SEARCH' },
  { name: 'resend', label: 'Resend', category: 'EMAIL' },
  { name: 'cloudflare_r2', label: 'Cloudflare R2', category: 'STORAGE' },
  { name: 'stripe', label: 'Stripe', category: 'WEBHOOKS' },
] as const;

export type ProviderName = (typeof PROVIDERS)[number]['name'];
