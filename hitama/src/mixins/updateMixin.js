/**
 * Helper mixin for vue-objects, that allow editing and updating DB-Data
 */
export default {
    methods: {
        setData(name, val, source, force = false) {
            let src = source ? source : this;
            if (!force && src[name] == val) return;
            src[name] = val;
            this.setChanged();
        },
        setChanged() {
            this.changed = true;
        },
        createSetData(path, source) {
            let src = source ? source : this;
            return v => this.setData(path, v, src);
        },

    },
    computed: {
        editColor() {
            return this.edit ? 'green' : '';
        }
    },
    data() {
        return {
            changed: false,
            edit: false,
        }
    }
}