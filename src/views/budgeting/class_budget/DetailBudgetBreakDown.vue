<template>
	<v-row>
		<v-col sm="12" cols="12" >
			<v-card color="white" class=" no_border" elevation="0">
				<v-row>
					<v-col sm="10" cols="12" class="py-0">
						<h3 class="text-left mb-1 font_20 line_24">
							{{ $t("detail_budget_breakdown") }}
						</h3>
						<p class="mb-0">
							{{ $t("a_detail_breakdown_of_budget_by_months") }}
						</p>
					</v-col>
				</v-row>

				<!-- Search -->
				<v-row class="mt-0">
					<v-col sm="4" cols="12" class="pr-0">
						<label class="mb-1">{{ $t("select_fiscal_date") }}:</label>
						<app-fiscal-date-dropdownlist
							:initFiscalDate="fiscalDate"
							@emitFiscalDate="fiscalDate = $event"
							@onChanged="onFiscaldateChanges"
						/>
					</v-col>

					<v-col sm="4" cols="12" class="pr-0">
						<label class="mb-1">{{ $t("select_budget") }}:</label>
						<v-select
							class="mt-1"
							:disabled="fiscalDate === null"
							@change="onChangeBudget"
							placeholder="Select Budget"
							v-model="budget"
							:items="budgets"
							item-text="name"
							item-value="uuid"
							return-object
							clearable
							outlined
						/>
					</v-col>
				</v-row>

				<!-- Summary -->
				<v-row class="mt-0">
					<v-col class="pt-0" sm="6" cols="12">
						<template>
							<v-simple-table class="table_list nomal_table">
								<template>
									<tbody>
										<tr>
											<td style="width: 45%;font-weight: 900">
												{{ $t("budget_name") }}:
											</td>
											<td>{{ budget.name }}</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("segment") }}:</td>
											<td v-if="budget.segment">
												{{ budget.segment.name }}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("project") }}:</td>
											<td v-if="budget.project">
												{{ budget.project.name }}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("fiscal_year") }}:</td>
											<td v-if="budget.fiscal_year">
												{{
													kendo.toString(new Date(budget.fiscal_year.start_date), `yyyy`)
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
											<td v-if="budget.created_by.email">
												{{budget.created_by.email}}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("created_on") }}:</td>
											<td v-if="budget.created_date">
												{{ kendo.toString(new Date(budget.created_date), `dd-MMM-yyyy h:mm tt`)}}
											</td>
										</tr>
										<tr>
											<td style="font-weight: 900">{{ $t("last_edited_on") }}:</td>
											<td>{{ kendo.toString(new Date(budget.modified_date), `dd-MMM-yyyy h:mm tt`) }}</td>
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
								ref="budgetLineDS"
								:data="budgetLineList"
								:schema-model="model"
								:aggregate="aggregate" />

							<treelist 
								ref="budgetLineTreeList"
								data-source-ref="budgetLineDS"
								:resizable="true"
								:columns="columns" />

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
import BudgetLineModel from "@/scripts/model/BudgetLine.js";
import ClassModel from "@/scripts/model/Clazz.js";
import SegmentModel from "@/scripts/model/Segment.js";
import ProjectModel from "@/scripts/model/Project.js";
import BudgetModel from "@/scripts/model/Budget.js";

import { TreeList } from '@progress/kendo-treelist-vue-wrapper';
import { TreeListDataSource } from '@progress/kendo-datasource-vue-wrapper';

const NumberInWord = require("@/scripts/default_setup/NumberInWord.js");

