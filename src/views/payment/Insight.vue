<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col sm="12" md="12" cols="12" class="pr-2">
          <v-card
            outlined
            dense
            color="white"
            class="pa-6 no_border"
            min-height="600px"
          >
            <v-row>
              <v-col sm="12" cols="12">
                <h1 class="font_40 primary--text">
                  {{ $t("get_ready_paid") }}
                </h1>
                <v-row>
                  <v-col sm="6" cols="12">
                    <p class="mt-2 niradei_light font_17">
                      {{ $t("get_ready_paid_desc") }}
                    </p>
                  </v-col>
                  <v-col sm="3" cols="12">
                    <v-btn
                      color="primary"
                      class="pa-3 h_60 w_100"
                      elevation="0"
                    >
                      <h1>{{ $t("bill_pay") }}</h1>
                    </v-btn>
                    <p class="font_12 line_14 mt-1">{{ $t("bill_pay_desc") }}</p>
                  </v-col>
                  <v-col sm="3" cols="12">
                    <v-btn
                      color="primary"
                      class="h_60 w_100"
                      outlined
                      elevation="0"
                    >
                      <h1>{{ $t("khqr") }}</h1>
                    </v-btn>
                    <p class="font_12 line_14 mt-1">{{ $t("khqr_desc") }}</p>
                  </v-col>
                </v-row>
              </v-col>
              <v-col sm="4" cols="12">
                <v-card
                  class="pa-4 flex_column_bewteen"
                  color="grayBg"
                  min-height="263"
                  elevation="0"
                >
                  <h1 class="line_30 primary--text">
                    {{ $t("accept_payments") }}
                  </h1>
                  <p class="mt-3 flex-1">{{ $t("accept_payments_desc") }}</p>
                  <div>
                    <v-btn
                      @click="goPayment('started')"
                      color="primary"
                      class="pa-3 mt-6 text-bold text-capitalize"
                      elevation="0"
                    >
                      {{ $t("get_started") }}
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
              <v-col sm="4" cols="12">
                <v-card
                  class="pa-4 flex_column_bewteen"
                  color="grayBg"
                  min-height="263"
                  elevation="0"
                >
                  <h1 class="line_30 primary--text">
                    {{ $t("new_payment_account") }}
                  </h1>
                  <div>
                    <v-btn
                      @click="goPayment('apply')"
                      color="primary"
                      class="pa-3 text-bold text-capitalize"
                      elevation="0"
                    >
                      {{ $t("apply_now") }}
                    </v-btn>
                  </div>
                  <v-card class="d-flex pa-4" elevation="0" color="white">
                    <h1 class="line_30 primary--text">0</h1>
                    <p class="mb-0 ml-3">{{ $t("open_account_payment") }}</p>
                  </v-card>
                </v-card>
              </v-col>
              <v-col sm="4" cols="12">
                <v-card
                  class="pa-4"
                  color="grayBg"
                  min-height="263"
                  elevation="0"
                >
                  <h3
                    class="font_20"
                    :class="{ line_34: this.$i18n.locale == 'kh' }"
                  >
                    {{ $t("payment_connection") }}
                  </h3>
                  <p class="mb-0">
                    {{ $t("as_of_today") }}
                  </p>
                  <v-row>
                    <LoadingMe
                      :isLoading="showLoadingSaleAnalysis"
                      :fullPage="false"
                      :myLoading="true"
                      :type="'loading'"
                    >
                    </LoadingMe>
                    <v-col sm="5" cols="12" class="pb-0 pr-0 pt-0">
                      <template>
                        <v-simple-table class="mt-6">
                          <template>
                            <tbody>
                              <tr class="grayBg--text">
                                <td
                                  class="
                                    text-right
                                    line_16
                                    text-capitalize
                                    pr-0
                                  "
                                >
                                  <span class="niradei_heavy font_18 dark_grey">
                                    10
                                  </span>
                                  <br />
                                  <span
                                    class="niradei_medium font_14 grey--text"
                                  >
                                    {{ $t("bill_payment") }}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  class="
                                    text-right
                                    line_16
                                    text-capitalize
                                    pr-0
                                  "
                                >
                                  <span class="niradei_heavy font_18 dark_grey">
                                    01
                                  </span>
                                  <br />
                                  <span
                                    class="niradei_medium font_14 grey--text"
                                  >
                                    {{ $t("khqr_payment") }}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </template>
                    </v-col>
                    <v-col sm="7" cols="12" class="pb-0 pl-0 pt-0">
                      <chart
                        ref="chart"
                        :legend-visible="false"
                        :series-defaults-labels-visible="false"
                        :series="saleChannelChart"
                        :tooltip-template="tooltipTemplate"
                        :chartArea="chartAreaChart"
                        :tooltip-visible="true"
                        :height="100"
                        :theme="'sass'"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col class="pb-0">
                <p class="grey--text mt-10 mb-0">
                  <span class="text-bold">{{ $t("note") }}: </span>
                  {{ $t("note_desc") }}
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import { i18n } from "@/i18n";
import { Chart } from "@progress/kendo-charts-vue-wrapper";
export default {
  data: () => ({
    isOverlay: false,
    showLoadingSaleAnalysis: false,
    // pie chart
    labelTemplate: "#= category # #= value #%",
    tooltipTemplate: "#= category # : #= value #%",
    chartAreaChart: {
      background: "transparent",
      height: 190,
    },
    saleChannelChart: [
      {
        type: "pie",
        startAngle: 180,
        data: [
          {
            category: i18n.t("credit_card"),
            value: 22,
            color: "#c80000",
          },
          {
            category: i18n.t("working_capital"),
            value: 45,
            color: "#f44336",
          },
          {
            category: i18n.t("investment"),
            value: 11,
            color: "#d85604",
          },
          {
            category: i18n.t("overdraft"),
            value: 22,
            color: "#e88d14",
          },
        ],
      },
    ],
  }),
  methods: {
    goPayment(){
      if(process.env.VUE_APP_MODE  === 'dev'){
        window.open('http://localhost:8081')
      } else if (process.env.VUE_APP_MODE  === 'staging'){
          window.open('https://staging-payments.banhji.com/')
      } else {
         window.open('https://payments.banhji.com/')
      }
    }
  },
  components: {
    chart: Chart,
    LoadingMe: () => import(`@/components/Loading`),
  },
};
</script>
<style scoped>
.h_60 {
  height: 60px !important;
}
.w_100 {
  width: 100% !important;
}
.theme--light.v-data-table {
  background-color: transparent !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  height: 32px !important;
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}

.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: transparent !important;
}
p {
  font-family: "Niradei-Light" !important;
}
</style>
