import Vue from 'vue';
import Vuetify from 'vuetify';

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

let mcs = {
    primary: colors.grey.darken4, // #E53935
    secondary: colors.white, // #FFCDD2
    // secondary: colors.grey.lighten5,
    accent: colors.yellow.lighten5, // #3F51B5
    danger: colors.red.darken3
}

let { primary, secondary, accent, danger } = mcs;

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary,
                secondary,
                accent,
                danger
            },
            dark: {
                primary: mcs.secondary,
                secondary: mcs.primary,
                accent: accent,
                danger: danger
            },
        },
    },
});
