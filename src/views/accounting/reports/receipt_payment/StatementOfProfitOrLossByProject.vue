<template>
	<v-row>
		<v-col sm="12" cols="12" class="grayBg px-6" >
			<v-card color="white" class="pa-3 no_border "  elevation="0">
				<v-row class="mt-0">
					<v-col sm="9" cols="12" class="py-0">
						<div v-if="columnBy === '1'">
							<app-searchdate
								:initStartDate="startDate"
								@emitStartDate="startDate = $event"
								:initEndDate="endDate"
								@emitEndDate="endDate = $event"
							/>
						</div>
						<div v-else>
							<app-fiscal-date-dropdownlist
								:initFiscalDate="fiscalDate"
								@emitFiscalDate="fiscalDate = $event"
							/>
						</div>
					</v-col>
					<v-col sm="3" cols="12" class="py-0">
						<level-coa-dropdownlist
							:initLevelCoa="levelCoa"
							@emitLevelCoa="levelCoa = $event"
						/>
					</v-col>
				</v-row>
				<v-row class="mt-0">
					<v-col class="py-0" sm="3" cols="3">
						<label class="label">{{ $t("disable_column_by") }}</label>
						<v-select
							class="mt-1"
							:items="columnsBy"
							item-text="text"
							item-value="value"
							v-model="columnBy"
							clearable
							outlined
						/>
					</v-col>
					<v-col class="py-0" sm="3" cols="3">
						<label class="label">{{ $t("project") }}</label>
						<app-project-dropdownlist
							:initProject="project"
							@emitProject="project = $event"
						/>
					</v-col>
					<v-col sm="3" cols="3" class="py-0">
						<div class="report_expor">
							<label class="mb-1">{{ $t("reporting_language") }}:</label>
							<app-reporting-language
								:initLanguage="reportingLanguage"
								@emitLanguage="reportingLanguage = $event"
							/>
						</div>
					</v-col>
					<v-col class="py-0" sm="3" cols="3">
						<v-btn class="white--text dv_mt" color="primary" @click="search">
							{{ $t("run_report") }}
						</v-btn>
					</v-col>
				</v-row>
				<v-row class="mt-0">
					<v-col sm="12" cols="12" class="custom_expansion">
						<kendo-datasource
							ref="statementPLDS"
							:data="statementPLList"
							:schema="schemaDefinition"
							:sort="sortDefinition"
							:group="groupDefinition"
							:aggregate="aggregateDefinition"
						/>

						<kendo-grid
							id="gridSPL"
							class="custom_grid"
							:data-source-ref="'statementPLDS'"
							:dataBound="dataBound"
							:change="onGridChanges"
							:selectable="true"
							:persistSelection="true"
							:sortable="true"
							:column-menu="true"
							:reorderable="true"
							:resizable="true"
							:noRecords="true"
							:toolbar="['excel']"
							:excel-file-name="'incomeStatement.xlsx'"
							:excel-filterable="true"
							:columns="columns"
						/>
					</v-col>
				</v-row>
				<LoadingMe
					:isLoading="showLoading"
					:fullPage="false"
					:myLoading="true"
				/>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import kendo from "@progress/kendo-ui";
import { i18n } from "@/i18n";
import Helper from "@/helper.js";
import { dataStore } from "@/observable/store";

/* Store */
import store from "@/store";
const institute = store.state.institute.institute;

const { incomeStatementHandler } = require("@/scripts/AppHandlers");
const { columnsBy } = require("@/scripts/default_setup/DateSearch.js");
const NumberInWord = require("@/scripts/default_setup/NumberInWord.js");

