<template>
	<v-row class="">
		<v-col class="pb-0 pt-4" sm="12" cols="12">
			<v-row>
				<v-col class="py-0 pr-md-2" sm="4" cols="12">
					<div class="d-flex">
						<v-card
							outlined
							dense
							color="primary"
							class="pa-2 mb-4 flex-1 no_border niradei_bold"
							min-height="62px">
							<v-row>
								<h6 class="col-sm-12 col-md-4 font_34 white--text">{{ dueThisWeekInvoice }}</h6>
								<h4 class="text-right white--text flex_right py-0 col-sm-12 col-md-8 font_16 text-uppercase">
									<span  class="">{{$t("due_this_week")}}</span>
								</h4>
							</v-row>
						</v-card>
						<v-btn style="height:62px !important;" color="primary" class="ml-1">
							<v-icon @click="reloadData" size="30" color="white">mdi-reload</v-icon>
						</v-btn>
					</div>
					<v-card outlined
						dense
						class="pa-4 no_border"
						min-height="268"
						color="grayBg">
						<h3 class="font_20" :class="{ line_34: this.$i18n.locale == 'kh' }">{{ $t("expected_due") }}</h3>
						<p class="mb-0">{{ $t("as_of_today") }}</p>
						<h2 class="primary--text mb-0 pa-0 niradei_black mb-0 col-sm-12 text-right">
							{{ expectedBalance }}
						</h2>
						<template>
							<LoadingMe
								:isLoading="showLoadingExpectedDue"
								:fullPage="false"
								:myLoading="true"
								:type="'loading'"/>
							<v-simple-table class="mb-3">
								<template>
									<tbody>
										<tr v-for="item in expectedDue" :key="item.name">
											<td class="text-left pl-0">
												<span class="niradei_medium font_14 grey--text">
													{{ item.name }} {{ $t(item.locale) }}
												</span>
											</td>
											<td class="text-right pr-0">
												<span class="niradei_heavy font_18 dark_grey">
													{{ numberFormat(item.value, item.decimalFormat) }}
												</span>
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</template>
						<v-row>
							<v-col sm="6" class="pr-0 py-0">
								<v-btn to="receipt"
								class="font_16 text-capitalize rounded-0 white--text"
								color="primary">+ {{ $t("receipt") }}
								</v-btn>
							</v-col>
							<v-col sm="6" class="pl-0 pb-0 text-right">
								<router-link to=""
									class="mb-0 niradei_bold font_16 primary--text text-right">{{ $t("view_report") }}
								</router-link>
							</v-col>
						</v-row>
					</v-card>
					<v-card outlined
						dense
						color="grayBg"
						class="pa-4 mt-4 no_border"
						min-height="300px">
						<h3 class="font_20" :class="{ line_34: this.$i18n.locale == 'kh' }">
							{{ $t("total_customers") }}
						</h3>
						<p class="mb-0">
							{{ $t("as_of_today") }}
						</p>
						<h2 class="primary--text mb-0 pa-0 niradei_black mb-0 col-sm-12 text-right">
							{{ customerAsOfCount }}
						</h2>
						<template>
							<LoadingMe
								:isLoading="showLoadingCustomer"
								:fullPage="false"
								:myLoading="true"
								:type="'loading'"/>
							<v-simple-table class="mb-3">
								<LoadingMe
								:isLoading="showLoadingCustomer"
								:fullPage="false"
								:myLoading="true"
								:type="'loading'"/>
								<template>
									<tbody>
										<tr>
											<td class="text-left pl-0">
												<span class="niradei_medium font_14 grey--text text-capitalize">
													{{ $t("new") }}
												</span>
											</td>
											<td class="text-right pr-0">
												<span class="niradei_heavy font_18 dark_grey">
													{{ newCustomer }}
												</span>
											</td>
										</tr>
										<tr>
											<td class="text-left pl-0">
												<span class="niradei_medium font_14 grey--text text-capitalize">
													{{ $t("overdue") }}
												</span>
											</td>
											<td class="text-right pr-0">
												<span class="niradei_heavy font_18 dark_grey">
													{{ overDueThisWeeks }}
												</span>
											</td>
										</tr>
										<tr>
											<td class="text-left pl-0">
												<span class="niradei_medium font_14 grey--text text-capitalize">
													{{ $t("inactive") }}
												</span>
											</td>
											<td class="text-right pr-0">
												<span class="niradei_heavy font_18 dark_grey">{{ inActive }}</span>
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</template>
						<v-row>
							<v-col sm="6" class="pr-0 py-0">
								<v-btn to="individual_customer"
									class="font_16 text-capitalize rounded-0 white--text"
									color="primary">+ {{ $t("new") }}
								</v-btn>
							</v-col>
							<v-col sm="6" class="pl-0 pb-0 text-right">
								<router-link to=""
									class="mb-0 niradei_bold font_16 primary--text text-right">{{ $t("view_report") }}
								</router-link>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
				<v-col class="py-md-0 px-md-2" sm="4" cols="12">
					<v-card outlined
						dense
						color="third"
						class="pa-2 mb-4 no_border niradei_bold "
						min-height="62px">
						<v-row>
							<h6 class="white--text col-sm-12 col-md-6 font_34">
								{{ overCreditLimit }}
							</h6>
							<h4 class="text-right white--text flex_right col-md-6 col-sm-12 py-0 font_16 text-uppercase">
								{{ $t("over_credit_limit") }}
							</h4>
						</v-row>
					</v-card>
				<v-card outlined
					dense
					class="pa-4 no_border"
					min-height="268"
					color="grayBg">
					<h3 class="font_20" :class="{ line_34: this.$i18n.locale == 'kh' }">{{ $t("total_revenue") }}</h3>
					<p class="mb-0">{{ $t("from_the_beginning_year") }}</p>

					<h2 class="primary--text mb-0 pa-0 niradei_black mb-0 col-sm-12 text-right">{{ numberFormat(revenueBalance, decimalFormat) }}</h2>
					<template>
						<LoadingMe
							:isLoading="showLoadingRevenue"
							:fullPage="false"
							:myLoading="true"
							:type="'loading'"/>
						<v-simple-table class="mb-3">
							<template>
								<tbody>
									<tr>
										<td class="text-left pl-0">
											<span class="niradei_medium font_14 grey--text">{{ $t("customers") }}</span>
										</td>
										<td class="text-right pr-0">
											<span class="niradei_heavy font_18 dark_grey">{{ revenueCustomers }}</span>
										</td>
									</tr>
									<tr>
										<td class="text-left pl-0">
											<span class="niradei_medium font_14 grey--text">{{ $t("value_per_invoice") }}</span>
										</td>
										<td class="text-right pr-0">
											<span class="niradei_heavy font_18 dark_grey">{{numberFormat(revenueValuePerInvoice, decimalFormat)}}</span>
										</td>
									</tr>
									<tr>
										<td class="text-left pl-0">
											<span class="niradei_medium font_14 grey--text">{{ $t("invoices") }}</span>
										</td>
										<td class="text-right pr-0">
											<span class="niradei_heavy font_18 dark_grey">{{ revenueInvoices }}</span>
										</td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
					</template>
					<v-row>
						<v-col sm="6" class="pr-0 py-0">
							<v-btn to="invoice"
								class="font_16 text-capitalize rounded-0 white--text"
								color="primary">+ {{ $t("invoice") }}
							</v-btn>
						</v-col>
						<v-col sm="6" class="pl-0 pb-0 text-right">
							<router-link to=""
								class="mb-0 niradei_bold font_16 primary--text text-right">{{ $t("view_report") }}
							</router-link>
						</v-col>
					</v-row>
				</v-card>
				<v-card outlined
					dense
					class="pa-4 mt-4 no_border"
					min-height="300px"
					color="grayBg">
					<v-row>
						<v-col sm="12" cols="12" class="py-0">
							<h3 class="font_20" :class="{ line_34: this.$i18n.locale == 'kh' }">{{ $t("sale_funnel") }}</h3>
							<p class="mb-3">{{ $t("from_the_beginning_year") }}</p>
							<LoadingMe
								:isLoading="showLoadingSaleFunel"
								:fullPage="false"
								:myLoading="true"
								:type="'loading'"/>
							<chart
								:title-text="''"
								:chartArea="chartAreaChartFunnel"
								:legend-visible="false"
								:series-defaults-type="'column'"
								:series="funnel"
								:category-axis="categoryAxisFunnel"
								:value-axis="valueAxisFunnel"
								:tooltip="{
									visible: true,
									template:
									'#= series.name #: #= kendo.toString(value,`n2`) #',
								}"
								:theme="'sass'"/>
						</v-col>
					</v-row>
				</v-card>
				</v-col>
				<v-col class="py-0 pl-md-2" sm="4" cols="12">
					<v-card outlined
						dense
						color="grayBg"
						class="pa-4 no_border"
						min-height="346px">
						<v-row>
							<v-col sm="12" cols="12" class="py-0">
								<h3 class="font_20" :class="{ line_28: this.$i18n.locale == 'kh' }">{{ $t("balance_payment") }}</h3>
								<p :class="{'mb-6': this.$i18n.locale == 'kh', 'mb-7': this.$i18n.locale == 'en',}">{{ $t("from_the_beginning_year") }}</p>
							</v-col>
						</v-row>
						<LoadingMe
							:isLoading="showLoadingGraph"
							:fullPage="false"
							:myLoading="true"
							:type="'loading'"/>
						<chart
							ref="chart"
							:legend-position="'bottom'"
							:legend-visible="false"
							:tooltip="tooltip"
							:series="seriesLine"
							:chartArea="chartArea"
							:category-axis-categories="categories_line"
							:value-axis="valueAxis_line"
							:theme="'sass'"/>
					</v-card>
					<v-card
						outlined
						dense
						class="pa-4 mt-4 no_border"
						min-height="267px"
						color="grayBg">
						<h3 class="font_20" :class="{ line_34: this.$i18n.locale == 'kh' }">{{ $t("sale_analysis") }}</h3>
						<p class="mb-0">{{ $t("from_the_beginning_year") }}</p>
						<v-row>
							<LoadingMe
								:isLoading="showLoadingSaleAnalysis"
								:fullPage="false"
								:myLoading="true"
								:type="'loading'"/>
							<v-col sm="6" cols="12" class="pb-0 pr-1 pt-0">
								<template>
									<v-simple-table class="mt-2">
										<template>
											<tbody>
												<tr>
													<td class="text-right line_16 py-2 text-capitalize pr-0">
														<span class="niradei_heavy font_18 dark_grey">{{ mostTermUsed }}</span>
														<br />
														<span class="niradei_medium font_14 grey--text">{{ $t("payment_term") }}</span>
													</td>
												</tr>
												<tr>
													<td class="text-right line_16 py-2  text-capitalize pr-0">
														<span class="niradei_heavy font_18 dark_grey">
															{{numberFormat(avgRevenuePerCustomer, decimalFormat)}}
														</span>
														<br />
														<span class="niradei_medium font_14 grey--text">
															{{ $t("average_revenue_per_customer") }}
														</span>
													</td>
												</tr>
												<tr>
													<td class="text-right line_16 py-2  text-capitalize pr-0">
														<span class="niradei_heavy font_18 dark_grey">
															{{numberFormatNoCurrency(saleOrderInvoiceToRatio, decimalFormat)}}%
														</span>
														<br />
														<span class="niradei_medium font_14 grey--text">
															{{ $t("sale_order_invoice_ratio") }}
														</span>
													</td>
												</tr>
											</tbody>
										</template>
									</v-simple-table>
								</template>
							</v-col>
							<v-col sm="6" cols="12" class="pb-0 pl-0 pt-0">
								<chart
									ref="chart"
									:legend-visible="false"
									:series-defaults-labels-visible="false"
									:series="saleChannelChart"
									:tooltip-template="tooltipTemplate"
									:chartArea="chartAreaChart"
									:tooltip-visible="true"
									:height="100"
									:theme="'sass'"/>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
