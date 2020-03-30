export const enum ContentScriptMessageType {
  LOADED = 'CONTENT_SCRIPT:LOADED',
  INSTRUMENTED = 'CONTENT_SCRIPT:INSTRUMENTED',
}

export interface ContentScriptLoaded {
  message: ContentScriptMessageType.LOADED;
}

export interface ContentScriptInstrumented {
  message: ContentScriptMessageType.INSTRUMENTED;
}

export type ContentScriptMessage
  = ContentScriptLoaded
  | ContentScriptInstrumented;
