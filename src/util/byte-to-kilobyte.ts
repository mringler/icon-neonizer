export function byteToKilobyte(b: number): string {
    return (b / 1000).toFixed(1)
}

export function svgToKilobyte(svg: string): string {
    const encoder = new TextEncoder();
    const numberOfBytes = encoder.encode(svg).length
    return byteToKilobyte(numberOfBytes)
}