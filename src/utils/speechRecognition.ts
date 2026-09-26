export interface SpeechRecognitionHookResult {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Helper for standard SpeechRecognition API
export class AudioDictationHelper {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor(
    private onResult: (text: string, isFinal: boolean) => void,
    private onError: (error: string) => void,
    private onEnd: () => void
  ) {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.isSupported = true;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            this.onResult(finalTranscript, true);
          } else if (interimTranscript) {
            this.onResult(interimTranscript, false);
          }
        };

        this.recognition.onerror = (event: any) => {
          this.onError(event.error);
        };

        this.recognition.onend = () => {
          this.onEnd();
        };
      }
    }
  }

  public getSupported(): boolean {
    return this.isSupported;
  }

  public setLanguage(lang: string) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start() {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Speech recognition start failed or already active', e);
      }
    }
  }

  public stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Speech recognition stop failed', e);
      }
    }
  }
}