export default {
	components: {
		LoadingMe: () => import("@/components/Loading"),
		"app-searchdate": () => import("@/components/custom_templates/SearchDate"),
		"app-reporting-language": () =>
			import("@/components/kendo_templates/ReportingLanguageDropDownList"),
		"app-fiscal-date-dropdownlist": () =>
			import("@/components/kendo_templates/FiscalDateDropDownList"),
		"app-project-dropdownlist": () =>
			import("@/components/dropdownlist/Project"),
		"level-coa-dropdownlist": () =>
			import("@/components/dropdownlist/LevelCoa"),
	},
	data: () => ({
		// Obj
		startDate: "",
		endDate: "",
		statements: [],
		statementPLList: [],
		project: null,
		levelCoa: "",// Default primary
		columnBy: "1", //Default Total
		columnsBy: columnsBy,
		fiscalDate: institute.fiscalDate[0],
		fiscalDates: institute.fiscalDate,
		fiscalMonths: Helper.generateFiscalMonths(
			institute.fiscalDate[0].start_date,
			institute.fiscalDate[0].end_date,
			"12"
		),
		Helper: Helper,
		// Reporting Language
		reportingLanguage: "english",
		fieldName: "name",
		fieldType: "type",
		footerName: "Surplus Or (Deficit)",
		// LodingMe
		showLoading: false,
		/* KENDO */
		columns: [],
		sortDefinition: { field: "number", dir: "asc" },
		groupDefinition: [],
		aggregateDefinition: [
			{ field: "balance", aggregate: "sum" },
			{ field: "zero", aggregate: "sum" },
			{ field: "one", aggregate: "sum" },
			{ field: "two", aggregate: "sum" },
			{ field: "three", aggregate: "sum" },
			{ field: "four", aggregate: "sum" },
			{ field: "five", aggregate: "sum" },
			{ field: "six", aggregate: "sum" },
			{ field: "seven", aggregate: "sum" },
			{ field: "eight", aggregate: "sum" },
			{ field: "nine", aggregate: "sum" },
			{ field: "ten", aggregate: "sum" },
			{ field: "eleven", aggregate: "sum" },
		],
		schemaDefinition: {
			model: { id: "accountUUID" },
		},
	}),
	methods: {
		/* KENDO */
		/* On grid changes => link to GL */
		onGridChanges() {
			let grid = kendo.jQuery("#gridSPL").data("kendoGrid");
			let selectedItem = grid.dataItem(grid.select());

			this.$router.push({
				path: "general_ledger",
				query: {
					account_id: selectedItem.accountUUID,
					start_date: this.startDate,
					end_date: this.endDate,
				},
			});
		},
		// Search journals
		search() {
			if (this.project !== null) {
				let sdate = this.startDate,
					edate = this.endDate;

				// Generate Fiscal Months
				if (this.columnBy !== "1") {
					sdate = this.fiscalDate.start_date;
					edate = this.fiscalDate.end_date;

					this.fiscalMonths = Helper.generateFiscalMonths(
						sdate,
						edate,
						this.columnBy
					);
				}

				if (sdate && edate) {
					sdate = kendo.toString(new Date(sdate), "yyyy-MM-dd") + "T00:00:00.000Z";
					edate = kendo.toString(new Date(edate), "yyyy-MM-dd") + "T23:59:59.999Z";
				} else {
					sdate = 0;
					edate = 0;
				}

				// Empty dataSource
				let ds = this.$refs.statementPLDS.kendoWidget();
				ds.data([]);

				/* Generate Group By */
				this.generateGroupBy();

				// Query
				this.showLoading = true;
				incomeStatementHandler
					.getByProject(
						{
							params: {
								start_date: sdate,
								end_date: edate,
								group_by: this.columnBy,
							},
						},
						this.project.id,
						this.levelCoa
					)
					.then((res) => {
						if (res) {
							this.statements = res.data;
							this.bindData();
						}else{
							this.$snotify.error(i18n.t("error_something_wrong"));
						}
					})
					.finally(() => {
						// this.showLoading = false;
					});
			} else {
				this.$snotify.warning(i18n.t("please_select_project"));
			}
		},
		bindData(){
			let entries = [];
			this.statements.forEach(value => {
				/* Receipt */
				if(value.statementGroup.toLowerCase() === "revenue" || value.statementGroup.toLowerCase() === "other revenue"){
					value.statementType = "Receipt";
					value.order = 1000;

					entries.push(value);
				}else{/* Payment */
					if(value.account_type_number < 100){
						value.statementType = "Payment";
						value.order = 2000;

						entries.push(value);
					}
				}

				/* Receipt */
				if(value.account_type_number === 105){
					value.statementType = this.footerName;
					value.order = 3000;

					entries.push(value);
				}
			});

			/* Bind data */
			this.statementPLList = entries;

			/* Generate Column */
			this.generateColumn();

			this.showLoading = false;
		},
		// Row Template
		accountTmpl(dataItem) {
			let name = dataItem.number;

			if (this.reportingLanguage === "local") {
				name += " - " + dataItem.local_name;
			} else {
				name += " - " + dataItem.name;
			}

			return name;
		},
		typeGroupHeaderTmpl(dataItem) {
			let name = dataItem.items[0].type;

			if (this.reportingLanguage === "local") {
				name = dataItem.items[0].type_local_name;
			}

			return name;
		},
		// Generate Columns
		generateColumn() {
			let defaultColumns = [
				{
					field: this.fieldName,
					title: i18n.t("account"),
					template: this.accountTmpl,
					locked: true,
					width: 300,
				},
				{
					field: "statementType",
					title: i18n.t("statement_type"),
					groupHeaderTemplate: "<span class='text-bold text-black'>#=value#</span>",
					hidden: true,
					width: 250,
				},
				{
					field: this.fieldType,
					title: i18n.t("type"),
					hidden: true,
					groupHeaderTemplate: this.typeGroupHeaderTmpl,
					width: 300,
				},
				{
					field: "statementGroup",
					title: i18n.t("statement_group"),
					hidden: true,
					groupHeaderTemplate:
						"<span class='text-bold text-black'>#=value#</span>",
					width: 300,
				},
				{
					field: "groupNature",
					title: i18n.t("nature"),
					hidden: true,
					groupHeaderTemplate:
						"<span class='text-bold text-black'>#=value#</span>",
					width: 300,
				},
			];

			let headerAttributes = {
					class: "table-header-cell",
					style: "text-align: right;padding-right: 35px; font-size: 14px",
				},
				attributes = {
					class: "table-cell",
					style: "text-align: right; font-size: 14px",
				};

			switch (this.columnBy) {
				case "12": // MONTH
					for (let i = 0; i < 12; i++) {
						defaultColumns.push({
							field: NumberInWord[i],
							title: this.fiscalMonths[i],
							format: "{0:n}",
							width: 200,
							aggregates: "['sum']",
							groupHeaderColumnTemplate:
								"<div class='text-right text-bold text-black'>#=kendo.toString(sum, 'n')#</div>",
							headerAttributes: headerAttributes,
							attributes: attributes,
						});
					}

					this.columns = defaultColumns;

					break;

				case "4": // QUARTER
					for (let i = 0; i < 4; i++) {
						defaultColumns.push({
							field: NumberInWord[i],
							title: this.fiscalMonths[i],
							format: "{0:n}",
							width: 200,
							aggregates: "['sum']",
							groupHeaderColumnTemplate:
								"<div class='text-right text-bold text-black'>#=kendo.toString(sum, 'n')#</div>",
							headerAttributes: headerAttributes,
							attributes: attributes,
						});
					}

					this.columns = defaultColumns;

					break;

				case "2": // SEMI-ANNUAL
					// Expand Column [0] width
					defaultColumns[0].width = 400;

					for (let i = 0; i < 2; i++) {
						defaultColumns.push({
							field: NumberInWord[i],
							title: this.fiscalMonths[i],
							format: "{0:n}",
							width: 300,
							aggregates: "['sum']",
							groupHeaderColumnTemplate:
								"<div class='text-right text-bold text-black'>#=kendo.toString(sum, 'n')#</div>",
							headerAttributes: headerAttributes,
							attributes: attributes,
						});
					}

					this.columns = defaultColumns;

					break;

				default:
					// TOTAL
					// Expand Column [0] width
					defaultColumns[0].width = 600;

					defaultColumns.push({
						field: "balance",
						title: i18n.t("total"),
						format: "{0:n}",
						width: 300,
						aggregates: "['sum']",
						groupHeaderColumnTemplate:
							"<div class='text-right text-bold text-black'>#=kendo.toString(sum, 'n')#</div>",
						headerAttributes: headerAttributes,
						attributes: attributes,
					});

					this.columns = defaultColumns;

					break;
			}
		},
		/* Databound */
		dataBound(e) {
			let grid = e.sender;

			grid.dataSource.data().forEach((value) => {
				if (value.account_type_number === 105) {
					let row = grid.tbody
						.find("tr[data-uid='" + value.uid + "']")
						.prev(".k-grouping-row");
					grid.collapseGroup(row);
				}
			});
		},
		// On Reporint Language Changes
		onReportingLanguageChanges() {
			this.fieldName = "name";
			this.fieldType = "type";
			this.footerName = "Surplus Or (Deflicit)";
			if (this.reportingLanguage === "local") {
				this.fieldName = "local_name";
				this.fieldType = "type_local_name";
				this.footerName = "អតិរេក/ឱនភាព";
			}

			// Generate Group By
			this.generateGroupBy();

			// Generate column with new language
			this.generateColumn();
		},
		// Generate Group By
		generateGroupBy() {
			let groupDefinition = [];

			/* Default group */
			groupDefinition.push({
				field: "statementType",
				aggregates: this.aggregateDefinition,
				compare: function(a, b) {
					if (a.items[0].order === b.items[0].order) {
						return 0;
					} else if (a.items[0].order > b.items[0].order) {
						return 1;
					} else {
						return -1;
					}
				},
			});
			
			/* Level Coa */
			if(this.levelCoa !== ""){
				groupDefinition.push({ field: this.fieldType, aggregates: this.aggregateDefinition });
			}

			/* Apply Group Definition */
			this.groupDefinition = groupDefinition;
		},
	},
	watch: {
		reportingLanguage() {
			this.onReportingLanguageChanges();
		},
	},
	computed: {
		appType() {
			return dataStore.productType;
		},
	},
	mounted() {
		// Generate Group By
		this.generateGroupBy();

		// Initial Grid Columns
		this.generateColumn();
	},
};
</script>

<style scoped>
.reports_list {
	width: 100%;
	background-color: #fff;
	padding: 20px 20px 5px;
}
.report_filter {
	background-color: #f8f8f9;
	padding: 0 20px 5px 20px;
	position: relative;
}
.dv_mt {
	margin-top: 24px;
}
.report_export {
	position: absolute;
	top: 15px;
}
.report_total {
	padding: 12.5px;
	text-align: right;
	text-transform: uppercase;
	font-weight: 700;
	border-top: 1px solid #333;
	border-bottom: 1px solid #333;
}
.custom_expansion
	.v-expansion-panel-header
	.v-expansion-panel-header__icon
	.v-icon {
	display: none !important;
}
.v-expansion-panel {
	border-bottom: 1px solid #cccccc;
	border-radius: 0;
}
.v-expansion-panel::before {
	box-shadow: none;
}
.v-expansion-panel-header {
	padding: 15px;
}
.v-expansion-panel-content__wrap {
	padding: 0 35px 10px;
}
@media (max-width: 576px) {
	.dv_mt,
	.dv_mt8 {
		margin-top: 0;
	}
	.reports_list {
		margin-top: 0;
	}
}
</style>
