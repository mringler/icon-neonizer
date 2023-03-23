import type { GradientDrawerOptions } from '@/scripts/background/tracer/svg-drawer/gradient-drawer-options'

type OptionFormProps = {
    options: GradientDrawerOptions
    showHelp: boolean
}

export type OptionFormPropsType = Readonly<Omit<OptionFormProps, never> & {}>

export function useOptionsFormInputProps() {
    return {
        options: { type: Object, required: true },
        showHelp: { type: Boolean, default: false },
    }
}
