
export type SetupPurpose = 'Gaming PC' | 'Streaming' | 'Office' | 'Programming' | 'Graphic Design' | 'Video Editing';

export interface SetupRequest {
  budget: number;
  purpose: SetupPurpose;
  preferences: string;
  includePC: boolean;
  includeMonitor: boolean;
  includePeripherals: boolean;
  language: 'en' | 'ar';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SetupResponse {
  text: string;
  sources: { title: string; url: string }[];
}

export interface AppState {
  language: 'en' | 'ar';
}
