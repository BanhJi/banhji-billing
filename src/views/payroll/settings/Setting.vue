<template>
	<v-row class="">
		<v-col sm="12" cols="12">
			<v-tabs
				vertical
				class="tab_setting tab_product_service_show"
				slider-color="grayBg"
				slider-size="7">
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("bank_account") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("tax_setting") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						NSSF Setting
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("payroll_component") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("periods_setting") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("department") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("position") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("leave") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("type_of_work") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("specific_work") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("Group") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("Prefix") }}
					</span>
				</v-tab>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<BankAccount />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<TaxSettings />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<NSSFSetting />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<PayrollComponent />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<PeriodsSettings />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<Department />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<Position />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<Leave />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<TypeOfWork />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<SpecificWork />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<Group />
						</v-card-text>
					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card flat>
						<v-card-text class="py-0 pr-0">
							<Prefix />
						</v-card-text>
					</v-card>
				</v-tab-item>
			</v-tabs>
		</v-col>
	</v-row>
</template>

<script>
	import BankAccount from "./BankAccount";
	import TaxSettings from "./TaxSettings";
	import PayrollComponent from "./PayrollComponent";
	import PeriodsSettings from "./PeriodsSettings";
	import Department from "./Department";
	import Position from "./Position";
	import NSSFSetting from "./NSSFSetting";
	import TypeOfWork from "./TypeOfWork";
	import SpecificWork from "./SpecificWork";
	import Leave from "./Leave";
	import Group from "./Group";
	import Prefix from "./Prefix";

	export default {
		data: () => ({}),
		props: {},
		methods: {
			clickMe(data) {
				// alert(data.link)
				this.$router.push(`${data.link}`);
				//this.$event.target.classList.toggle(active)
				//eslint-disable-next-line no-console
				console.log(data.link);
				//eslint-disable-next-line no-console
				//console.log(data)
			},
		},
		components: {
			Position,
			Department,
			PeriodsSettings,
			PayrollComponent,
			TaxSettings,
			BankAccount,
			NSSFSetting,
			TypeOfWork,
			SpecificWork,
			Leave,
			Group,
			Prefix,
		},
	};
</script>
<style scoped>
	.v-tab {
		justify-content: left !important;
		text-align: left !important;
		font-size: 16px;
		height: 55px !important;
	}
	.v-tab--active {
		background-color: rgb(255, 255, 255);
	}
	.v-tab--active {
		background-color: #ffffff !important;
		border-bottom: 4px solid #92d050;
		border-left: none;
	}
	.tab_setting .v-tab--active {
		font-weight: 700;
		color: #000;
	}

	@media (max-width: 576px) {
	}
</style>