export default {
	components: {
		LoadingMe: () => import("@/components/Loading"),
		"app-fiscal-date-dropdownlist": () =>
			import("@/components/kendo_templates/FiscalDateDropDownList"),
		'treelist': TreeList,
		'treelistdatasource': TreeListDataSource,
	},
	data: () => ({
		fiscalDate: null,
		fiscalMonths: [],
		budget: new BudgetModel(),
		budgets: [],
		budgetLineList: [],
		Helper: Helper,
		/* Kendo */
		kendo: kendo,
		columns: [],
		aggregate: [
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
		model: {
			id: "uuid",
			expanded: true
		},
		// LoadingMe
		showLoading: false,
	}),
	methods: {
		async search() {
			/* Clear */
			this.budget = new BudgetModel();
			this.fiscalMonths = [];

			if (this.fiscalDate !== null) {
				this.showLoading = true;

				/* Generate Months */
				this.fiscalMonths = Helper.generateFiscalMonths(
					this.fiscalDate.start_date,
					this.fiscalDate.end_date,
					"12"
				);

				/* Load Budget */
				let budgets = await this.$store.dispatch('budgets/getList'),
					segments = await this.$store.dispatch('segments/getList'),
					projects = await this.$store.dispatch('projects/getList');

				let budgetList = [];
				budgets.forEach((value) => {
					if (value.fiscal_year.uuid === this.fiscalDate.uuid && value.project_uuid !== ''  && value.segment_uuid !== "") {
						let budget = new BudgetModel(value);

						/* Segment */
						budget.segment = new SegmentModel(
							segments.find((i) => i.id === value.segment_uuid)
						);
						/* Project */
						budget.project = new ProjectModel(
							projects.find((i) => i.id === value.project_uuid)
						);

						budgetList.push(budget);
					}
				});
				this.budgets = budgetList;

				this.showLoading = false;
			} else {
				/* Alert Warning */
				this.$snotify.warning(i18n.t("please_select_fiscaldate"));
			}
		},
		/* On Fiscaldate Changes */
		onFiscaldateChanges(){
			this.search();
		},
		/* On Change Budget */
		onChangeBudget() {
			let ds = this.$refs.budgetLineDS.kendoWidget();
			ds.data([]);

			if (this.budget !== null) {
				this.bindData();
			}
		},
		/* Bind Data */
		async bindData() {
			let entries = [], g = {};

			this.showLoading = true;

			// Classes
			let classes = await this.$store.dispatch("classes/getList");

			/* Gathering from budget lines */
			this.budget.lines.forEach((value) => {
				let entry = new BudgetLineModel(value);

				/* Set Account Information */
				let clazz = new ClassModel(
					classes.find((i) => i.id === value.account_uuid)
				);
				entry.name = clazz.name;
				entry.code = clazz.code; /* by rothny */

				/* Set class object */
				entry.classes = clazz;
				
				/* Set Parent Id */
				entry.parentId = null;
				/* Nature */
				if(clazz.clazz.id !== ""){
					entry.parentId = clazz.clazz.id;

					/* Parent */
					let line = new BudgetLineModel();
					line.uuid = clazz.clazz.id,
					line.name = clazz.clazz.name,
					line.code = clazz.clazz.code, /* by rothny */
					line.parentId = null;
					g[clazz.clazz.id] = line;
				}
				/* Type */
				if(clazz.classType.id !== ""){
					entry.parentId = clazz.classType.id;

					/* Parent */
					let line = new BudgetLineModel();
					line.uuid = clazz.classType.id,
					line.name = clazz.classType.name,
					line.code = clazz.classType.code, /* by rothny */
					line.parentId = clazz.clazz.id;
					g[clazz.classType.id] = line;
				}
				/* Group */
				if(clazz.classGroup.id !== ""){
					entry.parentId = clazz.classGroup.id;

					/* Parent */
					let line = new BudgetLineModel();
					line.uuid = clazz.classGroup.id,
					line.name = clazz.classGroup.name,
					line.code = clazz.classGroup.code, /* by rothny */
					line.parentId = clazz.classType.id;
					g[clazz.classGroup.id] = line;
				}
				/* Sub Group */
				if(clazz.classSubGroup.id !== ""){
					entry.parentId = clazz.classSubGroup.id;

					/* Parent */
					let line = new BudgetLineModel();
					line.uuid = clazz.classSubGroup.id,
					line.name = clazz.classSubGroup.name,
					line.code = clazz.classSubGroup.code, /* by rothny */
					line.parentId = clazz.classGroup.id;
					g[clazz.classSubGroup.id] = line;
				}

				/* Total */
				entry.balance = value.amount;

				/* Monthly */
				for (let i = 0; i < 12; i++) {
					const element = value.monthly_amount[i];
					const indexName = NumberInWord[i];

					entry[indexName] = element.amount;
				}

				/* Add entry */
				entries.push(entry);
			});

			/* Add Parents */
			for (let key in g){
				let parent = g[key];
				for (let i = 0; i < 12; i++) {
					const indexName = NumberInWord[i];
					parent[indexName] = "";
				}
				entries.push(parent);
			}
			
			/* BIND STATMENT */
			this.budgetLineList = entries;
			this.generateColumn();

			this.showLoading = false;
		},
		// Generate Columns
		generateColumn () {
			let headerAttributes = {
					style: "text-align: center;font-weight: bolder; font-size: 14px"
				},
				attributes = {
					style: "text-align: right; font-size: 14px"
				};

			/* Columns */
			let columns = [
				{ 
					field: "name", 
					title: i18n.t('class'),
					template:"<span>#=code# - #=name#</span>",
					footerTemplate: "Total",
					locked: true,
					width:400
				},
				{ 
					field: "note", 
					title: i18n.t('note'),
					width:150
				},
				{ 
					field: "balance",
					title: i18n.t('total'),
					format: "{0:n}",
					width:150,
					footerTemplate: this.footerTemplate,
					headerAttributes: headerAttributes,
					attributes: attributes,
				},
			]
			
			/* Monthly */
			for (let i = 0; i < 12; i++) {
				const element = this.fiscalMonths[i];

				columns.push({
					field: `${NumberInWord[i]}`,
					title: i18n.t(element),
					format: "{0:n}",
					width:150,
					footerTemplate: this.footerTemplate,
					headerAttributes: headerAttributes,
					attributes: attributes,
				});
			}

			/* Set Columns */
			this.columns = columns;
		},
		footerTemplate (data) {
			return kendo.template("#= kendo.toString(sum, 'n') #")(data);
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
