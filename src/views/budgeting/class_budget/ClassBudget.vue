<template>
	<v-app>
		<v-container>
			<v-row>
				<v-col cols="12" sm="12">
					<v-card
						outlined
						dense
						class="pa-4 no_border rounded-sm"
						color="white"
					>
						<v-form ref="form" v-model="valid" lazy-validation>
							<v-card elevation="0" class=" mb-1">
								<h2 class="mb-0">{{ $t("class_budget") }}</h2>
								<v-icon
									onclick="window.history.go(-1); return false;"
									style="cursor: pointer; color: #333; font-size: 40px;"
									class="float-right"
									>close
								</v-icon>
							</v-card>

							<v-card
								outlined
								class="pa-3 pb-0 no_border"
								color="grayBg"
								min-height="98px"
							>
								<v-row>
									<v-col sm="3" cols="12" class="py-0">
										<label class="label">{{ $t("name") }}</label>
										<v-text-field
											class="mt-1"
											v-model="budget.name"
											:placeholder="$t('name')"
											outlined
											required
										/>
									</v-col>
									<v-col sm="3" cols="12" class="py-0">
										<label class="label">{{ $t("segment") }}</label>
										<app-segment-dropdownlist
											:initSegment="segment"
											@emitSegment="segment = $event"
										/>
									</v-col>
									<v-col sm="3" cols="12" class="py-0">
										<label class="label">{{ $t("project") }}</label>
										<app-project-dropdownlist
											:initProject="project"
											@emitProject="project = $event"
										/>
									</v-col>
									<v-col sm="3" cols="12" class="py-0">
										<label class="label">{{ $t("fiscal_year") }}</label>
										<app-fiscal-date-dropdownlist
											:initFiscalDate="budget.fiscal_year"
											@emitFiscalDate="budget.fiscal_year = $event"
											@onChanged="onFiscalDateChanges"
										/>
									</v-col>
								</v-row>
							</v-card>

							<v-card
								outlined
								class="rounded-0 mt-1"
								color="white"
								min-height="98px"
							>
								<v-row>
									<v-col sm="12" cols="12" class="">
										<kendo-datasource
											ref="budgetLineDS"
											:data="budgetLines"
											:schema="schemaDefinition"
											:sort="sortDefinition"
											:group="groupDefinition"
											:change="onDataSourceChanges"
										/>

										<kendo-grid
											id="budgetLineGrid"
											ref="budgetLineGrid"
											class="custom_grid"
											:data-source-ref="'budgetLineDS'"
											:dataBound="dataBound"
											:sortable="true"
											:column-menu="true"
											:resizable="true"
											:noRecords="true"
											:editable="true"
										>
											<kendo-grid-column
												:field="'classes.clazz.name'"
												:title="$t('nature')"
												:hidden="true"
												:groupHeaderTemplate="'<span>#=value#</span>'"
												:headerAttributes="{
													style: 'background-color: #EDF1F5;',
													class: 'text-products',
												}"
												:attributes="{
													style: 'text-align: products',
												}"
											/>
											<kendo-grid-column
												:field="'classes.classType.name'"
												:title="$t('class_type')"
												:hidden="true"
												:groupHeaderTemplate="'<span>#=value#</span>'"
												:headerAttributes="{
													style: 'background-color: #EDF1F5;',
													class: 'text-products',
												}"
												:attributes="{
													style: 'text-align: products',
												}"
											/>
											<kendo-grid-column
												:field="'classes.classGroup.name'"
												:title="$t('class_group')"
												:hidden="true"
												:groupHeaderTemplate="'<span>#=value#</span>'"
												:headerAttributes="{
													style: 'background-color: #EDF1F5;',
													class: 'text-products',
												}"
												:attributes="{
													style: 'text-align: products',
												}"
											/>
											<kendo-grid-column
												:field="'classes.classSubGroup.name'"
												:title="$t('class_sub_group')"
												:hidden="true"
												:groupHeaderTemplate="'<span>#=value#</span>'"
												:headerAttributes="{
													style: 'background-color: #EDF1F5;',
													class: 'text-products',
												}"
												:attributes="{
													style: 'text-align: products',
												}"
											/>
											<kendo-grid-column
												:field="'classes'"
												:title="$t('class')"
												:template="'<span>#=classes.code#</span> - <span>#=classes.name#</span>'"
												:width="350"
												:headerAttributes="{
													style: 'background-color: #EDF1F5;',
													class: 'text-products',
												}"
												:attributes="{
													style: 'text-align: products',
												}"
											/>
											<kendo-grid-column
												:field="'note'"
												:title="$t('note')"
												:width="200"
											/>
											<kendo-grid-column
												:title="$t('action')"
												:command="{ text: `Copy Across`, click: copyAcross }"
												:width="150"
											/>
											<kendo-grid-column
												:field="'monthly_amount[0].amount'"
												:title="$t(fiscalMonths[0])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right; padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[1].amount'"
												:title="$t(fiscalMonths[1])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right;padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[2].amount'"
												:title="$t(fiscalMonths[2])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right;padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[3].amount'"
												:title="$t(fiscalMonths[3])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right; padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[4].amount'"
												:title="$t(fiscalMonths[4])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right; padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[5].amount'"
												:title="$t(fiscalMonths[5])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right;padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[6].amount'"
												:title="$t(fiscalMonths[6])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right; padding-right:35px;background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[7].amount'"
												:title="$t(fiscalMonths[7])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right;padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[8].amount'"
												:title="$t(fiscalMonths[8])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right; padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[9].amount'"
												:title="$t(fiscalMonths[9])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right;padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[10].amount'"
												:title="$t(fiscalMonths[10])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right;padding-right:35px; background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'monthly_amount[11].amount'"
												:title="$t(fiscalMonths[11])"
												:format="'{0:n}'"
												:editor="NumberInputBoxEditor"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right; padding-right:35px;background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
											<kendo-grid-column
												:field="'amount'"
												:title="$t('total')"
												:format="'{0:n}'"
												:width="150"
												:headerAttributes="{
													style:
														'text-align: right; padding-right:35px;background-color: #EDF1F5',
												}"
												:attributes="{
													style: 'text-align: right; ',
												}"
											/>
										</kendo-grid>
									</v-col>
								</v-row>
							</v-card>

							<LoadingMe
								type="loading"
								:isLoading="showLoading"
								:myLoading="true"
								:fullPage="true"
							/>

							<!-- <v-divider /> -->
							<v-card outlined dense class="no_border  function_footer">
								<v-alert type="warning" v-model="alert" dismissible>
									<span v-html="errorMessage" />
								</v-alert>

								<v-btn
									color="primary"
									outlined
									class="text-capitalize  black--text float-left"
									@click="cancel"
									>{{ $t("cancel") }}
								</v-btn>
								<v-btn
									class="float-right text-capitalize  white--text"
									color="primary"
									@click="onSaveOptionClick(SaveOption.SAVECLOSE)"
								>
									{{ $t("save_close") }}
								</v-btn>
							</v-card>
						</v-form>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-app>
