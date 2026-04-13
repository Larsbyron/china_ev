/**
 * Translation prompt templates for MiniMax API
 */

export const TRANSLATION_SYSTEM_PROMPT = `Du bist ein professioneller Automobil-Journalist. Übersetze den folgenden Artikel ins Deutsche. Erhalte die Struktur und Formatierung wenn möglich. Gib nur die Übersetzung aus, ohne Erklärungen.`

export interface TranslationPromptOptions {
  title?: string
  preserveFormatting?: boolean
}

export function buildTranslationUserPrompt(
  title: string,
  content: string,
  options: TranslationPromptOptions = {}
): string {
  const { preserveFormatting = true } = options

  let prompt = `Übersetze den folgenden Artikel ins Deutsche.\n\n`

  if (title) {
    prompt += `TITEL: ${title}\n\n`
  }

  prompt += `INHALT:\n${content}`

  if (preserveFormatting) {
    prompt += `\n\nHinweis: Erhalte die Formatierung (Überschriften, Absätze, Aufzählungen) wenn möglich.`
  }

  return prompt
}

export function buildChunkTranslationPrompt(
  chunkContent: string,
  chunkIndex: number,
  totalChunks: number
): string {
  return `Übersetze diesen Teil (${chunkIndex} von ${totalChunks}) ins Deutsche.\n\nINHALT:\n${chunkContent}\n\nGib nur die Übersetzung aus.`
}
