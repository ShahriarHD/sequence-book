export interface SequenceConfig {
    sequences: Sequence[]
}

export interface Sequence {
    title: string
    steps: string[]
}

export interface LinkDetails {
    title: string
    url: string
}