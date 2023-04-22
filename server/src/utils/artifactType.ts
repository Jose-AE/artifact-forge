export interface ArtifactI {
  level: number;
  set: string;
  type: string;
  mainStat: {
    [key: string]: number;
  };
  subStats: {
    [key: string]: number;
  };
}
