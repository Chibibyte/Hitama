/**
 * Basic Modal props
 */
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: undefined,
        },
        msg: {
            type: String,
            default: undefined,
        },
        msg2: {
            type: String,
            default: undefined,
        },
        onClose: {
            type: Function,
            default: () => {},
        },
    }
}