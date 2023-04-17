<script setup lang="ts">
import { RgbColor } from '@image-tracer-ts/core'
import { ref, Ref, onMounted, watch } from 'vue'

type Props = {
    imageData: ImageData | (() => Promise<ImageData>)
}
const props = defineProps<Props>()

const canvas: Ref<HTMLCanvasElement | null> = ref(null)

const emit = defineEmits<{
    (e:'pickedColor', color: RgbColor): void
}>()

onMounted(setImage)
watch(() => props.imageData, setImage)

async function getImageData(): Promise<ImageData> {
    const imageData = props.imageData
    if (typeof imageData !== 'function') {
        return imageData
    }
    return await imageData()
}

async function setImage() {
    const imageData = await getImageData()
    canvas.value!.width = imageData.width
    canvas.value!.height = imageData.height
    canvas.value!.getContext('2d')!.putImageData(imageData, 0, 0)
}

function emitPixelColor(e: MouseEvent): void {
    const [x, y] = getScaledCoordinates(e.offsetX, e.offsetY)

    const rgbArray = getContext().getImageData(x, y, 1, 1).data
    const color = RgbColor.fromPixelArray(rgbArray, 0)
    emit('pickedColor', color)
}

function getScaledCoordinates(x: number, y: number): [number, number] {
    const imageWidth = canvas.value!.width
    const imageHeight = canvas.value!.height

    const styling = getComputedStyle(canvas.value!, null)
    const topBorder = styling.borderTopWidth.slice(0, -2)
    const bottomBorder = styling.borderBottomWidth.slice(0, -2)
    const rightBorder = styling.borderRightWidth.slice(0, -2)
    const leftBorder = styling.borderLeftWidth.slice(0, -2)
    const borderWidthX = Number(leftBorder) + Number(rightBorder)
    const borderWidthY = Number(topBorder) + Number(bottomBorder)

    const bbox = canvas.value!.getBoundingClientRect()
    const scaleX = imageWidth / (bbox.width - borderWidthX)
    const scaleY = imageHeight / (bbox.height - borderWidthY)

    return [Math.round(x * scaleX), Math.round(y * scaleY)]
}

function getContext(): CanvasRenderingContext2D {
    const canvasElement = canvas.value
    const ctx = canvasElement?.getContext('2d')
    if (!canvasElement || !ctx) {
        throw new Error()
    }
    return ctx
}
</script>

<template>
    <canvas
        ref="canvas"
        class="picker-canvas"
        @click="emitPixelColor"
    ></canvas>
</template>
<style scoped>
.picker-canvas {
    cursor: crosshair;
    width: 100%;
}
</style>
