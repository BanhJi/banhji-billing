<template>
	<v-row>
		<v-col sm="12" cols="12" class="">
			<v-card color="white" class="no_border" elevation="0">
				<!-- Title -->
				<v-row>
					<v-col sm="10" cols="12" class="py-0">
						<h3 class="text-left mb-1 font_20 line_24">
							{{ $t("budget_performance_report") }}
						</h3>
						<p class="mb-0">
							{{ $t("class_budget_performance_report_desc") }}
						</p>
					</v-col>
				</v-row>

				<!-- Search -->
				<v-row class="mt-0">
					<v-col sm="4" cols="12" class="py-0 pt-6">
						<app-fiscal-date-dropdownlist
							:initFiscalDate="fiscalDate"
							@emitFiscalDate="fiscalDate = $event"
							@onChanged="onFiscalDateChanges"
						/>
					</v-col>
					<v-col sm="4" cols="12" class="py-0 pt-6">
						<app-segment-dropdownlist
							:initSegment="segment"
							@emitSegment="segment = $event"
							@onChanged="loadBudget"
						/>
					</v-col>
					<v-col sm="4" cols="12" class="py-0 pt-6">
						<app-project-dropdownlist
							:initProject="project"
							@emitProject="project = $event"
							@onChanged="loadBudget"
						/>
					</v-col>
				</v-row>
				<v-row class="mt-0">
					<v-col sm="4" cols="12" class="py-0 pt-6">
						<app-month-of-picker
							:initMonthOf="monthOf"
							@emitMonthOf="monthOf = $event"
							@onChanged="onMonthOfChanges"
							:initMin="minMonth"
							:initMax="maxMonth"
						/>
					</v-col>
					<v-col sm="4" cols="12" class="py-0 pt-6">
						<v-select
							class="mt-1"
							:loading="budgetLoading"
							:disabled="monthOf === ''"
							placeholder="Select Budget"
							v-model="budget"
							:items="budgetList"
							item-text="name"
							item-value="uuid"
							return-object
							clearable
							outlined
						/>
					</v-col>
					<v-col sm="4" cols="12" class="py-0">
						<v-btn
							color="primary"
							class="text-capitalize mt-7 white--text"
							@click="search"
						>
							{{ $t("run_report") }}
						</v-btn>
					</v-col>
				</v-row>

				<!-- Summary -->
				<v-row>
					<v-col class="pt-0" sm="6" cols="12">
						<template>
							<v-simple-table class="table_list nomal_table">
								<template>
									<tbody>
										<tr>
											<td style="width: 45%; font-weight: 900">
												{{ $t("budget_name") }}:
											</td>
											<td class="">{{ budget.name }}</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("segment") }}:</td>
											<td class="btb" v-if="budget.segment">
												{{ budget.segment.name }}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("project") }}:</td>
											<td class="btb" v-if="budget.project">
												{{ budget.project.name }}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("fiscal_year") }}:</td>
											<td class="btb" v-if="budget.fiscal_year">
												{{
													Helper.formatFiscalDate(budget.fiscal_year.start_date)
												}}
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</template>
					</v-col>
					<v-col class="pt-0" sm="6" cols="12">
						<template>
							<v-simple-table class="table_list nomal_table">
								<template>
									<tbody>
										<tr>
											<td style="font-weight: 900">{{ $t("created_by") }}:</td>
											<td class="" v-if="budget.created_by.email">
												{{budget.created_by.email}}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("created_at") }}:</td>
											<td class="" v-if="budget.created_date">
												{{ formatDateTime(budget.created_date) }}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("last_edited_at") }}:</td>
											<td class="" v-if="budget.modified_date">
												{{ formatDateTime(budget.modified_date) }}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("last_edited_by") }}:</td>
											<td class="" v-if="budget.modified_by.email">{{budget.modified_by.email}}</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</template>
					</v-col>
				</v-row>

				<!-- Grid -->
				<v-row>
					<v-col sm="12" cols="12" class="pt-1">
						<template>
							<treelistdatasource 
								ref="statementDS"
								:data="statementList"
								:schema-model="model">
							</treelistdatasource>

							<treelist 
								ref="statementGrid"
								data-source-ref="statementDS"
								:resizable="true"
								:columns="columns"
								:dataBound="onDataBound" />

							<LoadingMe
								type="loading"
								:isLoading="showLoading"
								:myLoading="true"
								:fullPage="false"
							/>
						</template>
					</v-col>
				</v-row>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import kendo from "@progress/kendo-ui";
