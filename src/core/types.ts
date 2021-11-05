export interface SequenceConfig {
    index: string,
    sequences: Sequence[]
}

export interface Sequence {
    index: string,
    title: string,
    steps: string[]
}

export interface LinkDetails {
    title: string
    url: string
}