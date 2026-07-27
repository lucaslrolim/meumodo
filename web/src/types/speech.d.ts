export {};

declare global {
  interface SpeechRecognitionResultItem {
    transcript: string;
  }
  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionResultItem;
  }
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    onend: (() => void) | null;
  }
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