import { i18n } from "@/i18n";
import Helper from "@/helper.js";
/* Models */
import SegmentModel from "@/scripts/model/Segment.js";
import ProjectModel from "@/scripts/model/Project.js";
import BudgetModel from "@/scripts/model/Budget.js";
import ClassModel from "@/scripts/model/Clazz.js";
import ClassBudgetPerformanceModel from "@/scripts/model/ClassBudgetPerformance.js";

import { TreeList } from '@progress/kendo-treelist-vue-wrapper';
import { TreeListDataSource } from '@progress/kendo-datasource-vue-wrapper';

const BudgetHandler = require("@/scripts/handler/workingcapital/budgetHandler");

export default {
	components: {
		LoadingMe: () => import("@/components/Loading"),
		"app-fiscal-date-dropdownlist": () =>
			import("@/components/kendo_templates/FiscalDateDropDownList"),
		"app-month-of-picker": () =>
			import("@/components/kendo_templates/MonthOfPicker"),
		"app-segment-dropdownlist": () =>
			import("@/components/dropdownlist/Segment"),
		"app-project-dropdownlist": () =>
			import("@/components/dropdownlist/Project"),
		'treelist': TreeList,
		'treelistdatasource': TreeListDataSource,
	},
	data: () => ({
		monthOf: "",
		budget: new BudgetModel(),
		segment: new SegmentModel(),
		project: new ProjectModel(),
		budgetList: [],
		statements: [],
		statementList: [],
		fiscalDate: null,
		fiscalMonths: [],
		minMonth: "",
		maxMonth: "",
		Helper: Helper,
		columns: [],
		model: {
			id: "uuid",
			expanded: true
		},
		// LoadingMe
		showLoading: false,
		budgetLoading: false,
	}),
	methods: {
		onFiscalDateChanges() {
			this.monthOf = "";
			this.budget = new BudgetModel();
			this.fiscalMonths = [];

			if (this.fiscalDate !== null) {
				/* Set Month Range */
				this.minMonth = this.fiscalDate.start_date;
				this.maxMonth = this.fiscalDate.end_date;

				/* Generate Months */
				this.fiscalMonths = Helper.generateFiscalMonths(
					this.fiscalDate.start_date,
					this.fiscalDate.end_date,
					"12"
				);

				/* Load Budget */
				this.loadBudget();
			}
		},
		formatDateTime(value) {
            return kendo.toString(new Date(value), `dd-MMM-yyyy h:mm tt`);
        },
		onMonthOfChanges() {
			if (this.statements.length > 0) {
				/* Bind Data */
				this.bindData();
			}
		},
		async loadBudget() {
			this.budgetLoading = true;

			let budgets = await this.$store.dispatch('budgets/getList'),
				segments = await this.$store.dispatch('segments/getList'),
				projects = await this.$store.dispatch('projects/getList');

			let budgetList = [];
			budgets.forEach((value) => {
				if (value.fiscal_year.uuid === this.fiscalDate.uuid 
					&& value.segment_uuid === this.segment.id 
					&& value.project_uuid === this.project.id) {
					let budget = new BudgetModel(value);
					budget.segment = new SegmentModel(
						segments.find((i) => i.id === value.segment_uuid)
					);
					budget.project = new ProjectModel(
						projects.find((i) => i.id === value.project_uuid)
					);

					budgetList.push(budget);
				}
			});
			this.budgetList = budgetList;

			this.budgetLoading = false;
		},
		/* Search */
		search() {
			if (this.budget.uuid !== "") {
				let asOfDate = kendo.toString(new Date(this.monthOf), "yyyy-MM-dd") + "T23:59:59.999Z";

				// Empty statementDS
				let ds = this.$refs.statementDS.kendoWidget();
				ds.data([]);

				// Query Income Statement
				this.showLoading = true;
				BudgetHandler.getActualClassBudget({
						params: {
							as_of_date: asOfDate,
							budget_uuid: this.budget.uuid
						},
					})
					.then((res) => {
						if (res.data) {
							this.statements = res.data;
							this.bindData();
						}else {
							this.$snotify.error(i18n.t("error_something_wrong"));
						}
					})
					.finally(() => {
						// this.showLoading = false;
					});
			} else {
				/* Alert Warning */
				this.$snotify.warning(i18n.t("please_select_budget"));
			}
		},
		async bindData() {
			let entries = [], g = {}, childrenIds = [];
			
			/* Find index of selected month */
			let	budgetMonthFormated = kendo.toString(new Date(this.monthOf), "yyyy-MM");

			// Classes
			let classes = await this.$store.dispatch("classes/getList");

			/* Gathering from budget lines */
			this.budget.lines.forEach((value) => {
				let entry = new ClassBudgetPerformanceModel();

				/* Children Ids */
				childrenIds.push(value.account_uuid);

				/* Set Class Information(using account_uuid as class_uuid) */
				let clazz = new ClassModel(
					classes.find((i) => i.id === value.account_uuid)
				);
				entry.uuid = clazz.id;
				entry.name = clazz.name; /* by rothny */
				entry.code = clazz.code;

				/* Set class object */
				entry.classes = clazz;

				/* Set Parent Id */
				entry.parentId = null;
				/* Nature */
				if(clazz.clazz.id !== ""){
					entry.parentId = clazz.clazz.id;

					/* Parent */
					let parentLine = new ClassBudgetPerformanceModel();
					parentLine.uuid = clazz.clazz.id,
					parentLine.name = clazz.clazz.name,
					parentLine.code = clazz.clazz.code, /* by rothny */
					parentLine.parentId = null;
					g[clazz.clazz.id] = parentLine;
				}
				/* Type */
				if(clazz.classType.id !== ""){
					entry.parentId = clazz.classType.id;

					/* Parent */
					let parentLine = new ClassBudgetPerformanceModel();
					parentLine.uuid = clazz.classType.id,
					parentLine.name = clazz.classType.name,
					parentLine.code = clazz.classType.code, /* by rothny */
					parentLine.parentId = clazz.clazz.id;
					g[clazz.classType.id] = parentLine;
				}
				/* Group */
				if(clazz.classGroup.id !== ""){
					entry.parentId = clazz.classGroup.id;

					/* Parent */
					let parentLine = new ClassBudgetPerformanceModel();
					parentLine.uuid = clazz.classGroup.id,
					parentLine.name = clazz.classGroup.name,
					parentLine.code = clazz.classGroup.code, /* by rothny */
					parentLine.parentId = clazz.classType.id;
					g[clazz.classGroup.id] = parentLine;
				}
				/* Sub Group */
				if(clazz.classSubGroup.id !== ""){
					entry.parentId = clazz.classSubGroup.id;

					/* Parent */
					let parentLine = new ClassBudgetPerformanceModel();
					parentLine.uuid = clazz.classSubGroup.id,
					parentLine.name = clazz.classSubGroup.name,
					parentLine.code = clazz.classSubGroup.code, /* by rothny */
					parentLine.parentId = clazz.classGroup.id;
					g[clazz.classSubGroup.id] = parentLine;
				}
				
				/* BUDGET */
				/* Budget Whole */
				entry.budget_whole = kendo.parseFloat(value.amount);

				value.monthly_amount.forEach((mline) => {
					/* Budget Month */
					if (mline.month_of === budgetMonthFormated) {
						entry.budget_month = kendo.parseFloat(mline.amount);
					}

					/* Budget YTD */
					if (kendo.toString(new Date(mline.month_of), "yyyy-MM-dd") 
						<= kendo.toString(new Date(this.monthOf), "yyyy-MM-dd")) {
						entry.budget_ytd += kendo.parseFloat(mline.amount);
					}
				});

				/* ACTUAL */
				if(this.statements.hasOwnProperty("lines")){
					this.statements.lines.forEach((plline) => {
						if (plline.account_uuid === value.account_uuid) {
							/* Actual Whole */
							entry.actual_whole = kendo.parseFloat(plline.actual_amount);/* B Kethya uses this field for actual whole */
							
							if(plline.hasOwnProperty("actual_monthly_amount")){
								plline.actual_monthly_amount.forEach(actMonth => {
									let monthlyAmount = kendo.parseFloat(actMonth.amount);

									/* Actual Month */
									if(actMonth.month_of === this.monthOf){
										entry.actual_month = monthlyAmount;
									}

									/* Actual YTD */
									if(new Date(actMonth.month_of) <= new Date(this.monthOf)){
										entry.actual_ytd += monthlyAmount;
									}
								});
							}
						}
					});
				}

				/* Percentage = Actual / Budget */
				if (entry.budget_month !== 0) {
					entry.month_percentage = entry.actual_month / entry.budget_month;
				}
				if (entry.budget_ytd !== 0) {
					entry.ytd_percentage = entry.actual_ytd / entry.budget_ytd;
				}
				if (entry.budget_whole !== 0) {
					entry.whole_percentage = entry.actual_whole / entry.budget_whole;
				}

				/* Add entry */
				entries.push(entry);
			});

			/* Add Parents */
			for (let key in g)
			entries.push(g[key]);

			/* Parent aggregate sum */
			for (let i = 0; i < entries.length; i++) {
				let entry = entries[i];
				
				if(~childrenIds.indexOf(entry.uuid)){
					let parentId = entry.parentId;
					while(parentId !== null){
						let parent = entries.find((item) => item.uuid === parentId);
						parent.balance += entry.balance;
						/* Budget */
						parent.budget_month += entry.budget_month;
						parent.budget_ytd += entry.budget_ytd;
						parent.budget_whole += entry.budget_whole;

						/* Actual */
						parent.actual_month += entry.actual_month;
						parent.actual_ytd += entry.actual_ytd;
						parent.actual_whole += entry.actual_whole;

						/* Percentage */
						parent.month_percentage += entry.month_percentage;
						parent.ytd_percentage += entry.ytd_percentage;
						parent.whole_percentage += entry.whole_percentage;

						/* Set new parent id */
						parentId = parent.parentId;
					}
				}
			}

			/* Total */
			let totalRow = new ClassBudgetPerformanceModel({
				name: "Total",
			});
			for (let i = 0; i < entries.length; i++) {
				let entry = entries[i];
				if(~childrenIds.indexOf(entry.uuid)){
					totalRow.balance += entry.balance;
					/* Budget */
					totalRow.budget_month += entry.budget_month;
					totalRow.budget_ytd += entry.budget_ytd;
					totalRow.budget_whole += entry.budget_whole;

					/* Actual */
					totalRow.actual_month += entry.actual_month;
					totalRow.actual_ytd += entry.actual_ytd;
					totalRow.actual_whole += entry.actual_whole;

					/* Percentage */
					totalRow.month_percentage += entry.month_percentage;
					totalRow.ytd_percentage += entry.ytd_percentage;
					totalRow.whole_percentage += entry.whole_percentage;
				}
			}
			entries.push(totalRow);
			
			/* BIND STATMENT */
			this.statementList = entries;

			/* Generate Columns */
			this.generateColumn();

			this.showLoading = false;
		},
		// Generate Columns
		generateColumn() {
			let headerAttributes = {
					"class": "table-header-cell",
					style: "text-align: center;font-weight: bold; font-size: 16px",
				},
				subHeaderAttributes = {
					"class": "table-header-cell",
					style: "text-align: right; font-size: 14px",
				},
				attributes = {
					"class": "table-cell",
					style: "text-align: right; font-size: 14px",
				};

			/* Columns */
			let columns = [
				{
					field: "name",
					title: i18n.t("class"),
					template: this.nameTmpl,
					headerAttributes: headerAttributes,
					locked: true,
					width: 300,
				},
				/* Selected Month */
				{
					title: kendo.toString(new Date(this.monthOf), "MMMM yyyy"),
					headerAttributes: headerAttributes,
					columns: [
						{
							field: "budget_month",
							title: i18n.t("budget"),
							format: "{0:n}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
						{
							field: "actual_month",
							title: i18n.t("actual"),
							format: "{0:n}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
						{
							field: "month_percentage",
							title: "%",
							format: "{0:p}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
					],
				},
				/* YTD(up to selected month) */
				{
					title: i18n.t("ytd_up_to_selected_month"),
					headerAttributes: headerAttributes,
					columns: [
						{
							field: "budget_ytd",
							title: i18n.t("budget"),
							format: "{0:n}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
						{
							field: "actual_ytd",
							title: i18n.t("actual"),
							format: "{0:n}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
						{
							field: "ytd_percentage",
							title: "%",
							format: "{0:p}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
					],
				},
				/* Whole Year */
				{
					title: i18n.t("whole_year"),
					headerAttributes: headerAttributes,
					columns: [
						{
							field: "budget_whole",
							title: i18n.t("budget"),
							format: "{0:n}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
						{
							field: "actual_whole",
							title: i18n.t("actual"),
							format: "{0:n}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
						{
							field: "whole_percentage",
							title: "%",
							format: "{0:p}",
							width: 150,
							headerAttributes: subHeaderAttributes,
							attributes: attributes,
						},
					],
				},
			];

			/* Set Columns */
			this.columns = columns;
		},
		/* On databound */
		onDataBound (e) {
			var headers = e.sender.thead.children();
			for (var i = 0; i < headers.length; i++) {
				var th = kendo.jQuery(headers[i]);
				th.css("font-weight", "bold");
				th.css("text-align", "center");
			}

			var rows = e.sender.tbody.children();
			for (var j = 0; j < rows.length; j++) {
				var row = kendo.jQuery(rows[j]);
				var dataItem = e.sender.dataItem(row);
				
				/* Amount align right */
				row.css("text-align", "right");

				/* Parent in bold */
				if(dataItem.get("hasChildren")){
					row.css("font-weight", "bold");
				}

				/* Last Row */
				if(j === rows.length -1){
					row.css("font-weight", "bold");
				}
			}
		},
		nameTmpl(dataItem){
			let name = dataItem.name;
			if(dataItem.hasChildren){
				name = `<span style='font-weight: bolder;'>${dataItem.code} - ${dataItem.name}</span>`;
			}

			if(dataItem.name === "Total"){
				name = `<span style='font-weight: bolder;'>${dataItem.name}</span>`;
			}

			return name;
		},
	},
	watch: {
		budget() {
			// Prevent null error
			if (this.budget === null) {
				this.budget = new BudgetModel();
			}
		},
	},
	mounted() {
	},
};
</script>

<style scoped>
.theme--light.v-data-table {
	background-color: transparent !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
	height: 32px !important;
	border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
	border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}
.v-data-table.simple1_table.theme--light,
.v-data-table > .v-data-table__wrapper > table > tbody > tr:first-child > td {
	border-top: thin solid rgba(0, 0, 0, 0.12) !important;
}
.v-data-table.simple_table.theme--light {
	border-left: thin solid rgba(0, 0, 0, 0.12) !important;
	border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}

.theme--light.v-data-table.simple1_table
	> .v-data-table__wrapper
	> table
	> thead
	> tr:last-child
	> th:last-child {
	border-right: none !important;
}

.theme--light.v-data-table
	> .v-data-table__wrapper
	> table
	> tbody
	> tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
	background-color: transparent !important;
}

.border-bottom {
	border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.font-small {
	font-size: 12px;
	line-height: 15px;
}

.font-26 {
	font-size: 26px !important;
}
.v-data-table.simple_table.theme--light {
	border-top: thin solid rgba(0, 0, 0, 0.12) !important;
}
.theme--light.v-data-table
	> .v-data-table__wrapper
	> table
	> thead
	> tr:last-child
	> th {
	border-bottom: none !important;
	border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}
.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
	border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
	border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}
.theme--light.v-data-table
	> .v-data-table__wrapper
	> table
	> tbody
	> tr:not(:last-child)
	> td:last-child,
.theme--light.v-data-table
	> .v-data-table__wrapper
	> table
	> tbody
	> tr:not(:last-child)
	> th:last-child,
.theme--light.v-data-table
	> .v-data-table__wrapper
	> table
	> tbody
	> tr
	> td:last-child {
	border-right: none !important;
}

.v-data-table.table_list > .v-data-table__wrapper > table > tbody > tr > td {
	height: 32px !important;
	border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
	border-right: none !important;
}
.v-data-table.table_list.theme--light
	> .v-data-table__wrapper
	> table
	> tbody
	> tr:first-child
	> td {
	border-top: none !important;
}

@media (max-width: 576px) {
}
</style>
