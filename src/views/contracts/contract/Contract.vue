<template>
    <v-row class="">
		<v-col sm="12" cols="12">
			<v-tabs vertical class="tab_setting tab_product_service_show" slider-color="grayBg" slider-size="7">
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("customer_type") }}
					</span>
				</v-tab>
				<v-tab>
					<span class="hidden-sm-and-up">
						<v-icon left>mdi-pen</v-icon>
					</span>
					<span class="hidden-sm-and-down text-capitalize">
						{{ $t("customer_group") }}
					</span>
				</v-tab>
				<v-tab-item>
					<v-row>
						<v-col sm="12" cols="12" class="pl-6 pt-0">
							<!-- <CustomerType /> -->
						</v-col>
					</v-row>
				</v-tab-item>
				<v-tab-item>
					<v-row>
						<v-col sm="12" cols="12" class="pl-6 pt-0">
							<!-- <CustomerGroup /> -->
						</v-col>
					</v-row>
				</v-tab-item>
			</v-tabs>
		</v-col>
    </v-row>
</template>

<script>
export default {
	data: () => ({}),
	props: {},
	methods: {

	},
	components: {
		
	},
};
</script>
<style scoped>
	.v-tab {
		justify-content: left;
		font-size: 16px;
	}
	.v-tab--active {
		background-color: rgb(255, 255, 255);
	}
	.tab_setting .v-tab--active {
		font-weight: 700;
		color: #000;
	}
	.v-tab--active {
		background-color: #ffffff !important;
		border-bottom: 4px solid #92d050;
		border-left: none;
	}
	.v-tabs-slider {
		background-color: #edf1f5 !important;
		padding-left: 6px;
		height: 100%;
		width: 100%;
	}
	@media (max-width: 576px) {
}
</style>
