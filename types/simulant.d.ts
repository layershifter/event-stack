declare module 'simulant' {
  const simulant: {
    fire: (target: Document | HTMLElement | Window, eventType: string) => void
  }

  export default simulant
}