</template>

<script>
import { i18n } from "@/i18n";
import kendo from "@progress/kendo-ui";
import Helper from "@/helper.js";
import BudgetModel from "@/scripts/model/Budget.js";
import BudgetLineModel from "@/scripts/model/BudgetLine.js";
import SegmentModel from "@/scripts/model/Segment.js";
import ProjectModel from "@/scripts/model/Project.js";
import ClassModel from "@/scripts/model/Clazz.js";
import NumberInputBoxEditor from "@/scripts/kendo_editor/NumberInputBox.js";

/* Store */
import store from "@/store";
const institute = store.state.institute.institute;

const budgetHandler = require("@/scripts/handler/workingcapital/budgetHandler.js");
const { SaveOption } = require("@/scripts/default_setup/Collections");

export default {
	name : "ClassBudget",
	props: {
		initBudget: {
			type: BudgetModel,
		},
	},
	components: {
		LoadingMe: () => import("@/components/Loading"),
		"app-segment-dropdownlist": () =>
			import("@/components/dropdownlist/Segment"),
		"app-project-dropdownlist": () =>
			import("@/components/dropdownlist/Project"),
		"app-fiscal-date-dropdownlist": () =>
			import("@/components/kendo_templates/FiscalDateDropDownList"),
	},
	data: () => ({
		// Obj
		budget: new BudgetModel(),
		budgetLines: [],
		segment: new SegmentModel(),
		project: new ProjectModel(),
		classes: [],
		fiscalMonths: Helper.generateFiscalMonths(
			institute.fiscalDate[0].start_date,
			institute.fiscalDate[0].end_date,
			"12"
		),
		user: Helper.getUser(),
		// Form validation
		valid: true,
		isEdit: false,
		alert: false,
		errorMessage: "",
		saveMode: "",
		SaveOption: SaveOption,
		// LoadingMe
		showLoading: false,
		/* Kendo */
		NumberInputBoxEditor: NumberInputBoxEditor,
		sortDefinition: { field: "classes.code", dir: "asc" },
		schemaDefinition: {
			model: { id: "uuid" },
		},
		groupDefinition: [
			{ field: "classes.clazz.name" },
			{ field: "classes.classType.name" },
			{ field: "classes.classGroup.name" },
			{ field: "classes.classSubGroup.name" },
		],
	}),
	methods: {
		// Initial Data
		initialData() {
			if (this.initBudget) {
				// Edit Mode
				this.isEdit = true;
				this.budget = this.initBudget;
				this.bindData();
			} else {
				// Brand New
				this.isEdit = false;
				this.setDefaultData();
			}
		},
		// Set default data
		setDefaultData() {
			this.budget = new BudgetModel({
				fiscal_year: institute.fiscalDate[0],
			});
			this.setDefaultBudgetLine();
		},
		// Bind data for edit mode
		async bindData() {
			/* Segment */
			let segments = await this.$store.dispatch("segments/getList");
			this.segment = new SegmentModel(
				segments.find((i) => i.id === this.budget.segment_uuid)
			);

			/* Project */
			let projects = await this.$store.dispatch("projects/getList");
			this.project = new ProjectModel(
				projects.find((i) => i.id === this.budget.project_uuid)
			);

			this.setDefaultBudgetLine();
		},
		// Set Budget Lines
		async setDefaultBudgetLine() {
			this.showLoading = true;

			// Classes
			let classes = await this.$store.dispatch("classes/getList");

			let lines = [];
			classes.forEach((value) => {
				//Filter PL classes
				let line = new BudgetLineModel();
				line.account_uuid = value.id;//class_item_id

				// Month of with amount
				let monthOfAmountList = [];
				for (let i = 0; i < 12; i++) {
					// Set Month Of
					let sdate = new Date(this.budget.fiscal_year.start_date);
					sdate.setMonth(sdate.getMonth() + i);

					monthOfAmountList.push({
						month_of: sdate.toISOString().substr(0, 7),
						amount: 0,
					});
				}
				line.monthly_amount = monthOfAmountList;

				/* Matching Class */
				if (this.isEdit) {
					this.budget.lines.forEach((element) => {
						if (element.account_uuid === value.id) {
							line = new BudgetLineModel(element);

							return false;
						}
					});
				}

				/* Set class object */
				line.classes = new ClassModel(value);
				/* Nature set unknown */
				if(line.classes.clazz.name === ""){
					line.classes.clazz.name = "unknown";
				}
				/* Type set unknown */
				if(line.classes.classType.name === ""){
					line.classes.classType.name = "unknown";
				}
				/* Group set unknown */
				if(line.classes.classGroup.name === ""){
					line.classes.classGroup.name = "unknown";
				}
				/* Sub Group set unknown */
				if(line.classes.classSubGroup.name === ""){
					line.classes.classSubGroup.name = "unknown";
				}

				// Add line
				lines.push(line);
			});
      
			/* Bind Budget Line */
			this.budgetLines = lines;

			this.showLoading = false;
		},
		/* On Fiscal Date Changes */
		onFiscalDateChanges() {
			this.fiscalMonths = Helper.generateFiscalMonths(
				this.budget.fiscal_year.start_date,
				this.budget.fiscal_year.end_date,
				"12"
			);
			this.setDefaultBudgetLine();
		},
		// Copy Across
		copyAcross(e) {
			e.preventDefault();

			let grid = this.$refs.budgetLineGrid.kendoWidget(),
				dataItem = grid.dataItem(kendo.jQuery(e.target).closest("tr"));

			let amt = 0;
			dataItem.monthly_amount.forEach((value, index) => {
				if (index === 0) {
					amt = value.amount;
				} else {
					value.amount = amt;
				}
			});
			dataItem.set("amount", amt * 12);

			grid.refresh();
		},
		/* Databound */
		dataBound() {
			kendo.jQuery('#budgetLineGrid tbody .k-grouping-row:contains("unknown")').hide();
		},
		// DataSource Changes
		onDataSourceChanges() {
			this.dataSourceAutoCalculate();
		},
		// Auto Calculate In DataSource
		dataSourceAutoCalculate() {
			let ds = this.$refs.budgetLineDS.kendoWidget();

			// Sum Amount
			ds.data().forEach((value) => {
				let sumAmt = 0;
				value.monthly_amount.forEach((ele) => {
					sumAmt += ele.amount;
				});
				value.set("amount", sumAmt);
			});
		},
		// Shrink Data
		shrinkData() {
			// Segment
			this.budget.segment_uuid = this.segment.id;

			// Project
			this.budget.project_uuid = this.project.id;

			// Lines
			let ds = this.$refs.budgetLineDS.kendoWidget(),
				lines = [];
			ds.data().forEach((value) => {
				// Add class line with amount not 0
				if (value.amount !== 0) {
					lines.push(new BudgetLineModel(value));
				}
			});
			this.budget.lines = lines;

			// User
			if (this.isEdit) {
				this.budget.modified_by = this.user;
			} else {
				this.budget.created_by = this.user;
			}
		},
		// Validating
		validateForm() {
			let result = true,
				msg = "",
				ds = this.$refs.budgetLineDS.kendoWidget();

			// Name
			if (this.budget.name === "") {
				msg += `<p>${i18n.t("name_is_required")}</p>`;
				result = false;
			}

			// Segment
			if (this.segment === null) {
				msg += `<p>${i18n.t("segment_is_required")}</p>`;
				result = false;
			}

			// Project
			if (this.project === null) {
				msg += `<p>${i18n.t("project_is_required")}</p>`;
				result = false;
			}

			// Fiscal Year
			if (this.budget.fiscal_year === null) {
				msg += `<p>${i18n.t("fiscal_date_is_required")}</p>`;
				result = false;
			}

			// Amount
			let hasZeroAmount = true;
			ds.data().forEach((value) => {
				if (value.amount !== 0) {
					hasZeroAmount = false;

					return false;
				}
			});
			if (hasZeroAmount) {
				msg += `<p>${i18n.t("please_enter_amount")}</p>`;
				result = false;
			}

			// Show Alert
			this.errorMessage = msg;
			this.alert = false;
			if (result === false) {
				this.alert = true;
			}

			return result;
		},
		// All Saves
		async onSaveOptionClick(mode) {
			if (this.$refs.form.validate() && this.validateForm()) {
				this.saveMode = mode;
				this.save();
			}
		},
		cancel() {
			this.$swal({
				title: i18n.t("msg_title_warning"),
				text: i18n.t("msg_discard"),
				icon: "warning",
				showCancelButton: true,
				cancelButtonText: i18n.t("cancel"),
				confirmButtonColor: "#4d4848",
				cancelButtonColor: "#ED1A3A",
				confirmButtonText: i18n.t("discard"),
			}).then((result) => {
				if (result.value) {
					this.clear();
					this.setDefaultData();
					this.$router.go(-1);
				}
			});
		},
		clear() {
			this.isEdit = false;
			this.saveMode = "";

			this.budget = new BudgetModel();

			// Datasoure
			let ds = this.$refs.budgetLineDS.kendoWidget();
			ds.data([]);
		},
		save() {
			let self = this;

			// Shrink Data
			this.shrinkData();

			// Sync Data
			this.showLoading = true;
			budgetHandler
				.saveClassBudget(this.budget)
				.then((response) => {
					if (response) {
						/* Update Vuex Data */
						this.$store.dispatch("budgets/saveBudget", response.data);

						self.responseStatus(response);
					}
				})
				.catch((error) => {
					self.showLoading = false;
					Helper.alertErrorMsg(error);
				})
				.finally(() => {
					self.showLoading = false;
				});
		},
		// Response Status
		responseStatus(response) {
			if (response.status === 200) {
				if (
					this.saveMode === SaveOption.SAVECLOSE ||
					this.saveMode === SaveOption.DELETE
				) {
					/* Save Close or Delete */
					this.clear();
					this.setDefaultData();

					this.$router.go(-1);
				} else {
					/* Save New */
					this.clear();
					this.setDefaultData();
				}

				/* Alert Success */
				this.$snotify.success(i18n.t("successful"));
			} else {
				/* Alert Error */
				this.$snotify.error(i18n.t("error_something_wrong"));
			}
		},
	},
	watch: {
		initBudget() {
			this.initialData();
		},
	},
	mounted() {
		// Initial Data
		this.initialData();
	},
};
</script>

