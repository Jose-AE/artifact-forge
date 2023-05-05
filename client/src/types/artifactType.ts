export interface ArtifactType {
  locked: boolean;
  owner: { username: string; pfp: string };
  showcase: boolean;
  voters: [string];
  votes: number;
  _id: string;

  artifactData: {
    level: number;
    set: string;
    type: string;
    mainStat: {
      [key: string]: number;
    };
    subStats: {
      [key: string]: number;
    };
  };
}