import { i18n } from "@/i18n";
import { Chart } from "@progress/kendo-charts-vue-wrapper";
import kendo from "@progress/kendo-ui";

const billingHandler = require("@/scripts/invoice/handler/billingHandler");
const dashboardHandler = require("@/scripts/dashboard/customer/handler/dashboardHandler");
export default {
	components: {
		chart: Chart,
		LoadingMe: () => import(`@/components/Loading`),
	},
	data: () => ({
		//funnel chart
		chartAreaChartFunnel: {
			background: "transparent",
			height: 210,
		},
		funnel: [
			{
				field: "value",
				colorField: "chartColor",
				name: "Total",
				data: [
					{ value: "100", chartColor: "#c80000" },
					{ value: "70", chartColor: "#f44336" },
					{ value: "50", chartColor: "#ED1A3A" },
					{ value: "50", chartColor: "#ED1A3A" },
				],
				//     '100', '70', '50'],
				// color: ['#00b050','#92d050','#212a35'],
				border: {
					width: 0,
				},
			},
		],
		valueAxisFunnel: [
			{
				max: 100,
				line: {
					visible: false,
				},
				minorGridLines: {
					visible: false,
				},
				labels: {
					visible: true,
					font: "10px",
				},
			},
		],
		categoryAxisFunnel: {
			categories: [
				i18n.t("lead"),
				i18n.t("quote"),
				i18n.t("order"),
				i18n.t("invoice"),
			],
			majorGridLines: {
				visible: false,
			},
		},
		tooltip: {
			visible: true,
			template: "#= series.name #: #= kendo.toString(value, `n2`) #",
		},
		// line chart
		seriesLine: [
			{
				type: "line",
				name: "Sale",
				data: [4, 2, 6, 8, 2, 8],
				color: "#4d4848",
			},
			{
				type: "line",
				name: "Purchase",
				data: [1, 6, 9, 5, 4, 5],
				color: "#c80000",
			},
		],
		categories_line: [
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"10",
			"11",
			"12",
		],
		chartArea: {
			background: "transparent",
			height: 230,
		},
		valueAxis_line: [
			{
				max: 1000,
				// visible: false,
				labels: {
					format: "{0}",
				},
			},
		],
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
		asOf: new Date().toISOString().substr(0, 10),
		expectedBalance: 0,
		decimalFormat: "n2",
		lastUpdated: "",
		expectedDue: [],
		customerAsOfCount: 0,
		overDueThisWeeks: 0,
		inActive: 0,
		newCustomer: 0,
		showLoadingExpectedDue: false,
		showLoadingRevenue: false,
		showLoadingCustomer: false,
		showLoadingGraph: false,
		showLoadingSaleAnalysis: false,
		showLoadingSaleFunel: false,
		revenueBalance: 0,
		revenueCustomers: 0,
		revenueInvoices: 0,
		revenueValuePerInvoice: 0,
		baseCurrency: "",
		mostTermUsed: "",
		avgRevenuePerCustomer: "",
		saleOrderInvoiceToRatio: "",
		dueThisWeekPExpense: 0,
		dueThisWeekInvoice: 0,
		overCreditLimit: 0,
	}),
	mounted: async function() {
		await this.loadExpectedDue();
		await this.dashboardReceivableOverviewCustomer();
		await this.dashboardRevenue();
		await this.dashboardSaleFunel();
		await this.dashboardSaleAnalysis();
		await this.dashboardSalePaymentGraph();
		await this.dashboardReceivableOverview();
		await this.dashboardSaleOverCreditLimit();
	},
  methods: {
		async reloadData() {
			await this.loadExpectedDue();
			await this.dashboardReceivableOverviewCustomer();
			await this.dashboardRevenue();
			await this.dashboardSaleFunel();
			await this.dashboardSaleAnalysis();
			await this.dashboardSalePaymentGraph();
			await this.dashboardReceivableOverview();
			await this.dashboardSaleOverCreditLimit();
		},
		numberFormat(value, format) {
			return kendo.toString(value, format);
		},
		numberFormatNoCurrency(value, format) {
			return kendo.toString(value, format);
		},
		async loadExpectedDue() {
			new Promise((resolve) => {
				setTimeout(() => {
					resolve("resolved");
					let strFilter = "";
					strFilter = "?asOf=" + this.asOf + "&type=expected_due";
					this.showLoadingExpectedDue = true;
					billingHandler.wcpReceivableOverviewList(strFilter).then((res) => {
						if (res.data.statusCode === 200) {
							const response = res.data.data[0];
							this.expectedDue = response.lines;
							this.decimalFormat = response.decimalFormat;
							this.lastUpdated = response.lastUpdatedAt;
							const paymentTerm = response.paymentTermUsed;
							this.mostPaymentTermUsed = paymentTerm.name;
							this.expectedBalance = this.numberFormat(
							response.openBalance,
							response.decimalFormat
							);
							this.showLoadingExpectedDue = false;
						}
					});
				}, 10);
			});
		},
		async dashboardReceivableOverviewCustomer() {
			new Promise((resolve) => {
				setTimeout(() => {
					resolve("resolved");
					let strFilter = "";
					strFilter = "?asOf=" + this.asOf;
					this.showLoadingCustomer = true;
					billingHandler.dashboardReceivableOverviewCustomer(strFilter).then((res) => {
						if (res.data.statusCode === 200) {
							this.showLoadingCustomer = false;
							const response = res.data.data;
							this.customerAsOfCount = response.customerAsOfCount;
							this.overDueThisWeeks = response.overDueThisWeeks;
							this.newCustomer = response.newCustomer;
						}
					});
				}, 10);
			});
		},
		async dashboardRevenue() {
			new Promise((resolve) => {
				setTimeout(() => {
					resolve("resolved");
					let strFilter = "";
					strFilter = "?asOf=" + this.asOf;
					this.showLoadingRevenue = true;
					dashboardHandler.customerRevenue(strFilter).then((res) => {
						if (res.data.statusCode === 200) {
							this.showLoadingRevenue = false;
							const response = res.data.data;
							this.revenueBalance = response.exchangeSubtotal || 0;
							this.revenueCustomers = response.customers || 0;
							this.revenueInvoices = response.invoices || 0;
							this.revenueValuePerInvoice = response.valuePerInvoice || 0;
							this.decimalFormat = response.decimalFormat;
							this.baseCurrency = response.baseCurrency || "";
							// window.console.log('response', response)
						}
					});
				}, 10);
			});
		},
		async dashboardSaleFunel() {
			new Promise((resolve) => {
				setTimeout(() => {
					resolve("resolved");
					let strFilter = "";
					strFilter = "?asOf=" + this.asOf;
					this.showLoadingSaleFunel = true;
					dashboardHandler.customerSaleFunel(strFilter).then((res) => {
						if (res.data.statusCode === 200) {
							this.showLoadingSaleFunel = false;
							const response = res.data.data;
							const maxAxe = response.maxValue || 0;
							const axeLength = parseInt(maxAxe).toString().length - 1;
							const axeIncre = parseInt(
								"1" + String(1).padStart(axeLength, "0")
							);
							this.funnel = [
								{
									field: "value",
									colorField: "chartColor",
									name: "Total",
									data: response.series || [],
									border: {
									width: 0,
									},
								},
							];
							this.valueAxisFunnel = [
								{
									max: (response.maxValue || 0) + axeIncre,
									line: {
										visible: false,
									},
									minorGridLines: {
										visible: false,
									},
									labels: {
										visible: true,
										font: "10px",
									},
								},
							];
						}
					});
				}, 10);
			});
		},
		async dashboardSaleAnalysis() {
			new Promise((resolve) => {
				setTimeout(() => {
					resolve("resolved");
					let strFilter = "";
					strFilter = "?asOf=" + this.asOf;
					this.showLoadingSaleAnalysis = true;
					dashboardHandler.customerSaleAnalysis(strFilter).then((res) => {
						if (res.data.statusCode === 200) {
							this.showLoadingSaleAnalysis = false;
							const response = res.data.data;
							const topTerm = response.topTermUsed || {};
							this.mostTermUsed = topTerm.name || "";
							this.avgRevenuePerCustomer = response.averageRevenue || 0;
							this.saleOrderInvoiceToRatio = response.saleOrderRatio || 0;
							const saleChannel = response.saleChannel || [];
							let dataChart = [];
							const colors = [
								"#c80000",
								"#642828",
								"#f44336",
								"#522D2DFF",
								"#d85604",
								"#ED1A3A",
								"#7a4141",
								"#e88d14",
								"#f1aa45",
							];
							let index = 0;
							saleChannel.forEach((j) => {
								dataChart.push({
									category: i18n.t(j.name),
									value: kendo.toString(
										j.saleChannelRatio,
										response.decimalFormat
									),
									color: colors[index],
								});
								index += 1;
								if (index > colors.length) {
									index = 0;
								}
							});
							this.saleChannelChart = [
								{
									type: "pie",
									startAngle: 180,
									data: dataChart,
								},
							];
						} else {
							this.showLoadingSaleAnalysis = false;
						}
					});
				}, 10);
			});
		},
		async dashboardSalePaymentGraph() {
			new Promise((resolve) => {
				setTimeout(() => {
					resolve("resolved");
					let strFilter = "";
					strFilter = "?asOf=" + this.asOf;
					this.showLoadingGraph = true;
					dashboardHandler.customerBalanceNPaymentGraph(strFilter).then((res) => {
						if (res.data.statusCode === 200) {
							this.showLoadingGraph = false;
							const response = res.data.data;
							const balance = response.balance || [];
							const payment = response.payment || [];
							const maxAxe = response.max || 0;
							const axeLength = parseInt(maxAxe).toString().length - 1;
							const axeIncre = parseInt(
								"1" + String(1).padStart(axeLength, "0")
							);
							this.seriesLine = [
								{
									type: "line",
									name: i18n.t("balance"),
									data: balance,
									color: "#4d4848",
								},
								{
									type: "line",
									name: i18n.t("payment"),
									data: payment,
									color: "#c80000",
								},
							];
							this.valueAxis_line = [
								{
									max: maxAxe + axeIncre,
									labels: {
										format: "{0}",
									},
								},
							];
						}
					});
				}, 10);
			});
		},
		async dashboardReceivableOverview() {
			this.showLoading2 = true;
			new Promise((resolve) => {
				setTimeout(() => {
					resolve("resolved");
					let strFilter = "";
					strFilter = "?asOf=" + this.asOf;
					billingHandler.dashboardReceivableOverview(strFilter).then((res) => {
						if (res.data.statusCode === 200) {
							const response = res.data.data;
							this.dueThisWeekPExpense = response.dueThisWeekPExpense;
							this.dueThisWeekInvoice = response.dueThisWeekInvoice;
							this.showLoading2 = false;
						}
					});
				}, 10);
			});
		},
		async dashboardSaleOverCreditLimit() {
			new Promise((resolve) => {
				setTimeout(() => {
					resolve("resolved");
					let strFilter = "";
					strFilter = "?asOf=" + this.asOf;
					this.showLoadingGraph = true;
					dashboardHandler.customerOverCreditLimit(strFilter).then((res) => {
						if (res.data.statusCode === 200) {
							this.showLoadingGraph = false;
							const response = res.data.data;
							this.overCreditLimit = response.overCreditLimit || 0;
						}
					});
				}, 10);
			});
		},
	},
	computed: {},
};
</script>
<style scoped>
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

/*.h_kchart.k-chart{*/
/*    height: 250px !important;*/
/*}*/
.k-chart {
  height: 160px;
  font-family: "Niradei-Medium", serif !important;
}

.dark_grey {
  color: #7e7a7a;
}

.line_16 {
  line-height: 20px;
}

@media (max-width: 576px) {
}
</style>