<style scoped>
.function_content {
	padding: 0 25px 25px;
	border-bottom: 0;
	background-color: #fff !important;
}

@media (min-width: 1264px) {
	.container {
		max-width: 1185px;
		/* max-width: 1280px !important; */
	}
}

.grayBg {
	background-color: #f8f8f9;
}

@media (max-width: 576px) {
	.mb-6 {
		margin-bottom: 0 !important;
	}
}

.section2 {
	border: 1px solid #d6d7d8;
}

.border_grey {
	border: 1px solid #d6d7d8;
}

.attachment_table {
	width: 100%;
}

.greyDark {
	background-color: #f2f2f2;
}

.upload_btn {
	width: 54%;
	margin: auto;
	padding: 10px 6px;
	text-align: center;
	color: #ffff;
	border-radius: 22px;
	background: #92d050;
}

.my_box_min_heihgt {
	height: 295px;
}

.width_100 {
	width: 100px;
}
.v-data-table.simple_table.theme--light {
	border-top: thin solid rgba(0, 0, 0, 0.12) !important;
}
.v-data-table.simple_table > .v-data-table__wrapper > table > tbody > tr > td {
	height: 32px !important;
	border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
	border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}
.theme--light.v-data-table.simple_table
	> .v-data-table__wrapper
	> table
	> thead
	> tr
	> th {
	border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}
.theme--light.v-data-table.simple_table
	> .v-data-table__wrapper
	> table
	> thead
	> tr:last-child
	> th {
	border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}
.theme--light.v-data-table.simple_table
	> .v-data-table__wrapper
	> table
	> thead
	> tr
	> th:last-child,
.v-data-table.simple_table
	> .v-data-table__wrapper
	> table
	> tbody
	> tr
	> td:last-child {
	border-right: none !important;
}
.theme--light.v-data-table
	> .v-data-table__wrapper
	> table
	> tbody
	> tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
	background-color: transparent !important;
}

.primary--text.text-left.v-btn:hover,
.theme--light.v-btn:hover::before {
	background: none !important;
}
</style>