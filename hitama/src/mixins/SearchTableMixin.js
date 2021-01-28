/**
 * Basic SearchTable props
 */
export default {
    props: {
        searchFilter: {
            type: Function,
            default: (items, value) => items
        },
        title: {
            type: String,
            default: "",
        },
        useFilter: {
            type: Boolean,
            default: false,
        },
        headers: {
            type: Array,
            default: () => [],
        },
        items: {
            type: Array,
            default: () => [],
        },
        orderItems: {
            type: Array,
            default: () => [0],
        },
        // filter by exact match
        filterItems: {
            type: Array,
            default: () => [],
        },
    }
}