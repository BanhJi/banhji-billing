<template>
  <v-app class="zoom-in">
    <v-container>
        <v-row>
            <v-col sm="12" cols="12">
                <v-card color="white" class="pa-4 no_border" elevation="0">
                    <v-row>
                        <v-col sm="12" cols="12" class="tab_wrapper py-0">
                            <v-tabs>
                                <v-row>
                                    <v-col
                                        sm="12"
                                        cols="12"
                                        class="py-0 pr-0"
                                        style="display: inherit;">
                                        <v-tab>
                                            <span>
                                            {{ $t("expense") }}
                                            </span>
                                        </v-tab>
                                        <v-tab>
                                            <span>
                                            {{ $t("categories") }}
                                            </span>
                                        </v-tab>
                                    </v-col>
                                </v-row>
                                <v-tab-item>
                                    <v-card flat>
                                        <v-card-text class="">
                                          <ExpensesReport />
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab-item>
                                    <v-card flat>
                                        <v-card-text class="">
                                          <CategoiresAccount/>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { data ,dataStore} from "@/observable/store";
// import {  } from "@/observable/store";
export default {
  name: "RevenueTabs",
  components: {
    ExpensesReport: ()=> import("./ExpensesReport"),
    CategoiresAccount: () => import("./CategoiresAccount")
  },
  data: () => ({
    // active_tab: data.customer_tab.main
    active_in_tabs: data.customer_tab_main,
  }),
  computed: {
    active_tab() {
      return data.customer_tab_main;
    },
    type(){
      return dataStore.productType;
    }
  },
  watch: {
    active_tab() {
      this.active_in_tabs = this.active_tab;
    },
    active_in_tabs() {
      data.customer_tab_main = this.active_in_tabs;
    },
  },
  methods: {

  },
};
</script>
<style scoped>
.v-menu__content .v-list .v-list-item {
  min-height: 35px !important;
}

.tab_wrapper {
  position: relative;
  display: inherit;
}

.v-tab {
  min-width: 30px;
  font-size: 20px;
  text-transform: capitalize;
}

.v-icon--left {
  margin-right: 0px;
}

.theme--light.v-tabs > .v-tabs-bar {
  border-bottom: 1px solid #ddd !important;
}

.menuable__content__active {
  left: 448px !important;
}

.v-tab--active {
  background-color: #e5effa;
  color: #000;
}

.theme--light.v-tabs >>> .v-tabs-bar {
  border-bottom: 1px solid #ddd !important;
}

.v-card__text {
  padding: 0 !important;
}
</style>
