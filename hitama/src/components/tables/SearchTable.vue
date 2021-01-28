<template>
  <v-card
    light
    class="searchtable-wrapper ma-0 px-1 py-1 secondary"
    height="100%"
  >
    <h3 v-if="title" class="text-left">{{ title }}</h3>

    <v-card
      fluid
      dark
      class="searchtable-header d-flex align-center justify-space-between ma-0 pa-1 mb-1"
    >
      <!-- #################### SEARCH INPUT ####################-->
      <v-card light class="ma-0 pa-0 d-flex justify-center align-center">
        <TextField name="Search" v-model="searchValue" />
      </v-card>

      <!-- #################### FILTER SELECT ####################-->
      <v-card light class="ma-0 pa-0">
        <v-select
          v-if="useFilter"
          @change="(v) => (filterSelectValue = v)"
          :items="_filterItems"
          label="Filter by..."
          outlined
          hide-details
          dense
          item-value="selValue"
          return-object
        >
        </v-select>
      </v-card>

      <slot name="searchbar"></slot>
    </v-card>
    <v-card class="searchtable-body" dark>
      <v-simple-table class="secondary">
        <template v-slot:default>
          <thead>
            <tr>
              <th
                v-for="(header, index) in _headers"
                :key="index"
                class="text-left"
              >
                <v-container
                  class="ma-0 pa-0 d-flex flex-row justify-start align-center"
                >
                  <label :for="`order_${index}`">{{ header }}</label>
                  <div
                    v-if="orderItems.includes(index)"
                    class="d-flex flex-column"
                  >
                    <v-btn
                      x-small
                      icon
                      @click="
                        orderSelectValue = {
                          value: { name: header, value: 'asc' },
                        }
                      "
                      ><v-icon>mdi-arrow-up-bold-circle</v-icon></v-btn
                    >
                    <v-btn
                      x-small
                      icon
                      @click="
                        orderSelectValue = {
                          value: { name: header, value: 'desc' },
                        }
                      "
                      ><v-icon>mdi-arrow-down-bold-circle</v-icon></v-btn
                    >
                  </div>
                </v-container>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, itemIndex) in processedItems"
              :key="itemIndex"
              @click="() => (data.onclick ? data.onclick() : () => {})"
            >
              <td
                v-for="(header, index) in headers"
                :key="index"
                class="text-left"
              >
                <v-card height="60px" class="d-flex align-center" flat>
                  <User
                    v-if="isType(header, 'user')"
                    light
                    :userId="data[header.name]"
                  />
                  <Icon
                    v-else-if="isType(header, 'img')"
                    :src="data[header.name]"
                  />
                  <v-icon v-else-if="isType(header, 'bool')">{{
                    data[header.name] ? "mdi-check" : "mdi-close"
                  }}</v-icon>

                  <DateBlock
                    v-else-if="isType(header, 'date')"
                    :value="data[header.name]"
                  />

                  <template v-else
                    ><h3>
                      {{ data[header.name] }}
                    </h3></template
                  >
                </v-card>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <slot name="other"></slot>
  </v-card>
</template>

<script>
import util from "../../util";
import Icon from "../Icon";
import User from "../User";
import SearchTableMixin from "../../mixins/SearchTableMixin";
import TextField from "../forms/TextField";
import DateBlock from "../DateBlock";
export default {
  name: "SearchTable",
  mixins: [SearchTableMixin],
  components: {
    User,
    Icon,
    TextField,
    DateBlock,
  },
  computed: {
    _headers() {
      let items = [];
      this.headers.forEach((header) => {
        items.push(header.value);
      });
      return items;
    },
    _filterItems() {
      let items = [];
      this.filterItems.forEach((item, index) => {
        let { name, value, text } = item;
        items.push(this.createSelObj(text, name, value, index));
      });
      return items;
    },
    processedItems() {
      let searchFiltered = this.searchFilter(this.items, this.searchValue);
      let filtered = this.filter(searchFiltered);
      let sorted = this.sort(filtered);
      return sorted;
    },
  },
  methods: {
    createSelObj(text, name, value, selValue) {
      return {
        text,
        value: { name, value },
        selValue,
      };
    },
    isType(header, type) {
      return header.type && header.type === type;
    },
    getSelectionValue(selObj) {
      return selObj ? selObj.value : selObj;
    },
    filter(items) {
      let { name, value } = this.getSelectionValue(this.filterSelectValue);
      return items.filter((item) => {
        if (typeof value == "function") return value(item[name]);
        return value === "" || item[name] === value;
      });
    },
    sort(items) {
      let { name, value } = this.getSelectionValue(this.orderSelectValue);
      let sorted = items.sort((a, b) => ("" + a[name]).localeCompare(b[name]));
      if (value == "desc") sorted.reverse();
      return sorted;
    },
  },
  data() {
    return {
      util,
      orderSelectValue: "",
      filterSelectValue: "",
      searchValue: "",
    };
  },
};
</script>

<style>
.searchtable-wrapper {
  overflow: hidden;
}

.searchtable-header {
  height: 3rem;
}

.searchtable-body {
  height: calc(100% - 3rem);
  overflow: auto;
}

tbody tr {
  transition: all 0.1s;
}

tbody tr:hover {
  transform: translateY(-0.25rem);
}

td {
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 0 !important;
  background: transparent;
}

td > * {
  background: transparent !important;
  border-radius: 0 !important;
}
</style>